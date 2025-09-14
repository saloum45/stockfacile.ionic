import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'accueil',
        loadComponent: () =>
          import('../accueil/accueil.page').then((m) => m.AccueilPage),
      },
      {
        path: 'ventes',
        loadComponent: () =>
          import('../ventes/ventes.page').then((m) => m.VentesPage),
      },
      {
        path: 'stock',
        loadComponent: () =>
          import('../stock/stock.page').then((m) => m.StockPage),
      },
      {
        path: 'parametres',
        loadComponent: () =>
          import('../parametres/parametres.page').then((m) => m.ParametresPage),
      },
      {
        path: '',
        redirectTo: '/tabs/accueil',
        pathMatch: 'full',
      },
      {
        path: 'produits',
        loadComponent: () =>
          import('../produits/produits.page').then((m) => m.ProduitsPage),
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/accueil',
    pathMatch: 'full',
  },
];
