import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, ModalController, IonList, IonItem, IonLabel, IonButton } from '@ionic/angular/standalone';
import { ApiService } from '../service/api/api.service';
import { AddProduitsComponent } from '../components/components/produits/add-produits/add-produits.component';
import { EditProduitsComponent } from '../components/components/produits/edit-produits/edit-produits.component';

@Component({
  selector: 'app-produits',
  templateUrl: './produits.page.html',
  styleUrls: ['./produits.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonList, IonItem, IonLabel, IonButton]
})
export class ProduitsPage implements OnInit {
  loading_get_produits = false
  produits: any[] = []
  selected_produits: any = undefined
  produits_to_edit: any = undefined
  loading_delete_produits = false
  filter = {
    typeFiltre: 'periode', // ou 'dates'
    periode: 'aujourd\'hui',
    dateDebut: '',
    dateFin: '',
    text: ''
  };
  list: any = [];
  constructor(public api: ApiService, private modalService: ModalController) {

  }
  ngOnInit(): void {
    this.get_produits()
  }
  get_produits() {
    this.loading_get_produits = true;
    this.api.taf_get("entreprise/" + this.api.id_current_entreprise + "/produits", (reponse: any) => {
      if (reponse.status_code) {
        this.produits = reponse.data
        this.list = reponse.data
        console.log("Opération effectuée avec succés sur la table produits. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table produits a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_produits = false;
    }, (error: any) => {
      this.loading_get_produits = false;
    })
  }

  voir_plus(one_produits: any) {
    this.selected_produits = one_produits
  }
  on_click_edit(one_produits: any) {
    this.produits_to_edit = one_produits
  }
  on_close_modal_edit() {
    this.produits_to_edit = undefined
  }
  delete_produits(produits: any) {
    this.loading_delete_produits = true;
    this.api.taf_delete("produits/" + produits.id, (reponse: any) => {
      //when success
      if (reponse.status_code) {
        console.log("Opération effectuée avec succés sur la table produits . Réponse = ", reponse)
        this.get_produits()
        this.api.Swal_success("Opération éffectuée avec succés")
      } else {
        console.log("L'opération sur la table produits  a échoué. Réponse = ", reponse)
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_delete_produits = false;
    },
      (error: any) => {
        //when error
        console.log("Erreur inconnue! ", error)
        this.loading_delete_produits = false;
      })
  }
  async openModal_add_produits() {
    const modal = await this.modalService.create({
      component: AddProduitsComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (data?.status_code) {
      // this.service.successMessage("Commande ajoutée");
      this.get_produits()
    }
  }

  async openModal_edit_produits(one_produits: any) {
    const modal = await this.modalService.create({
      component: EditProduitsComponent,
      componentProps: {
        produits_to_edit: one_produits
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (data?.status_code) {
      // this.service.successMessage("Commande ajoutée");
      this.get_produits();
    }
  }

  // Méthode pour filtrer les approvisionnements
  filtrer() {
    this.list = this.produits.filter(one_produit => {
      // Filtrage par texte (recherche simple)
      if (this.filter.text && this.filter.text.length > 0) {
        const searchText = this.filter.text.toLowerCase();
        const produitText = JSON.stringify(one_produit).toLowerCase(); // Correction ici
        if (!produitText.includes(searchText)) {
          return false;
        }
      }
      return true;
    });
  }

}
