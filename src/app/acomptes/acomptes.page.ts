import { Component, Input, OnInit, output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, ModalController, IonList, IonItem, IonLabel, IonButton, IonListHeader, IonBadge } from '@ionic/angular/standalone';
import { ApiService } from '../service/api/api.service';

@Component({
  selector: 'app-acomptes',
  templateUrl: './acomptes.page.html',
  styleUrls: ['./acomptes.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonList, IonItem, IonLabel, IonButton, IonListHeader, IonBadge]
})
export class AcomptesPage implements OnInit {

 loading_get_acomptes = false
  acomptes: any[] = []
  selected_acomptes: any = undefined
  acomptes_to_edit: any = undefined
  loading_delete_acomptes = false
  @Input() seletected_vente: any;
  notifier_list = output<any>();
  chiffrage: any = {
    montant_recu: 0,
    reste_a_payer: 0,
    total_vente: 0
  };
  constructor(public api: ApiService, private modalService: ModalController) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    console.warn('changes', changes)
    if (changes['seletected_vente']) {
      // console.log('Nouvelle vente reçue :', this.seletected_vente);
      // mettre à jour ce qui doit l’être dans le composant
      this.seletected_vente = changes['seletected_vente']['currentValue']
      this.get_acomptes();
    }
  }
  ngOnInit(): void {
    // console.warn("selected acoo",this.seletected_vente)
    this.get_acomptes()
  }
  get_acomptes() {
    this.loading_get_acomptes = true;
    this.api.taf_get("entreprise/" + this.seletected_vente.id + "/acomptes", (reponse: any) => {
      this.chiffrage = {
        montant_recu: 0,
        reste_a_payer: 0,
        total_vente: 0
      };
      if (reponse.status_code) {
        this.acomptes = reponse.data;
        this.acomptes.map((one_accompte: any) => {
          this.chiffrage.montant_recu += one_accompte.montant
        });
        this.seletected_vente.detail_ventes.map((one_detail_vente: any) => {
          this.chiffrage.total_vente += one_detail_vente.quantite * one_detail_vente.prix_unitaire
        });
        this.chiffrage.reste_a_payer = this.chiffrage.total_vente - this.chiffrage.montant_recu
        this.seletected_vente.reste_a_payer = this.chiffrage.reste_a_payer;
        // console.warn(this.chiffrage)

        console.log("Opération effectuée avec succés sur la table acomptes. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table acomptes a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_acomptes = false;
    }, (error: any) => {
      this.loading_get_acomptes = false;
    })
  }

  voir_plus(one_acomptes: any) {
    this.selected_acomptes = one_acomptes
  }
  on_click_edit(one_acomptes: any) {
    this.acomptes_to_edit = one_acomptes
  }
  on_close_modal_edit() {
    this.acomptes_to_edit = undefined
  }
  async delete_acomptes(acomptes: any) {

    if (! await this.api.Swal_confirm("De vouloir supprimer")) {
      return
    }
    this.loading_delete_acomptes = true;
    this.api.taf_delete("acomptes/" + acomptes.id, (reponse: any) => {
      //when success
      if (reponse.status_code) {
        console.log("Opération effectuée avec succés sur la table acomptes . Réponse = ", reponse)
        this.get_acomptes()
        this.api.Swal_success("Opération éffectuée avec succés")
      } else {
        console.log("L'opération sur la table acomptes  a échoué. Réponse = ", reponse)
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_delete_acomptes = false;
    },
      (error: any) => {
        //when error
        console.log("Erreur inconnue! ", error)
        this.loading_delete_acomptes = false;
      })
  }
  openModal_add_acomptes() {
    // if (this.chiffrage.total_vente == this.chiffrage.montant_recu) {
    //   this.api.Swal_info("Cette vente a entièrement été payée");
    //   return
    // }
    // let options: any = {
    //   centered: true,
    //   scrollable: true,
    //   size: "lg"//'sm' | 'lg' | 'xl' | string
    // }
    // const modalRef = this.modalService.open(AddAcomptesComponent, { ...options, backdrop: 'static' })
    // modalRef.componentInstance.selected_vente = this.seletected_vente;
    // modalRef.result.then((result: any) => {
    //   console.log('Modal closed with:', result);
    //   if (result?.status_code) {
    //     // this.seletected_vente.montant_acompte_ajouter = result?.data?.montant
    //     this.notifier_list.emit(result?.data);
    //     this.get_acomptes()
    //   } else {

    //   }
    // })
  }
  openModal_edit_acomptes(one_acomptes: any) {
    // let options: any = {
    //   centered: true,
    //   scrollable: true,
    //   size: "lg"//'sm' | 'lg' | 'xl' | string
    // }
    // const modalRef = this.modalService.open(EditAcomptesComponent, { ...options, backdrop: 'static', })
    // modalRef.componentInstance.acomptes_to_edit = one_acomptes;
    // modalRef.componentInstance.selected_vente = this.seletected_vente;
    // modalRef.result.then((result: any) => {
    //   console.log('Modal closed with:', result);
    //   if (result?.status_code) {
    //     this.get_acomptes()
    //   } else {

    //   }
    // })
  }

}
