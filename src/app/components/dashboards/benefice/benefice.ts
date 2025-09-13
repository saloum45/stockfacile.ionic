import { Component, Input, SimpleChanges } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-benefice',
  imports: [NgApexchartsModule],
  templateUrl: './benefice.html',
  styleUrl: './benefice.scss'
})
export class Benefice {
  @Input() data: any;
  // --- Graph Bénéfices globaux ---
  beneficesChart = {
    series: [
      { name: 'Montant', data: [] as number[] }
    ],
    chart: { type: 'bar' as const, height: 350 },
    plotOptions: { bar: { borderRadius: 6, columnWidth: '40%',distributed:true } },
    dataLabels: { enabled: true },
    xaxis: { categories: [ 'Ventes', 'Bénéfices'] },
    yaxis: { title: { text: 'Montant (CFA)' } },
    tooltip: {
      y: { formatter: (val: number) => val.toLocaleString() + ' CFA' }
    },
    colors: ['#007bff', '#28a745']
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.update_benefices_chart(this.data);
    }
  }

  private update_benefices_chart(data: any): void {
    // let totalAchats = 0;
    let totalVentes = 0;
    let totalBenefice = 0;

    // Approvisionnements
    // data.approvisionnements?.forEach((approv: any) => {
    //   approv.detail_approvisionnements.forEach((d: any) => {
    //     totalAchats += (d.quantite || 0) * (d.prix_achat || 0);
    //   });
    // });

    // Ventes
    data.ventes?.forEach((vente: any) => {
      vente.detail_ventes.forEach((d: any) => {
        totalVentes += (d.quantite || 0) * (d.prix_unitaire || 0);
        totalBenefice += (d.quantite || 0) * ((d.prix_unitaire || 0)-(+d.produit.prix_achat||0));
      });
    });


    this.beneficesChart = {
      ...this.beneficesChart,
      series: [
        { name: 'Montant', data: [ totalVentes, totalBenefice] }
      ]
    };

    // console.warn('Bénéfices globaux', { totalAchats, totalVentes, benefice });
  }

}
