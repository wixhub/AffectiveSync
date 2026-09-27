import { Routes } from '@angular/router';

export const routes: Routes = [
  // Load dashboard at the root path
  {
    path: '',
    loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
  },

  // Wildcard route safely redirects 404s back to root
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
