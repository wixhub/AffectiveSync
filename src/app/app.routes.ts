import { Routes } from '@angular/router';
import { Powered } from './features/powered/powered';
import { Dashboard } from './features/dashboard/dashboard';

export const routes: Routes = [
  // Redirect root path to /dashboard
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  { path: 'dashboard', component: Dashboard },

  { path: 'powered', component: Powered },

  // Wildcard route to handle 404s by redirecting to home
  { path: '**', redirectTo: '/dashboard', pathMatch: 'full' },
];
