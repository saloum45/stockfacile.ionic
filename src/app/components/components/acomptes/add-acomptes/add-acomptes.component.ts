
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { IonContent,IonHeader,IonToolbar,ModalController,IonChip,IonLabel } from '@ionic/angular/standalone';
@Component({
  selector: 'app-add-acomptes',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule,IonChip,IonContent,IonHeader,IonToolbar,IonLabel], // Dépendances importées
  templateUrl: './add-acomptes.component.html',
  styleUrls: ['./add-acomptes.component.scss']
})
export class AddAcomptesComponent {
  reactiveForm_add_acomptes !: FormGroup;
  submitted: boolean = false
  loading_add_acomptes: boolean = false
  form_details: any = {}
  loading_get_details_add_acomptes_form = false

  @Input() selected_vente: any;
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: ModalController) { }

  ngOnInit(): void {
    console.log(this.selected_vente);

    this.get_details_add_acomptes_form()
    this.init_form()
  }
  init_form() {
    this.reactiveForm_add_acomptes = this.formBuilder.group({
      montant: [this.selected_vente.reste_a_payer, [Validators.required,Validators.max(this.selected_vente.reste_a_payer)]],
      date: [this.api.format_current_date().jma3, Validators.required],
      id_mode_paiement: [1, Validators.required],
      id_vente: [this.selected_vente.id, Validators.required],
      id_entreprise: [this.api.id_current_entreprise, Validators.required],

    });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_add_acomptes.controls; }
  // validation du formulaire
  onSubmit_add_acomptes() {
    this.submitted = true;
    console.log(this.reactiveForm_add_acomptes.value)
    // stop here if form is invalid
    if (this.reactiveForm_add_acomptes.invalid) {
      return;
    }
    var acomptes = this.reactiveForm_add_acomptes.value;
    this.add_acomptes(acomptes)
  }
  // vider le formulaire
  onReset_add_acomptes() {
    this.submitted = false;
    this.reactiveForm_add_acomptes.reset();
  }
  add_acomptes(acomptes: any) {
    this.loading_add_acomptes = true;
    this.api.taf_post("acomptes", acomptes, (reponse: any) => {
      this.loading_add_acomptes = false;
      if (reponse.status_code) {
        console.log("Opération effectuée avec succés sur la table acomptes. Réponse= ", reponse);
        this.onReset_add_acomptes()
        this.api.Swal_success("Opération éffectuée avec succés")
        // reponse.montant_verser_acompte=acomptes.montant;
        this.activeModal.dismiss(reponse)
      } else {
        console.log("L'opération sur la table acomptes a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
    }, (error: any) => {
      this.loading_add_acomptes = false;
    })
  }

  get_details_add_acomptes_form() {
    this.loading_get_details_add_acomptes_form = true;
    this.api.taf_get("acomptes/getformdetails/" + this.api.id_current_entreprise, (reponse: any) => {
      if (reponse.status_code) {
        this.form_details = reponse.data
        console.log("Opération effectuée avec succés sur la table acomptes. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table acomptes a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_details_add_acomptes_form = false;
    }, (error: any) => {
      this.loading_get_details_add_acomptes_form = false;
    })
  }
}
