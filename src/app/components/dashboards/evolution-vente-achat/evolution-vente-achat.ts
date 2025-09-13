import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-evolution-vente-achat',
  imports: [NgApexchartsModule, CommonModule],
  templateUrl: './evolution-vente-achat.html',
  styleUrl: './evolution-vente-achat.scss'
})
export class EvolutionVenteAchat implements OnChanges {
  @Input() data: any;
  // --- Nouveau Graphique : Évolution ventes / achats ---
  evolutionChart: any = {
    series: [
      { name: 'ventes', data: [] },
      { name: 'achats', data: [] }
    ],
    chart: {
      type: 'area' as const,
      height: 300,
      toolbar: { show: false }
    },
    colors: ['#28a745', '#ffc107'],
    stroke: { curve: 'smooth' as const, width: 2 },
    xaxis: {
      categories: [
        'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
        'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'
      ]
    },
    tooltip: {
      y: { formatter: (val: number) =>  val +' f cfa'}
    }
  };
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.update_evolution_chart(this.data);
    }
  }

  private update_evolution_chart(data: any): void {
    // 12 mois initialisés à 0
    const ventes_par_mois = Array(12).fill(0);
    const achats_par_mois = Array(12).fill(0);

    // --- Traitement des ventes ---
    if (data.ventes && Array.isArray(data.ventes)) {
      data.ventes.forEach((vente: any) => {
        const date = new Date(vente.created_at); // Assure-toi que la date est présente
        const mois = date.getMonth(); // 0=Jan, 11=Déc
        ventes_par_mois[mois] += vente.total_ventes || 0;
      });
    }

    // --- Traitement des approvisionnements ---
    if (data.approvisionnements && Array.isArray(data.approvisionnements)) {
      data.approvisionnements.forEach((achat: any) => {
        const date = new Date(achat.created_at); // Assure-toi que la date est présente
        const mois = date.getMonth(); // 0=Jan, 11=Déc
        achats_par_mois[mois] += achat.total_achats || 0;
      });
    }

    // ventes_par_mois.map((one:any)=>one+"fcfa")

    // --- Mise à jour du graphique ---
    this.evolutionChart = {
      ...this.evolutionChart,
      series: [
        { name: 'ventes', data: ventes_par_mois },
        { name: 'achats', data: achats_par_mois }
      ]
    };

    // console.warn('évolution annuelle prête', this.evolutionChart);
  }
}
