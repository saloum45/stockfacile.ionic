import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent,IonButton,IonTitle,IonHeader,IonToolbar,IonList,IonItem,IonLabel,ModalController } from '@ionic/angular/standalone';
import { AddVentesComponent } from '../components/components/ventes/add-ventes/add-ventes.component';
// import { DetailVentesComponents } from '../components/components/ventes/detail-ventes-components/detail-ventes-components';
import { EditVentesComponent } from '../components/components/ventes/edit-ventes/edit-ventes.component';
import { ApiService } from '../service/api/api.service';
import { DetailVentesComponents } from '../components/components/ventes/detail-ventes-components/detail-ventes-components';


@Component({
  selector: 'app-ventes',
  templateUrl: './ventes.page.html',
  styleUrls: ['./ventes.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule,IonContent,IonButton,IonTitle,IonHeader,IonToolbar,IonList,IonItem,IonLabel]
})
export class VentesPage implements OnInit {

  loading_get_ventes = false
  ventes: any[] = []
  selected_ventes: any = undefined
  ventes_to_edit: any = undefined
  loading_delete_ventes = false


  chiffrage: any = {
    recette: 0,
    dette: 0,
    acompte: 0
  }
  filter = {
    typeFiltre: 'periode', // ou 'dates'
    periode: "30jours",
    dateDebut: '',
    dateFin: '',
    text: ''
  };
  list: any = [];
  tabs_choice = 1;
  constructor(public api: ApiService, private modalService: ModalController) { }
  ngOnInit(): void {
    this.get_ventes()
  }
  get_ventes() {
    this.loading_get_ventes = true;
    this.api.taf_get("entreprise/" + this.api.id_current_entreprise + "/ventes", (reponse: any) => {
      if (reponse.status_code) {
        this.ventes = reponse.data
        console.log("Opération effectuée avec succés sur la table ventes. Réponse= ", reponse);
        this.filtrer();
      } else {
        console.log("L'opération sur la table ventes a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_ventes = false;
    }, (error: any) => {
      this.loading_get_ventes = false;
    })
  }

  voir_plus(one_ventes: any) {
    this.selected_ventes = one_ventes
  }
  on_click_edit(one_ventes: any) {
    this.ventes_to_edit = one_ventes
  }
  on_close_modal_edit() {
    this.ventes_to_edit = undefined
  }
  delete_ventes(ventes: any) {
    this.loading_delete_ventes = true;
    this.api.taf_delete("ventes/" + ventes.id, (reponse: any) => {
      //when success
      if (reponse.status_code) {
        console.log("Opération effectuée avec succés sur la table ventes . Réponse = ", reponse)
        this.get_ventes()
        this.api.Swal_success("Opération éffectuée avec succés")
      } else {
        console.log("L'opération sur la table ventes  a échoué. Réponse = ", reponse)
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_delete_ventes = false;
    },
      (error: any) => {
        //when error
        console.log("Erreur inconnue! ", error)
        this.loading_delete_ventes = false;
      })
  }
  async openModal_add_ventes() {
    const modal = await this.modalService.create({
      component: AddVentesComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (data?.status_code) {
      // this.service.successMessage("Commande ajoutée");
      this.get_ventes()
    }
  }
  async openModal_edit_ventes(one_ventes: any) {
    const modal = await this.modalService.create({
      component: EditVentesComponent,
      componentProps: {
        ventes_to_edit: one_ventes
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      // this.service.successMessage("Commande ajoutée");
      this.get_ventes()
    }
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
    // Filtrage par texte (recherche simple)
    if (this.filter.text && this.filter.text.length > 0) {
      this.list = this.list.filter((one_list: any) => {
        // Filtrage par texte (recherche simple)
        const searchText = this.filter.text.toLowerCase();
        const produitText = JSON.stringify(one_list).toLowerCase();
        if (!produitText.includes(searchText)) {
          return false;
        }
        return true;
      });
    }
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

  // Méthode pour calculer la somme totale
  getSommeTotale(): number {
    return this.list.reduce((total: any, vente: any) => {
      const venteTotal = this.getTotal(vente.detail_ventes);
      return total + venteTotal;
    }, 0);
  }

  // Méthode pour le filtre de recherche
  filter_change(event: any) {
    // Logique de recherche
    this.filtrer();
  }

  // Méthode pour obtenir le total d'une vente
  getTotal(detailVentes: any[]): number {
    return detailVentes.reduce((sum, item) => sum + (item.quantite * item.prix_unitaire), 0);
  }

  // Réinitialise les filtres de dates quand on change de type
  resetDateFilters() {
    this.filter.dateDebut = '';
    this.filter.dateFin = '';
    this.filtrer();
  }

}
