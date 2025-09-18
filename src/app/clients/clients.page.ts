import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, ModalController, IonList, IonItem, IonLabel, IonButton, IonItemOption, IonItemOptions, IonItemSliding, IonFab, IonFabButton, IonBadge } from '@ionic/angular/standalone';
import { ApiService } from '../service/api/api.service';
import { AddClientsComponent } from '../components/components/clients/add-clients/add-clients.component';
import { EditClientsComponent } from '../components/components/clients/edit-clients/edit-clients.component';
import { DetailsClient } from '../components/components/clients/details-client/details-client';
import { CountUpPipe } from "../pipes/count-up-pipe";

@Component({
  selector: 'app-clients',
  templateUrl: './clients.page.html',
  styleUrls: ['./clients.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton, IonItemOption, IonItemOptions, IonItemSliding, IonFab, IonFabButton, FormsModule, IonBadge, CountUpPipe]
})
export class ClientsPage implements OnInit {

  loading_get_clients = false
  clients: any[] = []
  selected_clients: any = undefined
  clients_to_edit: any = undefined
  loading_delete_clients = false
  filter = {
    typeFiltre: 'periode', // ou 'dates'
    periode: 'aujourd\'hui',
    dateDebut: '',
    dateFin: '',
    text: ''
  };

  list: any = [];
  chiffrage: any = {
    recette: 0,
    dette: 0,
    acompte: 0
  }
  tabs_choice = 1;
  constructor(public api: ApiService, private modalService: ModalController) {

  }
  ngOnInit(): void {
    this.get_clients()
  }
  get_clients() {
    this.loading_get_clients = true;
    this.api.taf_get("entreprise/" + this.api.id_current_entreprise + "/clients", (reponse: any) => {
      if (reponse.status_code) {
        this.clients = reponse.data
        this.list = reponse.data
        this.filtrer();
        console.log("Opération effectuée avec succés sur la table clients. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table clients a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_clients = false;
    }, (error: any) => {
      this.loading_get_clients = false;
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
  delete_clients(clients: any) {
    this.loading_delete_clients = true;
    this.api.taf_delete("clients/" + clients.id, (reponse: any) => {
      //when success
      if (reponse.status_code) {
        console.log("Opération effectuée avec succés sur la table clients . Réponse = ", reponse)
        this.get_clients()
        this.api.Swal_success("Opération éffectuée avec succés")
      } else {
        console.log("L'opération sur la table clients  a échoué. Réponse = ", reponse)
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_delete_clients = false;
    },
      (error: any) => {
        //when error
        console.log("Erreur inconnue! ", error)
        this.loading_delete_clients = false;
      })
  }
  async openModal_add_clients() {
    const modal = await this.modalService.create({
      component: AddClientsComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (data?.status_code) {
      // this.service.successMessage("Commande ajoutée");
      this.get_clients()
    }
  }
  async openModal_edit_clients(one_clients: any) {
    const modal = await this.modalService.create({
      component: EditClientsComponent,
      componentProps: {
        clients_to_edit: one_clients
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (data?.status_code) {
      // this.service.successMessage("Commande ajoutée");
      this.get_clients()
    }
  }
  async openModal_details_clients(one_clients: any) {
    const modal = await this.modalService.create({
      component: DetailsClient,
      componentProps: {
        clients_to_view: one_clients
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (data?.status_code) {
      // this.service.successMessage("Commande ajoutée");
      // this.get_clients()
    }
  }

  // Méthode pour filtrer les approvisionnements
  filtrer() {
    this.list = this.clients.filter(one_client => {
      // Filtrage par texte (recherche simple)
      if (this.filter.text && this.filter.text.length > 0) {
        const searchText = this.filter.text.toLowerCase();
        const produitText = JSON.stringify(one_client).toLowerCase(); // Correction ici
        if (!produitText.includes(searchText)) {
          return false;
        }
      }
      return true;
    });

    this.chiffrage = {
      recette: 0,
      dette: 0,
      acompte: 0
    }
    this.list.map((one_client: any) => {
      one_client.dette = 0;
      one_client.ventes.map((one_vente: any) => {
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
        one_client.dette += montant_total - montant_recu;
      });
    });
    this.chiffrage.dette = this.chiffrage.recette - this.chiffrage.acompte;
    if (this.tabs_choice == 2) {
      this.list = this.list.filter((one_client: any) => one_client.dette > 0);
    } else if (this.tabs_choice == 3) {
      this.list = this.list.filter((one_client: any) => one_client.dette == 0);
    }
    // console.warn(this.list)
  }

  tabs_choice_change(type: number) {
    this.tabs_choice = type;
    this.filtrer();
  }

}
