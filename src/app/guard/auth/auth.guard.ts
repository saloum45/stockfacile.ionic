import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { ApiService } from '../../service/api/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private api:ApiService,private routage:Router) { }
  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    var token= await this.api.get_token()
    console.log("token on guard= ",token)
    if (token!=undefined && token!=null) {
      console.log("Utilisateur connecté")
      return true
    } else {
      console.log("Utilisateur non connecté")
      this.routage.navigate(['login']);
      return false
    }
  }
}
