import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/service/api/api.service';
import { DetailVentesComponents } from '../../ventes/detail-ventes-components/detail-ventes-components';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, ModalController, IonLabel,IonChip,IonList,IonItem,IonBadge} from '@ionic/angular/standalone';

@Component({
  selector: 'app-details-client',
  imports: [CommonModule, FormsModule,IonContent, IonHeader, IonToolbar, IonLabel,IonChip,IonList,IonItem,IonBadge],
  templateUrl: './details-client.html',
  styleUrl: './details-client.scss'
})
export class DetailsClient {
  loading_get_details_clients = false
  clients: any[] = []
  selected_clients: any = undefined
  clients_to_edit: any = undefined
  ventes: any = [];
  loading_delete_clients = false
  @Input()clients_to_view:any;
  id_client = null;
  chiffrage: any = {
    recette: 0,
    dette: 0,
    acompte: 0
  }
  filter = {
    typeFiltre: 'periode', // ou 'dates'
    periode: '',
    dateDebut: '',
    dateFin: '',
    text: ''
  };
  list: any = [];
  tabs_choice = 1;
  constructor(public api: ApiService, public modalService: ModalController, private activated_route: ActivatedRoute) {

  }
  ngOnInit(): void {
    this.id_client = this.clients_to_view?.id;
    this.get_details_clients()
  }
  get_details_clients() {
    this.loading_get_details_clients = true;
    this.api.taf_get("clients/" + this.id_client, (reponse: any) => {
      if (reponse.status_code) {
        this.clients = reponse.data
        this.selected_clients = reponse.data.client
        this.ventes = reponse.data.ventes;

        this.filtrer()

        console.log("Opération effectuée avec succés sur la table clients. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table clients a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_details_clients = false;
    }, (error: any) => {
      this.loading_get_details_clients = false;
    })
  }

  voir_plus(one_clients: any) {
    this.selected_clients = one_clients
  }
  on_click_edit(one_clients: any) {
    this.clients_to_edit = one_clients
  }
  on_close_modal_edit() {
    this.clients_to_edit = undefined
  }

  // Méthode pour obtenir le total d'une vente
  getTotal(detailVentes: any[]): number {
    return detailVentes.reduce((sum, item) => sum + (item.quantite * item.prix_unitaire), 0);
  }

 async openModal_detail_vente(one_ventes: any) {
    const modal = await this.modalService.create({
      component: DetailVentesComponents,
      componentProps: {
        ventes_to_view: one_ventes
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      // this.service.successMessage("Commande ajoutée");
      // this.get_ventes()
    }
      this.list = this.list.map((item: any) =>
        item.id === data.id ? data : item
      );
      this.ventes = this.ventes.map((item: any) =>
        item.id === data.id ? data : item
      );
      this.filtrer();
  }

  // Réinitialise les filtres de dates quand on change de type
  resetDateFilters() {
    this.filter.dateDebut = '';
    this.filter.dateFin = '';
    this.filtrer();
  }

  // Méthode pour filtrer
  filtrer() {
    // Réinitialiser les dates si période sélectionnée
    if (this.filter.typeFiltre === 'periode' && this.filter.periode) {
      // Réinitialiser les dates de recherche
      this.filter.dateDebut = '';
      this.filter.dateFin = '';
    }

    this.list = this.ventes.filter((appro: any) => {
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
          default:
            return true;
          // break;
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

      return true;
    });
    this.chiffrage = {
      recette: 0,
      dette: 0,
      acompte: 0
    }
    this.list.map((one_vente: any) => {
      let montant_total = 0, montant_recu = 0;
      if (one_vente.etat_vente.id == 1) {
        one_vente.detail_ventes.map((one_detail: any) => {
          this.chiffrage.recette += +one_detail.quantite * +one_detail.prix_unitaire
          montant_total += +one_detail.quantite * +one_detail.prix_unitaire;
        });
        one_vente.acomptes.map((one_acompte: any) => {
          this.chiffrage.acompte += +one_acompte.montant
          montant_recu += +one_acompte.montant;
        });
      }
      one_vente.montant_total = montant_total;
      one_vente.montant_recu = montant_recu;
    });
    this.chiffrage.dette = this.chiffrage.recette - this.chiffrage.acompte;
    if (this.tabs_choice == 2) {
      this.list = this.list.filter((one: any) => +one.montant_recu != +one.montant_total)
    } else if (this.tabs_choice == 3) {
      this.list = this.list.filter((one: any) => +one.montant_recu == +one.montant_total)
    }
  }

  tabs_choice_change(type: number) {
    this.tabs_choice = type;
    this.filtrer();
  }
}
