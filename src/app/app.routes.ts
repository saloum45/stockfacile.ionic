import { Routes } from '@angular/router';
import { AuthGuard } from './guard/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage),
  },
  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full',
  }
];
