
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonToolbar, ModalController, IonLabel,IonChip} from '@ionic/angular/standalone';
@Component({
  selector: 'app-edit-clients',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule,IonContent, IonHeader, IonToolbar, IonLabel,IonChip], // Dépendances importées
  templateUrl: './edit-clients.component.html',
  styleUrls: ['./edit-clients.component.scss']
})
export class EditClientsComponent {
  reactiveForm_edit_clients !: FormGroup;
  submitted: boolean = false
  loading_edit_clients: boolean = false
  @Input()
  clients_to_edit: any = {}
  form_details: any = {}
  loading_get_details_edit_clients_form = false
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: ModalController) {

  }
  ngOnInit(): void {
    this.get_details_edit_clients_form()
    this.update_form(this.clients_to_edit)
  }
  // mise à jour du formulaire
  update_form(clients_to_edit: any) {
    this.reactiveForm_edit_clients = this.formBuilder.group({
      id: [clients_to_edit.id, Validators.required],
      nom_client: [clients_to_edit.nom_client, Validators.required],
      telephone: [clients_to_edit.telephone],
      adresse: [clients_to_edit.adresse],
      id_entreprise: [clients_to_edit.id_entreprise, Validators.required]
    });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_edit_clients.controls; }
  // validation du formulaire
  onSubmit_edit_clients() {
    this.submitted = true;
    console.log(this.reactiveForm_edit_clients.value)
    // stop here if form is invalid
    if (this.reactiveForm_edit_clients.invalid) {
      return;
    }
    var clients = this.reactiveForm_edit_clients.value
    this.edit_clients(clients);
  }
  // vider le formulaire
  onReset_edit_clients() {
    this.submitted = false;
    this.reactiveForm_edit_clients.reset();
  }
  edit_clients(clients: any) {
    this.loading_edit_clients = true;
    this.api.taf_put("clients/" + clients.id, clients, (reponse: any) => {
      if (reponse.status_code) {
        this.activeModal.dismiss(reponse)
        console.log("Opération effectuée avec succés sur la table clients. Réponse= ", reponse);
        //this.onReset_edit_clients()
        this.api.Swal_success("Opération éffectuée avec succés")
      } else {
        console.log("L'opération sur la table clients a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_edit_clients = false;
    }, (error: any) => {
      this.loading_edit_clients = false;
    })
  }
  get_details_edit_clients_form() {
    this.loading_get_details_edit_clients_form = true;
    this.api.taf_get("clients/getformdetails/" + this.api.id_current_entreprise, (reponse: any) => {
      if (reponse.status_code) {
        this.form_details = reponse.data
        console.log("Opération effectuée avec succés sur la table clients. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table clients a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_details_edit_clients_form = false;
    }, (error: any) => {
      this.loading_get_details_edit_clients_form = false;
    })
  }
}
