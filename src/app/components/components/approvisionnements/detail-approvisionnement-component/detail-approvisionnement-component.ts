 import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ApiService } from 'src/app/service/api/api.service';
// import { EditApprovisionnementsComponent } from '../edit-approvisionnements/edit-approvisionnements.component';
import { ModalController,IonContent,IonToolbar,IonChip,IonHeader, IonList, IonItem, IonLabel, IonButton, IonBadge, IonItemSliding, IonItemOption, IonItemOptions ,IonFab,IonFabButton} from '@ionic/angular/standalone';
@Component({
  selector: 'app-detail-approvisionnement-component',
  standalone: true,
  imports: [DatePipe, DecimalPipe,IonContent,IonToolbar,IonChip,IonHeader, IonList, IonItem, IonLabel, IonButton, IonBadge, IonItemSliding, IonItemOption, IonItemOptions ,IonFab,IonFabButton,CommonModule],
  templateUrl: './detail-approvisionnement-component.html',
  styleUrl: './detail-approvisionnement-component.scss'
})
export class DetailApprovisionnementComponent {
  @Input()
  approvisionnements_to_view: any = {}

  constructor(public api: ApiService, public modalService: ModalController) { }

  ngOnInit(): void {
    console.log(this.approvisionnements_to_view);

  }

  getTotal(details: any[]): number {
    if (!details || details.length === 0) {
      return 0;
    }

    return details.reduce((somme: number, detail: any) => {
      return somme + (parseInt(detail.quantite) || 0) * (parseFloat(detail.prix_achat) || 0);
    }, 0);
  }

  openModal_edit_approvisionnements(one_approvisionnements: any) {
    // let options: any = {
    //   centered: true,
    //   scrollable: true,
    //   size: "xl"//'sm' | 'lg' | 'xl' | string
    // }
    // const modalRef = this.modalService.open(EditApprovisionnementsComponent, { ...options, backdrop: 'static', })
    // modalRef.componentInstance.approvisionnements_to_edit = one_approvisionnements;
    // modalRef.result.then((result: any) => {
    //   console.log('Modal closed with:', result);
    //   if (result?.status_code) {
    //     // this.get_approvisionnements()
    //   } else {

    //   }
    //   this.approvisionnements_to_view=result.data[0]
    // })
  }
}
