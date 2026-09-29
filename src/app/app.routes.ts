import { Routes } from '@angular/router';
import { Shell } from './core/layout/shell/shell';

export const routes: Routes = [
  // Shell acts as a wrapper for all main pages
  {
    path: '',
    component: Shell,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },
    ],
  },
  // Wildcard route safely redirects 404s back to root
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
