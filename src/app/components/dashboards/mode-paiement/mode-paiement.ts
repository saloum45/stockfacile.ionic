import { Component, Input, SimpleChanges } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-mode-paiement',
  imports: [NgApexchartsModule],
  templateUrl: './mode-paiement.html',
  styleUrl: './mode-paiement.scss'
})
export class ModePaiement {
  @Input() data: any;
  // --- Graph Modes de Paiement ---
  paiementChart = {
    series: [] as number[],
    chart: { type: 'donut' as const, height: 350 },
    labels: [] as string[],
    plotOptions: { pie: { donut: { size: '0%' } } },
    tooltip: {
      y: { formatter: (val: number) => 'Montant : ' + val.toLocaleString() + ' CFA' }
    },
    legend: { position: 'bottom' as const },
    colors: ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6c757d', '#17a2b8']
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.update_paiement_chart(this.data);
    }
  }

  private update_paiement_chart(data: any[]): void {
    const paiement_map: { [libelle: string]: number } = {};

    data.forEach(item => {
      const mode_libelle = item?.mode_paiement?.libelle_mode_paiement || 'Inconnu';
      const montant = item?.montant || 0;

      if (!paiement_map[mode_libelle]) {
        paiement_map[mode_libelle] = 0;
      }
      paiement_map[mode_libelle] += montant;
    });

    const labels = Object.keys(paiement_map);
    const series = Object.values(paiement_map);

    this.paiementChart = {
      ...this.paiementChart,
      labels,
      series
    };

    // console.warn('graph paiements', this.paiementChart);
  }

}
