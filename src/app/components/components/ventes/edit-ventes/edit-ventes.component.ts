
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormArray, FormsModule } from '@angular/forms';
import { ApiService } from '../../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { NgSelectModule } from '@ng-select/ng-select';
@Component({
  selector: 'app-edit-ventes',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule, FormsModule], // Dépendances importées
  templateUrl: './edit-ventes.component.html',
  styleUrls: ['./edit-ventes.component.scss']
})
export class EditVentesComponent {
  reactiveForm_edit_ventes !: FormGroup;
  submitted: boolean = false
  loading_edit_ventes: boolean = false
  @Input()
  ventes_to_edit: any = {}
  form_details: any = {}
  loading_get_details_edit_ventes_form = false
  selectedEntrepots: (number | null)[] = [];
  stockInsuffisant: boolean[] = [];
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: ModalController) {

  }
  ngOnInit(): void {
    this.get_details_edit_ventes_form()
    this.update_form(this.ventes_to_edit)
  }
  // mise à jour du formulaire
  update_form(ventes_to_edit: any) {
    this.reactiveForm_edit_ventes = this.formBuilder.group({
      id: [ventes_to_edit.id, Validators.required],
      date: [ventes_to_edit.date, Validators.required],
      id_client: [ventes_to_edit.id_client || ""],
      id_etat_vente: [ventes_to_edit.id_etat_vente, Validators.required],
      id_entreprise: [ventes_to_edit.id_entreprise, Validators.required],
      // id_mode_paiement: [1, Validators.required],
      // montant_verser: ['', Validators.required],
      les_details: this.formBuilder.array(this.ventes_to_edit?.detail_ventes?.map((one: any, index: number) => { return this.init_details(one, index); }))
    });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_edit_ventes.controls; }
  // validation du formulaire
  onSubmit_edit_ventes() {
    this.submitted = true;
    console.log(this.reactiveForm_edit_ventes.value)
    // stop here if form is invalid
    if (this.reactiveForm_edit_ventes.invalid) {
      return;
    }
    var ventes = this.reactiveForm_edit_ventes.value
    this.edit_ventes(ventes);
  }
  // vider le formulaire
  onReset_edit_ventes() {
    this.submitted = false;
    this.reactiveForm_edit_ventes.reset();
  }
  edit_ventes(ventes: any) {
    this.loading_edit_ventes = true;
    this.api.taf_put("ventes/" + ventes.id, ventes, (reponse: any) => {
      if (reponse.status_code) {
        this.activeModal.dismiss(reponse)
        console.log("Opération effectuée avec succés sur la table ventes. Réponse= ", reponse);
        // this.ventes_to_edit.les_details=this.reactiveForm_edit_ventes.value.les_details;
        //this.onReset_edit_ventes()
        this.api.Swal_success("Opération éffectuée avec succés")
      } else {
        console.log("L'opération sur la table ventes a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_edit_ventes = false;
    }, (error: any) => {
      this.loading_edit_ventes = false;
    })
  }
  get_details_edit_ventes_form() {
    this.loading_get_details_edit_ventes_form = true;
    this.api.taf_get("ventes/getformdetails/" + this.api.id_current_entreprise, (reponse: any) => {
      if (reponse.status_code) {
        this.form_details = reponse.data
        this.form_details.produits = this.api.produit_grouped_by(this.form_details.produits);
        console.log("Opération effectuée avec succés sur la table ventes. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table ventes a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_details_edit_ventes_form = false;
    }, (error: any) => {
      this.loading_get_details_edit_ventes_form = false;
    })
  }

  get_produits(): any[] {
    this.form_details?.produits?.map((one: any) => {
      one.info = `${one.libelle_produit} (${one.quantite_total} disponible)`;
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
          this.les_details.at(index).get('id_rangement')?.setValue(rangements[0].id);
          this.les_details.at(index).get('quantite')?.setValidators([Validators.max(rangements[0].quantite)]);
          this.les_details.at(index).get('quantite')?.updateValueAndValidity();
        }
      }, 0);
    }
  }

  get_entrepot_by_product(index: any): any[] {
    const produitId = this.les_details.at(index).get('id_produit')?.value;
    const produit = this.form_details?.produits?.find((p: any) => p.id == produitId);

    produit?.entrepots.map((one: any) => {
      one.info = `${one.nom} (${one.quantite}) en stock`
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
          this.les_details.at(index).get('id_rangement')?.setValue(rangements[0].id);
          this.les_details.at(index).get('quantite')?.setValidators([Validators.max(rangements[0].quantite)]);
          this.les_details.at(index).get('quantite')?.updateValueAndValidity();
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

    entrepot?.rangements.map((one: any) => {
      one.info = `${one.nom} (${one.quantite} dispo)`;
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

  calculer_total(): number {
    let montant = this.les_details.controls.reduce((total, detail) => {
      return total + (+detail.get('quantite')?.value || 0) * (+detail.get('prix_unitaire')?.value || 0);
    }, 0);
    this.reactiveForm_edit_ventes.patchValue({
      montant_verser: montant
    });
    return montant
  }

  get les_details(): FormArray {
    return this.reactiveForm_edit_ventes.get('les_details') as FormArray;
  }

  init_details(one_detail?: any, index?: any): FormGroup {
    if (one_detail) {
      let id_entrepot = this.ventes_to_edit.detail_ventes.find((one: any, index: any) => one.id_produit == one_detail?.id_produit).rangement.entrepot.id
      this.selectedEntrepots[index] = id_entrepot;
    }
    // const rangements = this.get_rangements_disponibles(index);
    // if (rangements.length > 0) {
    //   this.les_details.at(index).get('quantite')?.setValidators([Validators.max(rangements[0].quantite)]);
    //   this.les_details.at(index).get('quantite')?.updateValueAndValidity();
    // }
    return this.formBuilder.group({
      id_produit: [one_detail?.id_produit || "", Validators.required],
      id_rangement: [one_detail?.id_rangement || "", Validators.required],
      quantite: [one_detail?.quantite || 1, Validators.required],
      prix_unitaire: [one_detail?.prix_unitaire || "", Validators.required],
      id_entreprise: [one_detail?.id_entreprise || this.api.id_current_entreprise, Validators.required]
    })
  }

  add_detail() {
    (this.f.les_details as FormArray).push(this.init_details());
  }

  remove_detail(index: number) {
    const les_details = this.f.les_details as FormArray;
    if (les_details.length > 1) {
      les_details.removeAt(index);
      this.reactiveForm_edit_ventes.markAsDirty();
    }
  }
}
