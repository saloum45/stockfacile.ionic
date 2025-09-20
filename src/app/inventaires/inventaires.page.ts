import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, ModalController, IonFab, IonFabButton, IonList, IonItemSliding, IonItem, IonLabel, IonItemOption, IonItemOptions, IonButton, IonBadge } from '@ionic/angular/standalone';
import { ApiService } from '../service/api/api.service';
import { ListDetailInventairesComponent } from '../components/components/inventaires/list-detail-inventaires/list-detail-inventaires.component';

@Component({
  selector: 'app-inventaires',
  templateUrl: './inventaires.page.html',
  styleUrls: ['./inventaires.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonFab, IonFabButton, IonList, IonItemSliding, IonItem, IonLabel, IonItemOption, IonItemOptions, IonButton, IonBadge]
})
export class InventairesPage implements OnInit {

  loading_get_inventaires = false
  inventaires: any[] = []
  selected_inventaires: any = undefined
  inventaires_to_edit: any = undefined
  loading_delete_inventaires = false
  constructor(public api: ApiService, private modalService: ModalController) {

  }
  ngOnInit(): void {
    this.get_inventaires()
  }
  get_inventaires() {
    this.loading_get_inventaires = true;
    this.api.taf_get("entreprise/" + this.api.id_current_entreprise + "/inventaires", (reponse: any) => {
      if (reponse.status_code) {
        this.inventaires = reponse.data
        console.log("Opération effectuée avec succés sur la table inventaires. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table inventaires a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_inventaires = false;
    }, (error: any) => {
      this.loading_get_inventaires = false;
    })
  }

  voir_plus(one_inventaires: any) {
    this.selected_inventaires = one_inventaires
  }
  on_click_edit(one_inventaires: any) {
    this.inventaires_to_edit = one_inventaires
  }
  on_close_modal_edit() {
    this.inventaires_to_edit = undefined
  }
  delete_inventaires(inventaires: any) {
    this.loading_delete_inventaires = true;
    this.api.taf_delete("inventaires/" + inventaires.id, (reponse: any) => {
      //when success
      if (reponse.status_code) {
        console.log("Opération effectuée avec succés sur la table inventaires . Réponse = ", reponse)
        this.get_inventaires()
        this.api.Swal_success("Opération éffectuée avec succés")
      } else {
        console.log("L'opération sur la table inventaires  a échoué. Réponse = ", reponse)
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_delete_inventaires = false;
    },
      (error: any) => {
        //when error
        console.log("Erreur inconnue! ", error)
        this.loading_delete_inventaires = false;
      })
  }
  openModal_add_inventaires() {
    // if (this.inventaires.some((one: any) => one.cloture != 1)) {
    //   this.api.Swal_blue("Veuillez clôturer le dernier inventaire");
    //   return;
    // }
    // let options: any = {
    //   centered: true,
    //   scrollable: true,
    //   size: "lg"//'sm' | 'lg' | 'xl' | string
    // }
    // const modalRef = this.modalService.open(AddInventairesComponent, { ...options, backdrop: 'static' })
    // modalRef.result.then((result: any) => {
    //   console.log('Modal closed with:', result);
    //   if (result?.status_code) {
    //     this.get_inventaires()
    //   } else {

    //   }
    // })
  }
  openModal_edit_inventaires(one_inventaires: any) {
    // let options: any = {
    //   centered: true,
    //   scrollable: true,
    //   size: "lg"//'sm' | 'lg' | 'xl' | string
    // }
    // const modalRef = this.modalService.open(EditInventairesComponent, { ...options, backdrop: 'static', })
    // modalRef.componentInstance.inventaires_to_edit = one_inventaires;
    // modalRef.result.then((result: any) => {
    //   console.log('Modal closed with:', result);
    //   if (result?.status_code) {
    //     this.get_inventaires()
    //   } else {

    //   }
    // })
  }

  async openModal_detail_inventaires(one_inventaires: any) {
    const modal = await this.modalService.create({
      component: ListDetailInventairesComponent,
      componentProps: {
        id_inventaire: one_inventaires.id
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      // this.service.successMessage("Commande ajoutée");
      // this.get_ventes()
    }

  }
}
