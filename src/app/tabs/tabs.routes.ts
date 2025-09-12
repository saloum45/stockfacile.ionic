import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
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
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/accueil',
    pathMatch: 'full',
  },
];
