
import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonToolbar, ModalController, IonLabel,IonChip} from '@ionic/angular/standalone';
@Component({
  selector: 'app-add-clients',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule,IonContent, IonHeader,IonToolbar, IonLabel,IonChip ], // Dépendances importées
  templateUrl: './add-clients.component.html',
  styleUrls: ['./add-clients.component.scss']
})
export class AddClientsComponent {
  reactiveForm_add_clients !: FormGroup;
  submitted: boolean = false
  loading_add_clients: boolean = false
  form_details: any = {}
  loading_get_details_add_clients_form = false
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: ModalController) { }

  ngOnInit(): void {
    this.get_details_add_clients_form()
    this.init_form()
  }
  init_form() {
    this.reactiveForm_add_clients = this.formBuilder.group({
      nom_client: ["", Validators.required],
      telephone: [""],
      adresse: [""],
      id_entreprise: [this.api.id_current_entreprise, Validators.required]
    });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_add_clients.controls; }
  // validation du formulaire
  onSubmit_add_clients() {
    this.submitted = true;
    console.log(this.reactiveForm_add_clients.value)
    // stop here if form is invalid
    if (this.reactiveForm_add_clients.invalid) {
      return;
    }
    var clients = this.reactiveForm_add_clients.value
    this.add_clients(clients)
  }
  // vider le formulaire
  onReset_add_clients() {
    this.submitted = false;
    this.reactiveForm_add_clients.reset();
  }
  add_clients(clients: any) {
    this.loading_add_clients = true;
    this.api.taf_post("clients", clients, (reponse: any) => {
      this.loading_add_clients = false;
      if (reponse.status_code) {
        console.log("Opération effectuée avec succés sur la table clients. Réponse= ", reponse);
        this.onReset_add_clients()
        this.api.Swal_success("Opération éffectuée avec succés")
        this.activeModal.dismiss(reponse)
      } else {
        console.log("L'opération sur la table clients a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
    }, (error: any) => {
      this.loading_add_clients = false;
    })
  }

  get_details_add_clients_form() {
    this.loading_get_details_add_clients_form = true;
    this.api.taf_get("clients/getformdetails/"+this.api.id_current_entreprise, (reponse: any) => {
      if (reponse.status_code) {
        this.form_details = reponse.data
        console.log("Opération effectuée avec succés sur la table clients. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table clients a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_details_add_clients_form = false;
    }, (error: any) => {
      this.loading_get_details_add_clients_form = false;
    })
  }
}
