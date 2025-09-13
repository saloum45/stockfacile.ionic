import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import moment from 'moment';
import { Block } from 'notiflix';
import { ApiService } from '../service/api/api.service';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.page.html',
  styleUrls: ['./accueil.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class AccueilPage implements OnInit {

loading_get_dashboard = false;
  dashboard: any;
  filter: any = {
    typeFiltre: 'periode', // ou 'dates'
    periode: "annuel",
    date_debut: moment().startOf('y').format('YYYY-MM-DD'),
    date_fin: moment().endOf('y').format('YYYY-MM-DD'),
    text: ''
  };
  chiffrage = {
    total_approvisionnement: 0,
    recette: 0,
    dette: 0,
    acompte: 0,
    en_rupture: 0,
    valorisation_stock: 0,
    vente_anonyme: 0,
    vente_client: 0
  }

  // --- Données stocks (résumé) ---
  warehouseStock = [
    { entrepot: 'Entrepôt A', stock: 85 },
    { entrepot: 'Entrepôt B', stock: 65 },
    { entrepot: 'Entrepôt C', stock: 42 },
    { entrepot: 'Entrepôt D', stock: 73 },
    { entrepot: 'Entrepôt E', stock: 58 }
  ];
  constructor(public api: ApiService) { }
  ngOnInit(): void {
    this.get_dashboard();
  }

  get_dashboard() {
    Block.dots(".loading_bloc");
    this.loading_get_dashboard = true;
    this.api.taf_post("entreprise/" + this.api.id_current_entreprise + "/dashboard",{date_debut:this.filter.date_debut,date_fin:this.filter.date_fin}, (reponse: any) => {
      if (reponse.status_code) {
        this.dashboard = reponse.data
        this.dashboard.stock_par_rangement = this.api.produit_grouped_by(this.dashboard.stock_par_rangement);
        console.warn(this.dashboard)

        this.calcul_chiffrage();

        console.log("Opération effectuée avec succés sur la table dashboard. Réponse= ", reponse);
        // this.filtrer();
      } else {
        console.log("L'opération sur la table dashboard a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_dashboard = false;
      Block.remove(".loading_bloc");
    }, (error: any) => {
      Block.remove(".loading_bloc");
      this.loading_get_dashboard = false;
    })
  }

  // Méthode pour filtrer
  filtrer() {
    // Réinitialiser les dates si période sélectionnée
    if (this.filter.typeFiltre === 'periode' && this.filter.periode) {
      switch (this.filter.periode) {
        case "annuel":
          this.filter.date_debut = moment().startOf('y').format('YYYY-MM-DD');
          this.filter.date_fin = moment().endOf('y').format('YYYY-MM-DD');
          break;
        case "aujourd'hui":
          this.filter.date_debut = moment().startOf('day').format('YYYY-MM-DD');
          this.filter.date_fin = moment().endOf('day').format('YYYY-MM-DD');
          break;

        case "7jours":
          this.filter.date_debut = moment().subtract(6, 'days').startOf('day').format('YYYY-MM-DD');
          this.filter.date_fin = moment().endOf('day').format('YYYY-MM-DD');
          break;

        case "15jours":
          this.filter.date_debut = moment().subtract(14, 'days').startOf('day').format('YYYY-MM-DD');
          this.filter.date_fin = moment().endOf('day').format('YYYY-MM-DD');
          break;

        case "30jours":
          this.filter.date_debut = moment().subtract(29, 'days').startOf('day').format('YYYY-MM-DD');
          this.filter.date_fin = moment().endOf('day').format('YYYY-MM-DD');
          break;
      }
    }
    this.get_dashboard();
    console.warn(this.filter);
  }

  calcul_chiffrage() {
    this.chiffrage = {
    total_approvisionnement: 0,
    recette: 0,
    dette: 0,
    acompte: 0,
    en_rupture: 0,
    valorisation_stock: 0,
    vente_anonyme: 0,
    vente_client: 0
  }
    // chifrage
    this.dashboard.ventes.map((one_vente: any) => {
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
        // pourcentage vente client/anonyme
        this.chiffrage.vente_anonyme += (one_vente.client == null) ? 1 : 0;
        this.chiffrage.vente_client += (one_vente.client != null) ? 1 : 0;
      }
      one_vente.montant_total = montant_total;
      one_vente.montant_recu = montant_recu;
    });
    // pourcentage vente client/anonyme
    this.chiffrage.vente_anonyme = (this.chiffrage.vente_anonyme * 100) / this.dashboard.ventes.length;
    this.chiffrage.vente_client = (this.chiffrage.vente_client * 100) / this.dashboard.ventes.length;

    this.chiffrage.dette = this.chiffrage.recette - this.chiffrage.acompte;
    // Appro
    this.dashboard.approvisionnements.map((one_appro: any) => {
      if (one_appro.etat_approvisionnement.id == 2) {
        one_appro.detail_approvisionnements.map((one_detail: any) => {
          this.chiffrage.total_approvisionnement += +one_detail.quantite * +one_detail.prix_achat
        });
      }
    });

    // Rupture
    this.chiffrage.en_rupture = this.dashboard.stock_par_rangement.filter((one: any) => one.quantite_total == 0).length;

    // Valorisation stock
    this.chiffrage.valorisation_stock = this.dashboard.stock_par_rangement.reduce((cumul: 0, actu: any) => { return cumul + ((actu.prix_vente || 1) * actu.quantite_total) }, 0)
  }
}
