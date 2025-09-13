import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-top-produit-vendu',
  imports: [NgApexchartsModule, CommonModule],
  templateUrl: './top-produit-vendu.html',
  styleUrl: './top-produit-vendu.scss'
})
export class TopProduitVendu implements OnChanges {


  @Input() data: any;
  // --- Top Produits vétérinaires ---
  topProductsChart = {
    series: [45, 32, 28, 15, 12],
    chart: { type: 'donut' as const, height: 350 },
    labels: ['Vaccins', 'Antibiotiques', 'Vermifuges', 'Aliments spéciaux', 'Produits antiparasitaires'],
    plotOptions: { pie: { donut: { size: '50%' } } },
    tooltip: {
      y: { formatter: (val: number) => 'Qté vendue : '+val }
    },
    legend: { position: 'bottom' as const },
    colors: ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6c757d']
  };
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.update_top_products_chart(this.data);
    }
  }

  private update_top_products_chart(data: any[]): void {
    const produits_map: { [libelle: string]: number } = {};

    data.forEach(item => {
      const produit_libelle = item?.libelle_produit || 'Inconnu';
      const total_quantite = item.detail_ventes
        ? item.detail_ventes.reduce((sum: number, v: any) => sum + (v.quantite || 0), 0)
        : 0;

      if (!produits_map[produit_libelle]) {
        produits_map[produit_libelle] = 0;
      }
      produits_map[produit_libelle] += total_quantite;
    });

    // Transformer en tableau et trier par quantité
    const produits_tries = Object.entries(produits_map)
      .sort((a, b) => b[1] - a[1]) // tri décroissant
      .slice(0, 5); // garder top 5

    const labels = produits_tries.map(([libelle]) => libelle);
    const series = produits_tries.map(([_, quantite]) => quantite);

    this.topProductsChart = {
      ...this.topProductsChart,
      labels,
      series
    };

    // console.warn('top produits', this.topProductsChart);
  }
}
