import { Routes } from '@angular/router';

export const BOOKINGS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./bookings.component').then(c => c.BookingsComponent)
  }
];