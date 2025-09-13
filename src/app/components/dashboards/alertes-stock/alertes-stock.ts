import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-alertes-stock',
  imports: [CommonModule],
  templateUrl: './alertes-stock.html',
  styleUrl: './alertes-stock.scss'
})
export class AlertesStock implements OnChanges {

  @Input() data: any;
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.data = this.data.filter((one: any) => one.quantite_total <= one.seuil_stock).map((one: any) => {
        if (one.quantite_total == 0) {
          one.statut = 'RUPTURE';
          one.couleur = 'table-danger';
        } else if (one.quantite_total > 0 && one.quantite_total < one.seuil_stock) {
          one.statut = 'CRITIQUE';
          one.couleur = 'table-warning';
        } else if (one.quantite_total == one.seuil_stock) {
          one.statut = 'SEUIL ATTEINT';
          one.couleur = 'table-info';
        }
        return one;
      }).sort((a: any, b: any) => a.quantite_total - b.quantite_total)
      // console.warn(this.data);

    }
  }
}
