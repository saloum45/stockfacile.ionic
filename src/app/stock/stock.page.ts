import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent,IonHeader,IonToolbar,IonTitle,IonList,IonCard,IonCardHeader,IonCardTitle,IonItem,IonLabel,IonSkeletonText,IonAccordion,IonAccordionGroup,IonCardContent } from '@ionic/angular/standalone';
import { ApiService } from '../service/api/api.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.page.html',
  styleUrls: ['./stock.page.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule,IonContent,IonHeader,IonToolbar,IonTitle,IonList,IonCard,IonCardHeader,IonCardTitle,IonItem,IonLabel,IonSkeletonText,IonAccordion,IonAccordionGroup,IonCardContent]
})
export class StockPage implements OnInit {

  loading_get_stock = false
  stocks: any[] = []
  selected_stocks: any = undefined
  stocks_to_edit: any = undefined
  loading_delete_stocks = false
  filter = {
    typeFiltre: 'periode', // ou 'dates'
    periode: 'aujourd\'hui',
    dateDebut: '',
    dateFin: '',
    text: ''
  };
  valeur_stock = 0;
  list: any = [];
  constructor(public api: ApiService) {

  }
  ngOnInit(): void {
    this.get_stock()
  }
  get_stock() {
    this.loading_get_stock = true;
    this.api.taf_get("entreprise/" + this.api.id_current_entreprise + "/stocks", (reponse: any) => {
      if (reponse.status_code) {
        this.stocks = this.api.produit_grouped_by(reponse.data).map((one: any) => {
          // couleurs pour le produit
          let prodColors = this.get_stock_colors(one.quantite_total, one.seuil_stock);
          one.bg_couleur = prodColors.bg_couleur;
          one.couleur = prodColors.couleur;

          one.entrepots = one.entrepots.map((one_entre: any) => {
            // couleurs pour l’entrepôt (avec le seuil du produit)
            let entreColors = this.get_stock_colors(one_entre.quantite, one.seuil_stock);
            one_entre.bg_couleur = entreColors.bg_couleur;
            one_entre.couleur = entreColors.couleur;

            one_entre.rangements = one_entre.rangements.map((one_rang: any) => {
              // couleurs pour chaque rangement (avec le seuil du produit)
              let rangColors = this.get_stock_colors(one_rang.quantite, one.seuil_stock);
              one_rang.bg_couleur = rangColors.bg_couleur;
              one_rang.couleur = rangColors.couleur;
              return one_rang;
            });

            return one_entre;
          });

          return one;
        });
        this.list = this.stocks;
        this.filtrer()
        // console.warn(this.stocks)
        console.log("Opération effectuée avec succés sur la table stocks. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table stocks a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_stock = false;
    }, (error: any) => {
      this.loading_get_stock = false;
    })
  }

  voir_plus(one_stock: any) {
    this.selected_stocks = one_stock
  }
  on_click_edit(one_stock: any) {
    this.stocks_to_edit = one_stock
  }
  on_close_modal_edit() {
    this.stocks_to_edit = undefined
  }

  // Méthode pour filtrer les approvisionnements
  filtrer() {
    this.list = this.stocks.filter((one_produit: any) => {
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
    this.valeur_stock = this.list.reduce((cumul: 0, actu: any) => { return cumul + ((actu.prix_vente || 1) * actu.quantite_total) }, 0)
  }

  get_stock_colors(quantite_total: number, seuil_stock: number) {
    if (quantite_total <= 0) {
      return {
        bg_couleur: 'bg-danger-subtle',
        couleur: 'text-danger-emphasis'
      };
    } else if (quantite_total > 0 && quantite_total <= seuil_stock) {
      return {
        bg_couleur: 'bg-warning-subtle',
        couleur: 'text-warning-emphasis'
      };
    } else {
      return {
        bg_couleur: 'bg-success-subtle',
        couleur: 'text-success-emphasis'
      };
    }
  }
}
