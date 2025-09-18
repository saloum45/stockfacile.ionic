
import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { ApiService } from '../../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalController,IonContent,IonHeader,IonToolbar,IonChip,IonLabel } from '@ionic/angular/standalone';
@Component({
  selector: 'app-add-approvisionnements',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule,IonContent,IonHeader,IonToolbar,IonChip,IonLabel], // Dépendances importées
  templateUrl: './add-approvisionnements.component.html',
  styleUrls: ['./add-approvisionnements.component.scss']
})
export class AddApprovisionnementsComponent {
  reactiveForm_add_approvisionnements !: FormGroup;
  submitted: boolean = false
  loading_add_approvisionnements: boolean = false
  form_details: any = {}
  loading_get_details_add_approvisionnements_form = false

  les_rangements: any[] = [];
  rangementsParDetail: any[][] = [];
  constructor(private formBuilder: FormBuilder, public api: ApiService, public modalService: ModalController) { }

  ngOnInit(): void {
    this.get_details_add_approvisionnements_form()
    this.init_form()
  }
  init_form() {
    this.reactiveForm_add_approvisionnements = this.formBuilder.group({
      // titre: ["",],
      // description: ["", Validators.required],
      date: [this.api.format_current_date().jma3, Validators.required],
      // numero: ["", Validators.required],
      id_etat_approvisionnement: [2, Validators.required],
      id_fournisseur: [, Validators.required],
      id_entreprise: [this.api.id_current_entreprise, Validators.required],
      les_details: this.formBuilder.array([this.init_details()]),
    });
  }

  init_details(): FormGroup {
    return this.formBuilder.group({
      quantite: [1, Validators.required],
      prix_achat: [""],
      date_peremption: [""],
      id_rangement: [, Validators.required],
      id_produit: [, Validators.required],
      id_entreprise: [this.api.id_current_entreprise, Validators.required],
      id_entrepot: [, Validators.required]
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

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_add_approvisionnements.controls; }

  get les_details(): FormArray {
    return this.reactiveForm_add_approvisionnements.get('les_details') as FormArray;
  }
  // validation du formulaire
  onSubmit_add_approvisionnements() {
    this.submitted = true;
    console.log(this.reactiveForm_add_approvisionnements.value)
    // stop here if form is invalid
    if (this.reactiveForm_add_approvisionnements.invalid) {
      return;
    }
    var approvisionnements = this.reactiveForm_add_approvisionnements.value
    this.add_approvisionnements(approvisionnements)
  }
  // vider le formulaire
  onReset_add_approvisionnements() {
    this.submitted = false;
    this.reactiveForm_add_approvisionnements.reset();
  }
  add_approvisionnements(approvisionnements: any) {
    this.loading_add_approvisionnements = true;
    this.api.taf_post("approvisionnements", approvisionnements, (reponse: any) => {
      this.loading_add_approvisionnements = false;
      if (reponse.status_code) {
        console.log("Opération effectuée avec succés sur la table approvisionnements. Réponse= ", reponse);
        this.onReset_add_approvisionnements()
        this.api.Swal_success("Opération éffectuée avec succés")
        this.modalService.dismiss(reponse)
      } else {
        console.log("L'opération sur la table approvisionnements a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
    }, (error: any) => {
      this.loading_add_approvisionnements = false;
    })
  }

  get_details_add_approvisionnements_form() {
    this.loading_get_details_add_approvisionnements_form = true;
    this.api.taf_get("approvisionnements/getformdetails/" + this.api.id_current_entreprise, (reponse: any) => {
      if (reponse.status_code) {
        this.form_details = reponse.data
        console.log("Opération effectuée avec succés sur la table approvisionnements. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table approvisionnements a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_details_add_approvisionnements_form = false;
    }, (error: any) => {
      this.loading_get_details_add_approvisionnements_form = false;
    })
  }
  update_rangement(entrepot: any, index: number) {
    console.warn('Entrepôt sélectionné :', entrepot);

    // Stocker les rangements uniquement pour la ligne concernée
    this.rangementsParDetail[index] = entrepot?.rangements || [];

    console.warn('Rangements pour la ligne', index, ':', this.rangementsParDetail[index]);
  }

  on_produit_selected(produit: any, i: number) {
    (this.les_details.at(i) as FormGroup).patchValue({
      prix_achat: produit.prix_achat || 0
    });
  }

}
