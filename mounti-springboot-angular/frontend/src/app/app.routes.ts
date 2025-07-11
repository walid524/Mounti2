import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: 'trips',
    loadChildren: () => import('./features/trips/trips.routes').then(m => m.TRIPS_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: 'bookings',
    loadChildren: () => import('./features/bookings/bookings.routes').then(m => m.BOOKINGS_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: 'notifications',
    loadChildren: () => import('./features/notifications/notifications.routes').then(m => m.NOTIFICATIONS_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/auth/login'
  }
];