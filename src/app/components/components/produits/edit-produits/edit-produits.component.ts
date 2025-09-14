
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalController,IonContent,IonHeader,IonChip,IonToolbar,IonLabel } from '@ionic/angular/standalone';
@Component({
  selector: 'app-edit-produits',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule,IonContent,IonHeader,IonChip,IonToolbar,IonLabel], // Dépendances importées
  templateUrl: './edit-produits.component.html',
  styleUrls: ['./edit-produits.component.scss']
})
export class EditProduitsComponent {
  reactiveForm_edit_produits !: FormGroup;
  submitted: boolean = false
  loading_edit_produits: boolean = false
  @Input()
  produits_to_edit: any = {}
  form_details: any = {}
  loading_get_details_edit_produits_form = false
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: ModalController) {

  }
  ngOnInit(): void {
    this.get_details_edit_produits_form()
    this.update_form(this.produits_to_edit)
  }
  // mise à jour du formulaire
  update_form(produits_to_edit: any) {
    this.reactiveForm_edit_produits = this.formBuilder.group({
      id: [produits_to_edit.id, Validators.required],
      libelle_produit: [produits_to_edit.libelle_produit, Validators.required],
      prix_vente: [produits_to_edit.prix_vente, Validators.required],
      prix_achat: [produits_to_edit.prix_achat],
      id_unite_mesure: [produits_to_edit.id_unite_mesure, Validators.required],
      seuil_stock: [produits_to_edit.seuil_stock, Validators.required],
      id_entreprise: [produits_to_edit.id_entreprise, Validators.required],
      id_categorie: [produits_to_edit.id_categorie, Validators.required]
    });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_edit_produits.controls; }
  // validation du formulaire
  onSubmit_edit_produits() {
    this.submitted = true;
    console.log(this.reactiveForm_edit_produits.value)
    // stop here if form is invalid
    if (this.reactiveForm_edit_produits.invalid) {
      return;
    }
    var produits = this.reactiveForm_edit_produits.value
    this.edit_produits(produits);
  }
  // vider le formulaire
  onReset_edit_produits() {
    this.submitted = false;
    this.reactiveForm_edit_produits.reset();
  }
  edit_produits(produits: any) {
    this.loading_edit_produits = true;
    this.api.taf_put("produits/" + produits.id, produits, (reponse: any) => {
      if (reponse.status_code) {
        this.activeModal.dismiss(reponse)
        console.log("Opération effectuée avec succés sur la table produits. Réponse= ", reponse);
        //this.onReset_edit_produits()
        this.api.Swal_success("Opération éffectuée avec succés")
      } else {
        console.log("L'opération sur la table produits a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_edit_produits = false;
    }, (error: any) => {
      this.loading_edit_produits = false;
    })
  }
  get_details_edit_produits_form() {
    this.loading_get_details_edit_produits_form = true;
    this.api.taf_get("produits/getformdetails/"+this.api.id_current_entreprise, (reponse: any) => {
      if (reponse.status_code) {
        this.form_details = reponse.data;
        this.form_details.unite_mesures.map((one: any) => {
          one.info = `${one.nom} ${one.symbole}`
          return one;
        })
        console.log("Opération effectuée avec succés sur la table produits. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table produits a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_details_edit_produits_form = false;
    }, (error: any) => {
      this.loading_get_details_edit_produits_form = false;
    })
  }
}
