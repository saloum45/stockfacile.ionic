import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ApiService } from '../service/api/api.service';
import { IonContent,IonButton,IonTitle,IonHeader,IonToolbar,IonCol,IonCard,IonCardContent,IonRow } from '@ionic/angular/standalone';
import { IonicModule } from "@ionic/angular";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-parametres',
  templateUrl: './parametres.page.html',
  styleUrls: ['./parametres.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule, IonContent, IonButton, IonTitle, IonHeader, IonToolbar, IonCol, IonCard, IonCardContent, IonRow,RouterLink]
})
export class ParametresPage implements OnInit {
  loading_get_entreprises = false;
  entreprises: any = [];

  constructor(public api: ApiService) { }

  ngOnInit() {
    // this.get_entreprises();
  }

  get_entreprises() {
    this.loading_get_entreprises = true;
    this.api.taf_get("entreprises", (reponse: any) => {
      if (reponse.status_code) {
        this.entreprises = reponse.data
        this.api.save_on_local_storage("entreprises", JSON.stringify(this.entreprises));
        console.log("Opération effectuée avec succés sur la table entreprises. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table entreprises a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_entreprises = false;
    }, (error: any) => {
      this.loading_get_entreprises = false;
    })
  }

  loading_entreprise() {
    this.api.id_current_privilege = this.entreprises.find((one: any) => one.id == this.api.id_current_entreprise).id_privilege
    this.api.save_on_local_storage("id_current_entreprise", this.api.id_current_entreprise);
    this.api.save_on_local_storage("id_current_privilege", this.api.id_current_privilege);
    this.api.loading_current_entreprise = true;
    setTimeout(() => {
      this.api.id_current_entreprise = this.api.get_from_local_storage('id_current_entreprise');
      this.api.id_current_privilege = this.api.get_from_local_storage('id_current_privilege');
      this.api.loading_current_entreprise = false;
    }, 500);
  }
}
