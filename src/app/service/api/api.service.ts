import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import moment from 'moment';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Confirm } from 'notiflix';
import Notiflix from 'notiflix';
import { SharedPreferences } from '../shared-preferences/shared-preferences';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  local_storage_prefixe = "stockfacile.angular";
  // taf_base_url = "http://localhost:8000/api/";
  taf_base_url = "https://falltech.site/stockfacile.laravel/public/api/";
  menu: any = [];
  network: any = {
    token: undefined,
    status: true,
    message: "Aucun probléme détecté",
  }
  token: any = {
    token: null,
    // token_decoded: null,
    user_connected: null,
    // is_expired: null,
    // date_expiration: null
  }
  id_current_entreprise: any = localStorage.getItem("id_current_entreprise") ?? '{}';
  id_current_privilege: any = localStorage.getItem("id_current_privilege") ?? '{}';
  loading_current_entreprise = false;

  constructor(private http: HttpClient, private route: Router, private shared_preferences: SharedPreferences, public _location: Location) { }
  // sauvegardes
  async get_from_local_storage(key: string): Promise<any> {
    try {
      let res: any = await this.shared_preferences.get_from_preferences(key)
      return res
    } catch (error) {
      console.error("erreur de recuperation", error)
      return null
    }
  }
  async save_on_local_storage(key: string, value: any): Promise<void> {
    await this.shared_preferences.save_on_preferences(key, value);
  }
  async delete_from_local_storage(key: string) {
    await this.shared_preferences.delete_from_preferences(key);
  }


  async get_token() {
    // //le token n'est pas encore chargé
    // if (this.network.token == undefined) {
    //   this.network.token = await this.get_from_local_storage("token").token
    //   if (this.network.token != undefined && this.network.token != null) {// token existant
    //     this.update_data_from_token()// mise a jour du token
    //   }
    // } else {// token dèja chargé
    //   this.update_data_from_token()// mise a jour du token
    // }
    // console.warn((await this.get_from_local_storage("token")).token)
    if (this.token.token == null) {
      this.update_data_from_token();
    }
    return (await this.get_from_local_storage("token"))?.token
  }
  async get_token_profil() {
    return (await this.get_from_local_storage("token"))?.data
  }
  //les requetes http
  async taf_post(path: string, data_to_send: any, on_success: Function, on_error: Function) {
    let api_url = this.taf_base_url + path;
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + await this.get_token(),
      })
    };
    this.http.post(api_url, data_to_send, httpOptions).subscribe(
      (reponse: any) => {// on success
        on_success(reponse)
      },
      (error: any) => {// on error
        this.on_taf_post_error(error, on_error)
      }
    )
  }
  on_taf_get_error(error: any, on_error: Function) {
    this.network.status = false;
    this.network.message = error
    this.Swal_info("Merci de vérifier votre connexion")
    on_error(error)
  }
  async taf_get(path: string, on_success: Function, on_error: Function) {
    let api_url = this.taf_base_url + path;
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + await this.get_token(),
      })
    };

    this.http.get(api_url, httpOptions).subscribe(
      (reponse: any) => {// on success
        on_success(reponse)
      },
      (error: any) => {// on error
        this.on_taf_get_error(error, on_error)
      }
    )
  }
  async taf_delete(path: string, on_success: Function, on_error: Function) {
    let api_url = this.taf_base_url + path;
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + await this.get_token(),
      })
    };

    this.http.delete(api_url, httpOptions).subscribe(
      (reponse: any) => {// on success
        on_success(reponse)
      },
      (error: any) => {// on error
        this.on_taf_get_error(error, on_error)
      }
    )
  }
  async taf_put(path: string, data_to_send: any, on_success: Function, on_error: Function) {
    let api_url = this.taf_base_url + path;
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + await this.get_token(),
      })
    };
    this.http.put(api_url, data_to_send, httpOptions).subscribe(
      (reponse: any) => {// on success
        on_success(reponse)
      },
      (error: any) => {// on error
        this.on_taf_post_error(error, on_error)
      }
    )
  }
  async taf_post_login(path: string, data_to_send: any, on_success: Function, on_error: Function) {
    let api_url = this.taf_base_url + path;

    this.http.post(api_url, data_to_send).subscribe(
      (reponse: any) => {// on success
        on_success(reponse)
      },
      (error: any) => {// on error
        this.on_taf_post_error(error, on_error)
      }
    )
  }
  on_taf_post_error(error: any, on_error: any) {
    this.network.status = false;
    this.network.message = error
    this.Swal_info("Merci de vérifier votre connexion")
    on_error(error)
  }
  async update_data_from_token() {
    let token_key = (await this.get_from_local_storage("token"))
    // const helper = new JwtHelperService();
    // const decodedToken = helper.decodeToken(token_key);
    // const expirationDate = helper.getTokenExpirationDate(token_key);
    // const isExpired = helper.isTokenExpired(token_key);

    this.token = {
      token: token_key.token,
      // token_decoded: decodedToken,
      user_connected: token_key.data,
      // is_expired: isExpired,
      // date_expiration: expirationDate
    }
    if (this.token.is_expired) {
      this.on_token_expire()
    }
  }
  on_token_expire() {
    this.Swal_info("Votre session s'est expiré! Veuillez vous connecter à nouveau")
    this.delete_from_local_storage("token")
    this.route.navigate(['/public/login'])
  }

  Swal_success(title: any) {
    let succes = Swal.fire({
      position: 'bottom',
      icon: 'success',
      title: title,
      showConfirmButton: false,
      timer: 1000,
      toast: true,
      timerProgressBar: true,
    });
    return succes
  }

  Swal_error(title: any) {
    let succes = Swal.fire({
      position: 'bottom',
      icon: 'error',
      title: title,
      showConfirmButton: false,
      timer: 1500,
      toast: true,
      timerProgressBar: true,
    });
    return succes
  }
  Swal_info(title: any) {
    let succes = Swal.fire({
      position: 'bottom',
      icon: 'info',
      title: title,
      showConfirmButton: false,
      timer: 1500,
      toast: true,
      timerProgressBar: true,
    });
    return succes
  }
  Swal_blue(title: any) {
    let succes = Swal.fire({
      position: 'bottom',
      icon: 'info',
      title: title,
      showConfirmButton: false,
      timer: 1500,
      toast: true,
      timerProgressBar: true,
    });
    return succes
  }

  async Swal_confirm(title: string): Promise<boolean> {
    return new Promise((resolve) => {
      Notiflix.Confirm.show(
        'Êtes-vous sûr ?',
        title,
        'Oui',
        'Non',
        () => resolve(true),
        () => resolve(false)
      );
    });
  }

  is_already_selected(id: any, form: any, condition: string) {//la fonction désactive les options déja sélectionné dans le select
    let is_in = form.filter((one_detail: any) => one_detail[condition] == id)[0]?.[condition];
    return is_in;
  }

  format_date(date_string: string) {
    return {
      full: moment(date_string).locale("fr").format("dddd Do MMMM YYYY"),// 27 février 2023
      jma: moment(date_string).locale("fr").format("Do MMMM YYYY"),// jeudi ...
      jma2: moment(date_string).locale("fr").format("DD-MM-YYYY"),// 01-11-2023
      jma3: moment(date_string).locale("fr").format("YYYY-MM-DD"),// 2023-10-21
      jma3_hour: moment(date_string).locale("fr").format("YYYY-MM-DD HH:mm"),// 2023-10-21 14:50
      hour: moment().locale("fr").format("HH:mm"),// 14:50
      full_datetime: moment(date_string).locale("fr").format("dddd Do MMMM YYYY à HH:mm"),// 27 février 2023
    }
  }
  format_current_date() {
    return {
      full: moment().locale("fr").format("dddd Do MMMM YYYY"),// 27 février 2023
      jma: moment().locale("fr").format("Do MMMM YYYY"),// jeudi ...
      jma2: moment().locale("fr").format("DD-MM-YYYY"),// 01-11-2023
      jma3: moment().locale("fr").format("YYYY-MM-DD"),// 2023-10-21
      jma3_hour: moment().locale("fr").format("YYYY-MM-DD HH:mm"),// 2023-10-21 14:50
      full_datetime: moment().locale("fr").format("dddd Do MMMM YYYY à HH:mm"),// 27 février 2023
    }
  }

  les_droits: any = {
    // Gestion de la parti commerciale
    "produit.add": [1, 5, 6, 8],
    "produit.edit": [1, 5, 6, 8],
    "admin_user.edit": [1],
  };


  can(action: string) {
    let id_privilege = +this.id_current_privilege
    if (this.les_droits[action] && this.les_droits[action].indexOf(id_privilege) != -1) {
      return true
    } else {
      return false
    }
  }

  full_menu: any[] = [
    {
      menu_header: "Stock",
      items: [
        {
          text: "Tableau de bord",
          path: "/home/dashbord",
          icone: "bi bi-speedometer2",
          privileges: [1, 2, 3, 4, 5],
          items: []
        },
        {
          text: "Produits",
          path: "/home/produits",
          icone: "bi bi-bag",
          privileges: [1, 2, 3, 4, 5],
          items: []
        },
        {
          text: "Clients",
          path: "/home/clients",
          icone: "bi bi-people",
          privileges: [1, 2, 3, 4, 5],
          items: []
        },
        {
          text: "Approvisionnements",
          path: "/home/approvisionnements",
          icone: "bi bi-truck",
          privileges: [1, 2, 3, 4, 5],
          items: []
        },
        {
          text: "Stock",
          path: "/home/stock",
          icone: "bi bi-box-seam",
          privileges: [1, 2, 3, 4, 5],
          items: []
        },
        {
          text: "Inventaires",
          path: "/home/inventaires",
          icone: "bi bi-clipboard-data",
          privileges: [1, 2, 3, 4, 5],
          items: []
        },
        {
          text: "Ventes",
          path: "/home/ventes",
          icone: "bi bi-cash-stack",
          privileges: [1, 2, 3, 4, 5],
          items: []
        },
        {
          text: "Cahier Comptable",
          path: "/home/ecriture_comptable",
          icone: "bi bi-journal-text",
          privileges: [1, 2, 3, 4, 5],
          items: []
        },
        {
          text: "Utilisateurs",
          path: "/home/users",
          icone: "bi bi-person-lines-fill",
          privileges: [1, 2],
          items: []
        },
        {
          text: "Entreprises",
          path: "/home/entreprises",
          icone: "bi bi-building",
          privileges: [1],
          items: []
        }
      ]

    },];


  custom_menu() {
    // console.log("agent", this.token.token_decoded.taf_data)
    let id_privilege = +this.id_current_privilege
    // let id_privilege = 1;
    console.warn('id_privi', id_privilege)
    this.menu = this.full_menu.map((one: any) => {
      let res = Object.assign({}, one)
      res.items = one.items.filter((one_item: any) => {
        let is_vide = one_item.privileges.length == 0
        let es_dans_privileges = one_item.privileges.indexOf(id_privilege) != -1
        return is_vide || (es_dans_privileges)
      }).map((one_item: any) => {
        let res2 = Object.assign({}, one_item)
        res2.items = one_item.items.filter((one_sub_item: any) => {
          let is_vide = one_sub_item.privileges.length == 0
          let es_dans_privileges = one_sub_item.privileges.indexOf(id_privilege) != -1
          return is_vide || es_dans_privileges
        })
        return res2
      })
      return res
    }).filter((one: any) => one.items.length > 0)
    console.log("full_menu= ", this.full_menu, " menu= ", this.menu)
  }

  retour() {
    this._location.back()
  }

  formatNumber(value: any): string {
    if (!value || isNaN(Number(value))) {
      return value; // Retourne la valeur telle quelle si elle est null, vide ou non numérique
    }
    return Number(value).toLocaleString('fr-FR'); // Utilise Number.toLocaleString pour formater le nombre
  }


  produit_grouped_by(data: any) {
    let data_grouped = data.map((produit: any) => {
      const entrepotsMap = new Map<number, {
        id: number,
        nom: string,
        quantite: number,
        rangements: any[]
      }>();

      // ✅ Fusionner tous les événements dans un seul tableau
      const events: any[] = [];

      (produit.detail_inventaires || []).forEach((inv:any) => {
        events.push({
          type: 'inventaire',
          id_rangement: inv.id_rangement,
          quantite: inv.quantite_reelle,
          rangement: inv.rangement
        });
      });

      (produit.detail_approvisionnements || []).forEach((app:any) => {
        events.push({
          type: 'approvisionnement',
          id_rangement: app.rangement.id,
          quantite: app.quantite,
          rangement: app.rangement
        });
      });

      (produit.detail_ventes || []).forEach((vente:any) => {
        events.push({
          type: 'vente',
          id_rangement: vente.id_rangement,
          quantite: vente.quantite,
          rangement: vente.rangement
        });
      });

      // ✅ Grouper par rangement
      const rangementMap = new Map<number, any[]>();
      events.forEach(ev => {
        if (!rangementMap.has(ev.id_rangement)) rangementMap.set(ev.id_rangement, []);
        rangementMap.get(ev.id_rangement)!.push(ev);
      });

      // ✅ Calcul pour chaque rangement
      rangementMap.forEach((evts, id_rangement) => {
        const rangement = evts[0].rangement;
        const entrepot = rangement.entrepot;

        // Séparer par type
        const inventaire = evts.find(e => e.type === 'inventaire');
        const totalAppro = evts.filter(e => e.type === 'approvisionnement').reduce((sum, e) => sum + e.quantite, 0);
        const totalVente = evts.filter(e => e.type === 'vente').reduce((sum, e) => sum + e.quantite, 0);

        const quantite_reelle = inventaire?.quantite ?? null;
        const deja_inventaire = !!inventaire;

        // ✅ Logique : inventaire courant sinon appro - ventes
        let quantite_finale = 0;
        if (inventaire) {
          quantite_finale = quantite_reelle! + totalAppro - totalVente;
        } else {
          quantite_finale = totalAppro - totalVente;
        }

        // ✅ Ajouter au bon entrepôt
        if (!entrepotsMap.has(entrepot.id)) {
          entrepotsMap.set(entrepot.id, {
            id: entrepot.id,
            nom: entrepot.libelle_entrepot,
            quantite: 0,
            rangements: []
          });
        }

        const currentEntrepot = entrepotsMap.get(entrepot.id)!;

        currentEntrepot.rangements.push({
          id: rangement.id,
          nom: rangement.libelle_rangement,
          quantite: quantite_finale,
          quantite_reelle: quantite_reelle ?? quantite_finale,
          deja_inventaire
        });

        currentEntrepot.quantite += quantite_finale;
      });

      // ✅ Résumé par entrepôt
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
        detail_inventaires: produit.detail_inventaires
      };
    });

    console.warn(data_grouped)
    return data_grouped;
  }
}
