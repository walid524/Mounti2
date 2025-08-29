import { Routes } from '@angular/router';

export const TRIPS_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'search',
    pathMatch: 'full'
  },
  {
    path: 'search',
    loadComponent: () => import('./trip-search/trip-search.component').then(c => c.TripSearchComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./trip-create/trip-create.component').then(c => c.TripCreateComponent)
  },
  {
    path: 'my-trips',
    loadComponent: () => import('./my-trips/my-trips.component').then(c => c.MyTripsComponent)
  }
];