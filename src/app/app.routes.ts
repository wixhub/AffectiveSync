import { Routes } from '@angular/router';
import { Shell } from './core/layout/shell/shell';
import { Home } from './features/home/home';
import { Powered } from './features/powered/powered';

export const routes: Routes = [
  // Redirect root path to /home
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  // Shell acts as a wrapper for all main pages
  {
    path: '',
    component: Shell,
    children: [
      { path: 'home', component: Home },
      { path: 'powered', component: Powered },
    ],
  },

  // Wildcard route to handle 404s by redirecting to home
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];
