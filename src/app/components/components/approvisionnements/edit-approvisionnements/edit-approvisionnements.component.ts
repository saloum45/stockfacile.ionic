
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { ApiService } from '../../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import moment from 'moment';
import { ModalController,IonContent,IonHeader,IonToolbar,IonChip,IonLabel } from '@ionic/angular/standalone';
@Component({
  selector: 'app-edit-approvisionnements',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule,IonContent,IonHeader,IonToolbar,IonChip,IonLabel], // Dépendances importées
  templateUrl: './edit-approvisionnements.component.html',
  styleUrls: ['./edit-approvisionnements.component.scss']
})
export class EditApprovisionnementsComponent {
  reactiveForm_edit_approvisionnements !: FormGroup;
  submitted: boolean = false
  loading_edit_approvisionnements: boolean = false
  @Input()
  approvisionnements_to_edit: any = {}
  form_details: any = {}
  loading_get_details_edit_approvisionnements_form = false

  les_rangements: any[] = [];
  rangementsParDetail: any[][] = [];

  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: ModalController) {

  }
  ngOnInit(): void {
    //initialiser le form puis le mettre a jour dans get_detail
    this.reactiveForm_edit_approvisionnements = this.formBuilder.group({
      id: [null],
      date: ['', Validators.required],
      id_etat_approvisionnement: [null, Validators.required],
      id_fournisseur: [null, Validators.required],
      id_entreprise: [null],
      les_details: this.formBuilder.array([])
    });
    this.get_details_edit_approvisionnements_form();
  }

  // validation du formulaire
  onSubmit_edit_approvisionnements() {
    this.submitted = true;
    console.log(this.reactiveForm_edit_approvisionnements.value)
    // stop here if form is invalid
    if (this.reactiveForm_edit_approvisionnements.invalid) {
      return;
    }
    var approvisionnements = this.reactiveForm_edit_approvisionnements.value
    this.edit_approvisionnements(approvisionnements);
  }
  // vider le formulaire
  onReset_edit_approvisionnements() {
    this.submitted = false;
    this.reactiveForm_edit_approvisionnements.reset();
  }
  edit_approvisionnements(approvisionnements: any) {
    this.loading_edit_approvisionnements = true;
    this.api.taf_put("approvisionnements/" + approvisionnements.id, approvisionnements, (reponse: any) => {
      if (reponse.status_code) {
        this.activeModal.dismiss(reponse)
        console.log("Opération effectuée avec succés sur la table approvisionnements. Réponse= ", reponse);
        //this.onReset_edit_approvisionnements()
        this.api.Swal_success("Opération éffectuée avec succés")
      } else {
        console.log("L'opération sur la table approvisionnements a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_edit_approvisionnements = false;
    }, (error: any) => {
      this.loading_edit_approvisionnements = false;
    })
  }
  get_details_edit_approvisionnements_form() {
    this.loading_get_details_edit_approvisionnements_form = true;
    this.api.taf_get("approvisionnements/getformdetails/" + this.api.id_current_entreprise, (reponse: any) => {
      if (reponse.status_code) {
        this.form_details = reponse.data;
        console.log("Opération effectuée avec succés sur la table approvisionnements. Réponse🙃= ", this.form_details);
        // Initialiser le formulaire après avoir récupéré les détails
        if (this.approvisionnements_to_edit && Object.keys(this.approvisionnements_to_edit).length > 0) {
          this.update_form(this.approvisionnements_to_edit);
        }
      } else {
        console.log("L'opération sur la table approvisionnements a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_details_edit_approvisionnements_form = false;
    }, (error: any) => {
      this.loading_get_details_edit_approvisionnements_form = false;
    })
  }

  update_form(approvisionnements_to_edit: any) {
    if (!approvisionnements_to_edit.detail_approvisionnements) {
      approvisionnements_to_edit.detail_approvisionnements = [];
    }

    // On met à jour les champs principaux
    this.reactiveForm_edit_approvisionnements.patchValue({
      id: approvisionnements_to_edit.id,
      date: approvisionnements_to_edit.date,
      id_etat_approvisionnement: approvisionnements_to_edit.id_etat_approvisionnement,
      id_fournisseur: approvisionnements_to_edit.id_fournisseur,
      id_entreprise: approvisionnements_to_edit.id_entreprise
    });

    // On vide les anciens détails
    const les_details_array = this.reactiveForm_edit_approvisionnements.get('les_details') as FormArray;
    les_details_array.clear();

    // On recrée chaque ligne de détail avec entrepôt et rangement
    approvisionnements_to_edit.detail_approvisionnements.forEach((detail: any,index:number) => {
      les_details_array.push(this.init_details(detail));
    });
  }

  init_details(one_detail?: any): FormGroup {
    let entrepot:any;
    if (one_detail) {
      entrepot = this.approvisionnements_to_edit.detail_approvisionnements.find((one: any) => one.id_produit == one_detail?.id_produit&&one.id_rangement == one_detail?.id_rangement).rangement.entrepot
      let index = this.approvisionnements_to_edit.detail_approvisionnements.findIndex((one: any) => one.id_produit == one_detail?.id_produit&&one.id_rangement == one_detail?.id_rangement);
      this.rangementsParDetail[index] = this.form_details?.entrepot_rangements?.find((one_entre:any)=>one_entre.id==entrepot.id)?.rangements || [];
      // console.log("hi",entrepot,index);
    }

    return this.formBuilder.group({
      quantite: [one_detail?.quantite||1, Validators.required],
      prix_achat: [one_detail?.prix_achat],
      date_peremption: [one_detail?.date_peremption],
      id_rangement: [one_detail?.id_rangement, Validators.required],
      id_produit: [one_detail?.id_produit, Validators.required],
      id_entreprise: [one_detail?.id_entreprise||this.api.id_current_entreprise, Validators.required],
      id_entrepot: [entrepot?.id, Validators.required]
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
  get f(): any { return this.reactiveForm_edit_approvisionnements.controls; }

  get les_details(): FormArray {
    return this.reactiveForm_edit_approvisionnements.get('les_details') as FormArray;
  }

  update_rangement(entrepot: any, index: number) {
    console.warn('Entrepôt sélectionné :', entrepot,index);

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
