
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormArray, FormsModule } from '@angular/forms';
import { ApiService } from '../../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { NgSelectModule } from "@ng-select/ng-select";
@Component({
  selector: 'app-add-ventes',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgSelectModule],
  templateUrl: './add-ventes.component.html',
  styleUrls: ['./add-ventes.component.scss']
})
export class AddVentesComponent {
  reactiveForm_add_ventes !: FormGroup;
  submitted: boolean = false
  loading_add_ventes: boolean = false
  form_details: any = {}
  loading_get_details_add_ventes_form = false
  selectedEntrepots: (number | null)[] = [];
  stockInsuffisant: boolean[] = [];
  montant_total = 0;
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: ModalController) { }

  ngOnInit(): void {
    this.get_details_add_ventes_form()
    this.init_form()
  }
  init_form() {
    this.reactiveForm_add_ventes = this.formBuilder.group({
      date: [this.api.format_current_date().jma3, Validators.required],
      id_client: [],
      id_etat_vente: [1, Validators.required],
      id_entreprise: [this.api.id_current_entreprise, Validators.required],
      les_details: this.formBuilder.array([this.init_details()]),
      id_mode_paiement: [1, Validators.required],
      montant_verser: [, Validators.required]
    });
  }

  init_details(): FormGroup {
    return this.formBuilder.group({
      id_produit: [, Validators.required],
      id_rangement: [, Validators.required],
      quantite: [1, Validators.required],
      prix_unitaire: ["", Validators.required],
      id_entreprise: [this.api.id_current_entreprise, Validators.required]
    })
  }

  add_detail() {
    (this.f.les_details as FormArray).push(this.init_details());
  }

  remove_detail(index: number) {
    const les_details = this.f.les_details as FormArray;
    if (les_details.length > 1) {
      les_details.removeAt(index);
    }
  }

  get les_details(): FormArray {
    return this.reactiveForm_add_ventes.get('les_details') as FormArray;
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_add_ventes.controls; }
  // validation du formulaire
  onSubmit_add_ventes() {
    this.submitted = true;
    console.log(this.reactiveForm_add_ventes.value)
    // stop here if form is invalid
    if (this.reactiveForm_add_ventes.invalid) {
      return;
    }
    var ventes = this.reactiveForm_add_ventes.value
    this.add_ventes(ventes)
  }
  // vider le formulaire
  onReset_add_ventes() {
    this.submitted = false;
    this.reactiveForm_add_ventes.reset();
  }
  add_ventes(ventes: any) {
    this.loading_add_ventes = true;
    this.api.taf_post("ventes", ventes, (reponse: any) => {
      this.loading_add_ventes = false;
      if (reponse.status_code) {
        console.log("Opération effectuée avec succés sur la table ventes. Réponse= ", reponse);
        this.onReset_add_ventes()
        this.api.Swal_success("Opération éffectuée avec succés")
        this.activeModal.dismiss(reponse)
      } else {
        console.log("L'opération sur la table ventes a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
    }, (error: any) => {
      this.loading_add_ventes = false;
    })
  }

  get_details_add_ventes_form() {
    this.loading_get_details_add_ventes_form = true;
    this.api.taf_get("ventes/getformdetails/" + this.api.id_current_entreprise, (reponse: any) => {
      if (reponse.status_code) {
        this.form_details = reponse.data;
        this.form_details.produits = this.api.produit_grouped_by(this.form_details.produits);
        console.warn("Opération effectuée avec succés sur la table ventes. Réponse= ", this.form_details.produits);
        console.log("Opération effectuée avec succés sur la table ventes. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table ventes a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_details_add_ventes_form = false;
    }, (error: any) => {
      this.loading_get_details_add_ventes_form = false;
    })
  }

  get_produits(): any[] {
    this.form_details?.produits?.map((one: any) => {
      one.info = `${one.libelle_produit} (${one.quantite_total} en stock)`;
      one.quantite_total <= 0 ? one.disabled = true : one.disabled = false
      return one
    });

    return this.form_details.produits;
  }

  on_produit_change(index: any) {
    // Réinitialiser les champs dépendants
    this.selectedEntrepots[index] = null;
    this.les_details.at(index).get('id_rangement')?.reset();

    const produitId = this.les_details.at(index).get('id_produit')?.value;

    // Vérification sécurisée
    const produit = this.form_details?.produits?.find((p: any) => p.id == produitId);
    if (produit && produit.entrepots?.length > 0) {
      // Sélectionner le premier entrepot
      this.selectedEntrepots[index] = produit.entrepots[0].id;

      // Mettre à jour le prix unitaire
      this.les_details.at(index).get('prix_unitaire')?.setValue(produit?.prix_vente || 0);

      // Force la mise à jour du DOM avec setTimeout
      setTimeout(() => {
        // Sélectionner le premier rangement disponible
        const rangements = this.get_rangements_disponibles(index);
        if (rangements.length > 0) {
          let rangement_stock = rangements.find((one: any) => one.quantite > 0);
          this.les_details.at(index).get('id_rangement')?.setValue(rangement_stock.id);
          this.les_details.at(index).get('quantite')?.setValidators([
            Validators.min(1),
            Validators.max(rangement_stock.quantite) // ou autre valeur dynamique
          ]);
          this.les_details.at(index).get('quantite')?.updateValueAndValidity({ emitEvent: false });
        }
      }, 0);
    }
    this.calculer_total()
  }

  get_entrepot_by_product(index: any): any[] {
    const produitId = this.les_details.at(index).get('id_produit')?.value;
    const produit = this.form_details?.produits?.find((p: any) => p.id == produitId);
    // produit.entrepots=produit?.entrepots.filter((one:any)=>one.quantite>0);
    produit?.entrepots.map((one: any) => {
      one.info = `${one.nom} (${one.quantite} en stock)`
      one.quantite <= 0 ? one.disabled = true : one.disabled = false
      return one
    })
    return produit?.entrepots || [];
  }

  on_entrepot_change(index: number, event: any) {
    const entrepotId = event.id;
    this.selectedEntrepots[index] = entrepotId ? Number(entrepotId) : null;

    // Réinitialiser le rangement sélectionné
    this.les_details.at(index).get('id_rangement')?.reset();

    // Si un entrepot est sélectionné, sélectionner le premier rangement disponible
    if (entrepotId) {
      const rangements = this.get_rangements_disponibles(index);
      if (rangements.length > 0) {
        // Sélectionner le premier rangement
        setTimeout(() => {
          let rangement_stock = rangements.find((one: any) => one.quantite > 0);
          this.les_details.at(index).get('id_rangement')?.setValue(rangement_stock.id);
          this.les_details.at(index).get('quantite')?.setValidators([
            Validators.min(1),
            Validators.max(rangement_stock.quantite) // ou autre valeur dynamique
          ]);
          this.les_details.at(index).get('quantite')?.updateValueAndValidity({ emitEvent: false });
        }, 0);
      }
    }

    this.verifier_stock(index);
  }

  get_rangements_disponibles(index: number): any[] {
    const produitId = this.les_details.at(index).get('id_produit')?.value;
    const entrepotId = this.selectedEntrepots[index];

    const produit = this.form_details.produits?.find((p: any) => p.id == produitId);

    const entrepot = produit?.entrepots?.find((e: any) => e.id == entrepotId);

    if (!produit || !entrepotId) return [];

    // entrepot.rangements=entrepot?.rangements.filter((one:any)=>one.quantite>0);
    entrepot?.rangements.map((one: any) => {
      one.info = `${one.nom} (${one.quantite} en stock)`;
      one.quantite <= 0 ? one.disabled = true : one.disabled = false
      return one;
    })

    return entrepot?.rangements || [];
  }

  verifier_stock(index: number) {
    const quantite = this.les_details.at(index).get('quantite')?.value;
    const max = this.get_stock_max(index);
    this.stockInsuffisant[index] = quantite > max;
  }

  get_stock_max(index: number): number {
    const detail = this.les_details.at(index);
    const produitId = detail.get('id_produit')?.value;
    const rangementId = detail.get('id_rangement')?.value;

    if (!produitId || !rangementId) return 0;

    const produit = this.form_details.produits.find((p: any) => p.id == produitId);
    const rangement = produit.entrepots
      .flatMap((e: any) => e.rangements)
      .find((r: any) => r.id == rangementId);

    return rangement?.quantite || 0;
  }

  calculer_total() {
    this.montant_total = this.les_details.controls.reduce((total, detail) => {
      return total + (+detail.get('quantite')?.value || 0) * (+detail.get('prix_unitaire')?.value || 0);
    }, 0);

    this.reactiveForm_add_ventes.patchValue({
      montant_verser: this.montant_total
    });
  }
}
