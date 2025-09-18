import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ApiService } from '../service/api/api.service';
import { ModalController, IonList, IonItem, IonLabel, IonButton, IonBadge, IonItemSliding, IonItemOption, IonItemOptions ,IonFab,IonFabButton} from '@ionic/angular/standalone';
import { CountUpPipe } from "../pipes/count-up-pipe";

@Component({
  selector: 'app-approvisionnements',
  templateUrl: './approvisionnements.page.html',
  styleUrls: ['./approvisionnements.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, CountUpPipe, IonList, IonItem, IonLabel,IonFab,IonFabButton]
})
export class ApprovisionnementsPage implements OnInit {

loading_get_approvisionnements = false
  approvisionnements: any[] = []
  selected_approvisionnements: any = undefined
  approvisionnements_to_edit: any = undefined
  loading_delete_approvisionnements = false

  approvisionnementsFiltres: any[] = [];
  filter = {
    typeFiltre: 'periode', // ou 'dates'
    periode: '',
    dateDebut: '',
    dateFin: '',
    text: ''
  };


  constructor(public api: ApiService, private modalService:ModalController ) {

  }
  ngOnInit(): void {
    this.get_approvisionnements()
  }
  get_approvisionnements() {
    this.loading_get_approvisionnements = true;
    this.api.taf_get("entreprise/" + this.api.id_current_entreprise + "/approvisionnements", (reponse: any) => {
      if (reponse.status_code) {
        this.approvisionnements = reponse.data
        console.log("Opération effectuée avec succés sur la table approvisionnements. Réponse= ", reponse);
        this.filtrerApprovisionnements();
      } else {
        console.log("L'opération sur la table approvisionnements a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_approvisionnements = false;
    }, (error: any) => {
      this.loading_get_approvisionnements = false;
    })
  }

  voir_plus(one_approvisionnements: any) {
    this.selected_approvisionnements = one_approvisionnements
  }
  on_click_edit(one_approvisionnements: any) {
    this.approvisionnements_to_edit = one_approvisionnements
  }
  on_close_modal_edit() {
    this.approvisionnements_to_edit = undefined
  }
  delete_approvisionnements(approvisionnements: any) {
    this.loading_delete_approvisionnements = true;
    this.api.taf_delete("approvisionnements/" + approvisionnements.id, (reponse: any) => {
      //when success
      if (reponse.status_code) {
        console.log("Opération effectuée avec succés sur la table approvisionnements . Réponse = ", reponse)
        this.get_approvisionnements()
        this.api.Swal_success("Opération éffectuée avec succés")
      } else {
        console.log("L'opération sur la table approvisionnements  a échoué. Réponse = ", reponse)
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_delete_approvisionnements = false;
    },
      (error: any) => {
        //when error
        console.log("Erreur inconnue! ", error)
        this.loading_delete_approvisionnements = false;
      })
  }
  openModal_add_approvisionnements() {
    // let options: any = {
    //   centered: true,
    //   scrollable: true,
    //   size: "xl"//'sm' | 'lg' | 'xl' | string
    // }
    // const modalRef = this.modalService.open(AddApprovisionnementsComponent, { ...options, backdrop: 'static' })
    // modalRef.result.then((result: any) => {
    //   console.log('Modal closed with:', result);
    //   if (result?.status_code) {
    //     this.get_approvisionnements()
    //   } else {

    //   }
    // })
  }
  openModal_edit_approvisionnements(one_approvisionnements: any) {
    // let options: any = {
    //   centered: true,
    //   scrollable: true,
    //   size: "lg"//'sm' | 'lg' | 'xl' | string
    // }
    // const modalRef = this.modalService.open(EditApprovisionnementsComponent, { ...options, backdrop: 'static', })
    // modalRef.componentInstance.approvisionnements_to_edit = one_approvisionnements;
    // modalRef.result.then((result: any) => {
    //   console.log('Modal closed with:', result);
    //   if (result?.status_code) {
    //     this.get_approvisionnements()
    //   } else {

    //   }
    // })
  }

  getTotal(details: any[]): number {
    if (!details || details.length === 0) {
      return 0;
    }

    return details.reduce((somme: number, detail: any) => {
      return somme + (parseInt(detail.quantite) || 0) * (parseFloat(detail.prix_achat) || 0);
    }, 0);
  }

  openModal_detail_approvisionnements(one_approvisionnements: any) {
    // let options: any = {
    //   centered: true,
    //   scrollable: true,
    //   size: "xl"//'sm' | 'lg' | 'xl' | string
    // }
    // const modalRef = this.modalService.open(DetailApprovisionnementComponent, { ...options, backdrop: 'static', })
    // modalRef.componentInstance.approvisionnements_to_view = one_approvisionnements;
    // modalRef.result.then((result: any) => {
    //   console.log('Modal closed with:', result);
    //   if (result?.status_code) {
    //     this.get_approvisionnements()
    //   } else {

    //   }
    //    this.approvisionnementsFiltres = this.approvisionnementsFiltres.map((item:any) =>
    //     item.id === result.id ? result : item
    //   );
    //   this.approvisionnements = this.approvisionnements.map((item:any) =>
    //     item.id === result.id ? result : item
    //   );
    // })
  }

  // Réinitialise les filtres de dates quand on change de type
  resetDateFilters() {
    this.filter.dateDebut = '';
    this.filter.dateFin = '';
    this.filtrerApprovisionnements();
  }

  // Méthode pour filtrer les approvisionnements
  filtrerApprovisionnements() {
    // Réinitialiser les dates si période sélectionnée
    if (this.filter.typeFiltre === 'periode' && this.filter.periode) {
      // Réinitialiser les dates de recherche
      this.filter.dateDebut = '';
      this.filter.dateFin = '';
    }

    this.approvisionnementsFiltres = this.approvisionnements.filter((appro: any) => {
      // Filtrage par période
      if (this.filter.typeFiltre === 'periode' && this.filter.periode) {
        const today = new Date();
        const approDate = new Date(appro.date);

        switch (this.filter.periode) {
          case 'aujourd\'hui':
            if (approDate.toDateString() !== today.toDateString()) return false;
            break;
          case '7jours':
            const sevenDaysAgo = new Date(today);
            sevenDaysAgo.setDate(today.getDate() - 7);
            if (approDate < sevenDaysAgo) return false;
            break;
          case '15jours':
            const fifteenDaysAgo = new Date(today);
            fifteenDaysAgo.setDate(today.getDate() - 15);
            if (approDate < fifteenDaysAgo) return false;
            break;
          case '30jours':
            const thirtyDaysAgo = new Date(today);
            thirtyDaysAgo.setDate(today.getDate() - 30);
            if (approDate < thirtyDaysAgo) return false;
            break;
        }
      }

      // Filtrage par date de début
      if (this.filter.typeFiltre === 'dates' && this.filter.dateDebut) {
        const approDate = new Date(appro.date);
        const debut = new Date(this.filter.dateDebut);
        if (approDate < debut) return false;
      }

      // Filtrage par date de fin
      if (this.filter.typeFiltre === 'dates' && this.filter.dateFin) {
        const approDate = new Date(appro.date);
        const fin = new Date(this.filter.dateFin);
        if (approDate > fin) return false;
      }

      // Filtrage par texte (recherche simple)
      if (this.filter.text && this.filter.text.length > 0) {
        const searchText = this.filter.text.toLowerCase();
        const fournisseurName = appro.fournisseur?.nom_fournisseur?.toLowerCase() || '';
        const produitName = appro.detail_approvisionnements?.find((d: any) => d.produit)?.produit?.libelle_produit?.toLowerCase() || '';

        if (!fournisseurName.includes(searchText) && !produitName.includes(searchText)) {
          return false;
        }
      }

      return true;
    });
  }

  // Méthode pour calculer la somme totale
  getSommeTotaleAppro(): number {
    return this.approvisionnementsFiltres.reduce((total, appro) => {
      const approTotal = this.getTotal(appro.detail_approvisionnements);
      return total + approTotal;
    }, 0);
  }


}
