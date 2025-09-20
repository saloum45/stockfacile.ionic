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
      {
        path: 'clients',
        loadComponent: () => import('../clients/clients.page').then(m => m.ClientsPage)
      },
      {
        path: 'approvisionnements',
        loadComponent: () => import('../approvisionnements/approvisionnements.page').then(m => m.ApprovisionnementsPage)
      },
      {
        path: 'inventaires',
        loadComponent: () => import('../inventaires/inventaires.page').then(m => m.InventairesPage)
      }
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/accueil',
    pathMatch: 'full',
  },
];
