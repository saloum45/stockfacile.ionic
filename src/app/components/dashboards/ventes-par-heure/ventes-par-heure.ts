import { Component, Input, input, OnChanges, SimpleChanges } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-ventes-par-heure',
  imports: [NgApexchartsModule],
  templateUrl: './ventes-par-heure.html',
  styleUrl: './ventes-par-heure.scss'
})
export class VentesParHeure implements OnChanges {
  @Input() data: any;
  // --- Courbe des ventes (heures) ---
  salesChart = {
    series: [{
      name: 'Ventes',
      data: [12, 19, 3, 5, 2, 3, 9, 15, 8, 11, 7, 13]
    }],
    chart: {
      type: 'area' as const,
      height: 350,
      toolbar: { show: false }
    },
    xaxis: {
      categories: ['08h', '09h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h']
    },
    yaxis: {
      title: { text: 'Consultations / Ventes' }
    },
    tooltip: {
      y: { formatter: (val: number) => val + ' ' }
    },
    legend: {
      position: 'top' as const,
      horizontalAlign: 'right' as const
    },
    colors: ['#007bff']
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']['currentValue']) {

      // Mettre à jour la config du chart
      this.salesChart = {
        ...this.salesChart,
        series: [{
          name: 'Ventes',
          data: this.prepare_sales_by_hour(this.data)
        }],
        xaxis: {
          categories: Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}h`)
        }
      };
    }
  }

  private prepare_sales_by_hour(sales: any[]): number[] {
    // Tableau de 24 valeurs initialisées à 0
    const hourly_sales = Array(24).fill(0);

    sales.forEach(sale => {
      // On suppose que sale.date_vente est un string ou Date valide
      const date = new Date(sale.created_at);
      const hour = date.getHours(); // 0 → 23
      hourly_sales[hour] += 1;
    });

    return hourly_sales;
  }

}
