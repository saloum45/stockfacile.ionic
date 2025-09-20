import { Component, Input } from '@angular/core';
import { ApiService } from '../../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, ModalController, IonFab, IonFabButton, IonList, IonItemSliding, IonItem, IonLabel, IonItemOption, IonItemOptions, IonButton, IonBadge } from '@ionic/angular/standalone';
@Component({
  selector: 'app-list-detail-inventaires',
  standalone: true, // Composant autonome
  imports: [CommonModule, FormsModule], // Dépendances importées
  templateUrl: './list-detail-inventaires.component.html',
  styleUrls: ['./list-detail-inventaires.component.scss']
})
export class ListDetailInventairesComponent {
  loading_get_detail_inventaires = false
  detail_inventaires: any[] = []
  selected_detail_inventaires: any = undefined
  detail_inventaires_to_edit: any = undefined
  loading_delete_detail_inventaires = false
  form_details: any = {}
  loading_get_details_add_detail_inventaires_form = false
  loading_add_detail_inventaires: boolean = false
  @Input()id_inventaire: any;
  inventaire: any;
  filter = {
    typeFiltre: 'periode', // ou 'dates'
    periode: 'aujourd\'hui',
    dateDebut: '',
    dateFin: '',
    text: ''
  };
  list: any = [];
  valeur_stock=0;
  constructor(public api: ApiService, private modalService: ModalController) {
    // this.id_inventaire = this.route.snapshot.params['id']
  }
  ngOnInit(): void {
    this.get_detail_inventaires()
    this.get_details_add_detail_inventaires_form();
  }
  get_detail_inventaires() {
    this.loading_get_detail_inventaires = true;
    this.api.taf_get("entreprise/" + this.api.id_current_entreprise + "/detail_inventaires/" + this.id_inventaire, (reponse: any) => {
      if (reponse.status_code) {
        this.inventaire=reponse.data.inventaire;
        if (this.inventaire.cloture) {
          this.api.Swal_blue('Cet inventaire est clôturé, aucun changement n\'est possible');
        }
        this.detail_inventaires = reponse.data.detail_inventaires.map((produit: any) => {
          const entrepotsMap = new Map<number, { id: number; nom: string; quantite: number; rangements: any[] }>();

          // Fusionner tous les événements
          const events: any[] = [];

          // 1️⃣ Ancien inventaire
          (produit.detail_inventaire_precedent || []).forEach((inv:any) => {
            events.push({
              type: 'inventaire_precedent',
              id_rangement: inv.id_rangement,
              quantite: inv.quantite_reelle,
              rangement: inv.rangement
            });
          });

          // 2️⃣ Approvisionnements
          (produit.detail_approvisionnements || []).forEach((app:any) => {
            events.push({
              type: 'approvisionnement',
              id_rangement: app.rangement.id,
              quantite: app.quantite,
              rangement: app.rangement
            });
          });

          // 3️⃣ Ventes (quantité négative)
          (produit.detail_ventes || []).forEach((vente:any) => {
            events.push({
              type: 'vente',
              id_rangement: vente.id_rangement,
              quantite: vente.quantite,
              rangement: vente.rangement
            });
          });

          // 4️⃣ Inventaire courant
          (produit.detail_inventaires || []).forEach((inv:any) => {
            events.push({
              type: 'inventaire_courant',
              id_rangement: inv.id_rangement,
              quantite: inv.quantite_reelle,
              rangement: inv.rangement
            });
          });

          // Fonction pour ajouter/mettre à jour un rangement
          const addRangement = (
            entrepot: any,
            rangement: any,
            quantite: number,
            quantite_reelle: number | null,
            deja_inventaire: boolean
          ) => {
            if (!entrepotsMap.has(entrepot.id)) {
              entrepotsMap.set(entrepot.id, {
                id: entrepot.id,
                nom: entrepot.libelle_entrepot,
                quantite: 0,
                rangements: []
              });
            }

            const currentEntrepot = entrepotsMap.get(entrepot.id)!;
            let existingRangement = currentEntrepot.rangements.find(r => r.id === rangement.id);

            if (!existingRangement) {
              existingRangement = {
                id: rangement.id,
                nom: rangement.libelle_rangement,
                quantite,
                quantite_reelle: quantite_reelle ?? quantite,
                deja_inventaire
              };
              currentEntrepot.rangements.push(existingRangement);
            } else {
              existingRangement.quantite = quantite; // Remplacer la valeur précédente
              if (deja_inventaire) {
                existingRangement.quantite_reelle = quantite_reelle ?? existingRangement.quantite_reelle;
                existingRangement.deja_inventaire = true;
              }
            }

            currentEntrepot.quantite = currentEntrepot.rangements.reduce((sum, r) => sum + r.quantite, 0);
          };

          // Traiter les événements par rangement
          const rangementMap = new Map<number, any[]>();
          events.forEach(ev => {
            if (!rangementMap.has(ev.id_rangement)) rangementMap.set(ev.id_rangement, []);
            rangementMap.get(ev.id_rangement)!.push(ev);
          });

          // Calcul final pour chaque rangement
          rangementMap.forEach((evts, id_rangement) => {
            const rangement = evts[0].rangement;
            const entrepot = rangement.entrepot;

            // Séparer les types
            const inventaire_courant = evts.find(e => e.type === 'inventaire_courant');
            const inventaire_precedent = evts.find(e => e.type === 'inventaire_precedent');
            const approvisionnement_total = evts
              .filter(e => e.type === 'approvisionnement')
              .reduce((sum, e) => sum + e.quantite, 0);
            const ventes_total = evts
              .filter(e => e.type === 'vente')
              .reduce((sum, e) => sum + e.quantite, 0);

            // Logique du calcul
            const quantite_reelle = inventaire_courant?.quantite ?? null;
            const deja_inventaire = !!inventaire_courant;

            // Quantité = inventaire précédent + approvisionnement - ventes
            const quantite = (inventaire_precedent?.quantite ?? 0) + approvisionnement_total - ventes_total;

            addRangement(entrepot, rangement, quantite, quantite_reelle, deja_inventaire);
          });

          // Résultat final
          const totalParEntrepots = Array.from(entrepotsMap.values());
          const nombre_rangement = totalParEntrepots.reduce((sum, e) => sum + e.rangements.length, 0);
          const quantite_total = totalParEntrepots.reduce((sum, e) => sum + e.quantite, 0);

          return {
            id: produit.id,
            libelle_produit: produit.libelle_produit,
            prix_vente: produit.prix_vente,
            seuil_stock: produit.seuil_stock,
            quantite_total,
            nombre_rangement,
            entrepots: totalParEntrepots,
            detail_inventaires: produit.detail_inventaires,
            detail_inventaire_precedent: produit.detail_inventaire_precedent
          };
        });





        this.list = this.detail_inventaires;
        this.filtrer();
        console.warn("detail_inventaires", this.detail_inventaires);
        console.log("Opération effectuée avec succés sur la table detail_inventaires. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table detail_inventaires a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_detail_inventaires = false;
    }, (error: any) => {
      this.loading_get_detail_inventaires = false;
    })
  }

  voir_plus(one_detail_inventaires: any) {
    this.selected_detail_inventaires = one_detail_inventaires
  }
  on_click_edit(one_detail_inventaires: any) {
    this.detail_inventaires_to_edit = one_detail_inventaires
  }
  on_close_modal_edit() {
    this.detail_inventaires_to_edit = undefined
  }
  delete_detail_inventaires(detail_inventaires: any) {
    this.loading_delete_detail_inventaires = true;
    this.api.taf_delete("detail_inventaires/" + detail_inventaires.id, (reponse: any) => {
      //when success
      if (reponse.status_code) {
        console.log("Opération effectuée avec succés sur la table detail_inventaires . Réponse = ", reponse)
        this.get_detail_inventaires()
        this.api.Swal_success("Opération éffectuée avec succés")
      } else {
        console.log("L'opération sur la table detail_inventaires  a échoué. Réponse = ", reponse)
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_delete_detail_inventaires = false;
    },
      (error: any) => {
        //when error
        console.log("Erreur inconnue! ", error)
        this.loading_delete_detail_inventaires = false;
      })
  }


  get_details_add_detail_inventaires_form() {
    this.loading_get_details_add_detail_inventaires_form = true;
    this.api.taf_get("detail_inventaires/getformdetails/" + this.api.id_current_entreprise, (reponse: any) => {
      if (reponse.status_code) {
        this.form_details = reponse.data
        console.log("Opération effectuée avec succés sur la table detail_inventaires. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table detail_inventaires a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_details_add_detail_inventaires_form = false;
    }, (error: any) => {
      this.loading_get_details_add_detail_inventaires_form = false;
    })
  }

  ajouterEntrepot(one_stock: any) {
    const id = one_stock.selectedEntrepotId;
    if (!id) return;
    const entrepot = this.form_details.entrepot_rangements.find((e: any) => e.id === id);
    if (!entrepot) return;
    // entrepot.rangements[0].quantite=0
    let defaut_rangement = entrepot.rangements[0]
    one_stock.entrepots.push({
      id: entrepot.id,
      nom: entrepot.libelle_entrepot,
      quantite: 0,
      rangements: []
    });

    one_stock.nombre_rangement += 1; // mise à jour du rowspan si nécessaire
    one_stock.selectedEntrepotId = null;
    one_stock.showAddEntrepotSelect = false;
    console.warn(one_stock)
  }

  ajouterRangement(one_entrepot: any, one_stock: any) {
    const entrepot = this.form_details.entrepot_rangements.find((e: any) => e.id === one_entrepot.id);
    const selected_entrepot = entrepot?.rangements?.find((r: any) => r.id === one_entrepot.selectedRangementId);
    console.warn(one_entrepot)
    if (!selected_entrepot) return;

    one_entrepot.rangements.push({
      id: selected_entrepot.id,
      nom: selected_entrepot.libelle_rangement,
      quantite: 0,
      quantite_reelle: 0
    });
    if (one_entrepot.rangements.length > 1) {
      one_stock.nombre_rangement += 1;
    }
    one_entrepot.selectedRangementId = null;
    one_entrepot.showAddRangementSelect = null; // laisser affiché
  }

  get_entrepot_rangements(id: number) {
    let rangements: any = this.form_details?.entrepot_rangements.find((one: any) => one.id == id).rangements;
    // console.warn('rangment', rangements)
    return rangements;
  }

  add_detail_inventaires(id_produit: number, id_rangement: number, quantite: number) {
    let detail_inventaires: any = {
      id_produit: id_produit,
      id_rangement: id_rangement,
      quantite_reelle: quantite,
      id_entreprise: this.api.id_current_entreprise,
      id_inventaire: this.id_inventaire
    }
    let detail_inventaire = this.detail_inventaires.find((one: any) => one.id == id_produit);
    detail_inventaire.entrepots.map((one: any) => {
      let rangement = one.rangements.find((one_rang: any) => +one_rang.id == +id_rangement);
      if (rangement) {
        rangement.deja_inventaire = true
      }
    });
    this.loading_add_detail_inventaires = true;
    this.api.taf_post("detail_inventaires", detail_inventaires, (reponse: any) => {
      this.loading_add_detail_inventaires = false;
      if (reponse.status_code) {
        console.log("Opération effectuée avec succés sur la table detail_inventaires. Réponse= ", reponse);
        // this.onReset_add_detail_inventaires()
        this.api.Swal_success("Opération éffectuée avec succés")
        // this.activeModal.close(reponse)
        // this.get_detail_inventaires();
      } else {
        console.log("L'opération sur la table detail_inventaires a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
    }, (error: any) => {
      this.loading_add_detail_inventaires = false;
    })
  }

  async cloturer_inventaire() {
    if (await this.api.Swal_confirm("De vouloir clôturer l'inventaire")) {
      let data_to_insert: any = [];
      this.detail_inventaires.map((one: any) => {
        one.entrepots.map((one_entre: any) => {
          one_entre.rangements.map((one_rang: any) => {
            if (one_rang.deja_inventaire != true) {
              data_to_insert.push({
                id_produit: one.id,
                id_rangement: one_rang.id,
                quantite_reelle: one_rang.quantite,
                id_entreprise: this.api.id_current_entreprise,
                id_inventaire: this.id_inventaire
              });
            }
          })
        })
      })
      this.loading_add_detail_inventaires = true;
      this.api.taf_post("inventaires/" + this.id_inventaire + "/cloturer", { les_details: data_to_insert }, (reponse: any) => {
        this.loading_add_detail_inventaires = false;
        if (reponse.status_code) {
          console.log("Opération effectuée avec succés sur la table detail_inventaires. Réponse= ", reponse);
          // this.onReset_add_detail_inventaires()
          this.api.Swal_success("Opération éffectuée avec succés")
          // this.activeModal.close(reponse)
          this.get_detail_inventaires();
        } else {
          console.log("L'opération sur la table detail_inventaires a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
      }, (error: any) => {
        this.loading_add_detail_inventaires = false;
      })
      console.info(data_to_insert)
    }
  }

  // Méthode pour filtrer les approvisionnements
  filtrer() {
    this.list = this.detail_inventaires.filter(one_produit => {
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
    this.valeur_stock=this.list.reduce((cumul:0,actu:any)=>{ return cumul + ((actu.prix_vente||1)*actu.quantite_total)},0)
  }
}
