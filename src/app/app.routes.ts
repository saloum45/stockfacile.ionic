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
    path: 'accueil',
    loadComponent: () => import('./accueil/accueil.page').then( m => m.AccueilPage)
  },
  {
    path: 'ventes',
    loadComponent: () => import('./ventes/ventes.page').then( m => m.VentesPage)
  },
  {
    path: 'stock',
    loadComponent: () => import('./stock/stock.page').then( m => m.StockPage)
  },
  {
    path: 'parametres',
    loadComponent: () => import('./parametres/parametres.page').then( m => m.ParametresPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
];
