import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Component, ComponentRef, Input } from '@angular/core';
// import { NgbAccordionBody, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/service/api/api.service';
// import { ListAcomptesComponent } from "../../acomptes/list-acomptes/list-acomptes.component";
import { EditVentesComponent } from '../edit-ventes/edit-ventes.component';
// import { FactureCompoment } from '../facture.compoment/facture.compoment';
// import { TicketCompoment } from '../ticket.compoment/ticket.compoment';
// import { NgxPrintModule } from 'ngx-print';
import { IonContent, IonHeader, IonToolbar, IonLabel, ModalController, IonChip, IonItem, IonList, IonButton, IonListHeader, IonBadge, IonFab, IonFabButton, IonFabList } from '@ionic/angular/standalone';
import { AcomptesPage } from "src/app/acomptes/acomptes.page";
import { AddAcomptesComponent } from '../../acomptes/add-acomptes/add-acomptes.component';

@Component({
  selector: 'app-detail-ventes-components',
  standalone: true,
  imports: [DatePipe, DecimalPipe, IonContent, IonHeader, IonToolbar, IonLabel, IonChip, IonItem, IonList, IonButton, IonListHeader, IonBadge, CommonModule, AcomptesPage, IonFab, IonFabButton, IonFabList],
  templateUrl: './detail-ventes-components.html',
  styleUrl: './detail-ventes-components.scss'
})
export class DetailVentesComponents {
  @Input()
  ventes_to_view: any;


  constructor(public api: ApiService, public modalService: ModalController) { }

  ngOnInit(): void {
    console.log(this.ventes_to_view);
  }

  // Méthode pour calculer le total de la vente
  getTotal(detailVentes: any[]): number {
    return detailVentes.reduce((sum, item) => sum + (item.quantite * item.prix_unitaire), 0);
  }

  getTotalAcompte(acomptes: any[]): number {
    return acomptes?.reduce((total, a) => total + (a.montant || 0), 0) || 0;
  }


  openModal_edit_ventes() {
    // let options: any = {
    //   centered: true,
    //   scrollable: true,
    //   size: "xl"//'sm' | 'lg' | 'xl' | string
    // }
    // const modalRef = this.modalService.create(EditVentesComponent, { ...options, backdrop: 'static', })
    // modalRef.componentInstance.ventes_to_edit = this.ventes_to_view;
    // modalRef.result.then((result: any) => {
    //   console.log('Modal closed with:', result);
    //   if (result?.status_code) {
    //     // this.get_ventes()
    //     this.ventes_to_view = result.data[0]
    //   } else {

    //   }
    // })
  }

  acompte_added(event: any) {
    this.ventes_to_view.acomptes.push(event)
  }

  async openModal_add_acomptes() {
    const modal = await this.modalService.create({
      component: AddAcomptesComponent,
      componentProps: {
        selected_vente: this.ventes_to_view
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (data?.status_code) {
      // this.service.successMessage("Commande ajoutée");
      this.ventes_to_view={...this.ventes_to_view}
    }
  }
}
