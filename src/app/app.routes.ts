import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage),
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'produits',
    loadComponent: () => import('./produits/produits.page').then( m => m.ProduitsPage)
  },
  {
    path: 'approvisionnements',
    loadComponent: () => import('./approvisionnements/approvisionnements.page').then( m => m.ApprovisionnementsPage)
  },
  {
    path: 'approvisionnements',
    loadComponent: () => import('./approvisionnements/approvisionnements.page').then( m => m.ApprovisionnementsPage)
  },
];
