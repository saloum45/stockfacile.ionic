
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { IonContent,IonHeader,IonToolbar,ModalController,IonChip,IonLabel } from '@ionic/angular/standalone';
@Component({
  selector: 'app-edit-acomptes',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule,NgSelectModule,IonContent,IonHeader,IonToolbar,IonChip,IonLabel], // Dépendances importées
  templateUrl: './edit-acomptes.component.html',
  styleUrls: ['./edit-acomptes.component.scss']
})
export class EditAcomptesComponent {
  reactiveForm_edit_acomptes !: FormGroup;
  submitted: boolean = false
  loading_edit_acomptes: boolean = false
  @Input()
  acomptes_to_edit: any = {}
  @Input() selected_vente: any;
  form_details: any = {}
  loading_get_details_edit_acomptes_form = false
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: ModalController) {

  }
  ngOnInit(): void {
    this.get_details_edit_acomptes_form()
    this.update_form(this.acomptes_to_edit)
  }
  // mise à jour du formulaire
  update_form(acomptes_to_edit: any) {
    this.reactiveForm_edit_acomptes = this.formBuilder.group({
      id: [acomptes_to_edit.id, Validators.required],
      montant: [acomptes_to_edit.montant, [Validators.required,Validators.max((this.selected_vente.reste_a_payer)+acomptes_to_edit.montant)]],
      date: [acomptes_to_edit.date, Validators.required],
      id_mode_paiement: [acomptes_to_edit.id_mode_paiement, Validators.required],
      id_vente: [acomptes_to_edit.id_vente, Validators.required],
      id_entreprise: [this.api.id_current_entreprise, Validators.required],
    });

  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_edit_acomptes.controls; }
  // validation du formulaire
  onSubmit_edit_acomptes() {
    this.submitted = true;
    console.log(this.reactiveForm_edit_acomptes.value)
    // stop here if form is invalid
    if (this.reactiveForm_edit_acomptes.invalid) {
      return;
    }
    var acomptes = this.reactiveForm_edit_acomptes.value
    this.edit_acomptes(acomptes);
  }
  // vider le formulaire
  onReset_edit_acomptes() {
    this.submitted = false;
    this.reactiveForm_edit_acomptes.reset();
  }
  edit_acomptes(acomptes: any) {
    this.loading_edit_acomptes = true;
    this.api.taf_put("acomptes/" + acomptes.id, acomptes, (reponse: any) => {
      if (reponse.status_code) {
        this.activeModal.dismiss(reponse)
        console.log("Opération effectuée avec succés sur la table acomptes. Réponse= ", reponse);
        //this.onReset_edit_acomptes()
        this.api.Swal_success("Opération éffectuée avec succés")
      } else {
        console.log("L'opération sur la table acomptes a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_edit_acomptes = false;
    }, (error: any) => {
      this.loading_edit_acomptes = false;
    })
  }
  get_details_edit_acomptes_form() {
    this.loading_get_details_edit_acomptes_form = true;
    this.api.taf_get("acomptes/getformdetails/"+this.api.id_current_entreprise, (reponse: any) => {
      if (reponse.status_code) {
        this.form_details = reponse.data
        console.log("Opération effectuée avec succés sur la table acomptes. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table acomptes a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_details_edit_acomptes_form = false;
    }, (error: any) => {
      this.loading_get_details_edit_acomptes_form = false;
    })
  }
}
