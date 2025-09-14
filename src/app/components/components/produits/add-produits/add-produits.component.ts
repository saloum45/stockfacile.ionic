
import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalController,IonContent,IonHeader,IonChip,IonToolbar,IonLabel } from '@ionic/angular/standalone';
@Component({
  selector: 'app-add-produits',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule,IonContent,IonHeader,IonChip,IonToolbar,IonLabel], // Dépendances importées
  templateUrl: './add-produits.component.html',
  styleUrls: ['./add-produits.component.scss']
})
export class AddProduitsComponent {
  reactiveForm_add_produits !: FormGroup;
  submitted: boolean = false
  loading_add_produits: boolean = false
  form_details: any = {}
  loading_get_details_add_produits_form = false
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: ModalController) { }

  ngOnInit(): void {
    this.get_details_add_produits_form()
    this.init_form()
  }
  init_form() {
    this.reactiveForm_add_produits = this.formBuilder.group({
      libelle_produit: ["", Validators.required],
      prix_vente: ["", Validators.required],
      prix_achat: [""],
      id_unite_mesure: [, Validators.required],
      seuil_stock: ["5", Validators.required],
      id_entreprise: [this.api.id_current_entreprise, Validators.required],
      id_categorie: [, Validators.required]
    });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_add_produits.controls; }
  // validation du formulaire
  onSubmit_add_produits() {
    this.submitted = true;
    console.log(this.reactiveForm_add_produits.value)
    // stop here if form is invalid
    if (this.reactiveForm_add_produits.invalid) {
      return;
    }
    var produits = this.reactiveForm_add_produits.value
    this.add_produits(produits)
  }
  // vider le formulaire
  onReset_add_produits() {
    this.submitted = false;
    this.reactiveForm_add_produits.reset();
  }
  add_produits(produits: any) {
    this.loading_add_produits = true;
    this.api.taf_post("produits", produits, (reponse: any) => {
      this.loading_add_produits = false;
      if (reponse.status_code) {
        console.log("Opération effectuée avec succés sur la table produits. Réponse= ", reponse);
        this.onReset_add_produits()
        this.api.Swal_success("Opération éffectuée avec succés")
        this.activeModal.dismiss(reponse)
      } else {
        console.log("L'opération sur la table produits a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
    }, (error: any) => {
      this.loading_add_produits = false;
    })
  }

  get_details_add_produits_form() {
    this.loading_get_details_add_produits_form = true;
    this.api.taf_get("produits/getformdetails/"+this.api.id_current_entreprise, (reponse: any) => {
      if (reponse.status_code) {
        this.form_details = reponse.data;
        this.form_details.unite_mesures.map((one: any) => {
          one.info = `${one.nom} (${one.symbole})`
          return one;
        })
        console.log("Opération effectuée avec succés sur la table produits. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table produits a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_details_add_produits_form = false;
    }, (error: any) => {
      this.loading_get_details_add_produits_form = false;
    })
  }
}
