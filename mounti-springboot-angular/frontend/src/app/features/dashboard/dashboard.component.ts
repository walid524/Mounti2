import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { AuthService } from '../../services/auth.service';
import { TripService } from '../../services/trip.service';
import { BookingService } from '../../services/booking.service';
import { NotificationService } from '../../services/notification.service';
import { User } from '../../models/user.model';
import { Trip } from '../../models/trip.model';
import { Booking } from '../../models/booking.model';
import { Notification } from '../../models/notification.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatTabsModule,
    MatBadgeModule,
    MatBottomSheetModule
  ],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <mat-toolbar class="bg-white shadow-lg">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gradient-to-r from-navy-600 to-mint-500 rounded-full flex items-center justify-center">
            <mat-icon class="text-white">flight</mat-icon>
          </div>
          <h1 class="text-2xl font-bold text-navy-900">Mounti</h1>
        </div>
        
        <span class="flex-1"></span>
        
        <div class="flex items-center space-x-4">
          <span class="text-sm text-gray-600">Welcome, {{ currentUser?.name }}</span>
          <button mat-icon-button (click)="logout()" class="text-red-600">
            <mat-icon>logout</mat-icon>
          </button>
        </div>
      </mat-toolbar>

      <!-- Mobile Navigation -->
      <div class="lg:hidden bg-white border-t fixed bottom-0 left-0 right-0 z-50">
        <div class="grid grid-cols-4 gap-1">
          <button 
            *ngFor="let item of mobileNavItems"
            [routerLink]="item.route"
            routerLinkActive="bg-mint-100 text-navy-600"
            class="p-3 text-center text-gray-600 hover:bg-gray-100"
          >
            <mat-icon class="text-lg mb-1">{{ item.icon }}</mat-icon>
            <div class="text-xs">{{ item.label }}</div>
            <mat-icon 
              *ngIf="item.badge && getUnreadCount() > 0" 
              [matBadge]="getUnreadCount()" 
              matBadgeSize="small" 
              matBadgeColor="warn"
              class="absolute top-1 right-1"
            >
            </mat-icon>
          </button>
        </div>
      </div>

      <!-- Desktop Navigation -->
      <div class="hidden lg:block bg-white border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <mat-tab-group 
            [(selectedIndex)]="selectedTabIndex" 
            class="border-none"
            (selectedTabChange)="onTabChange($event)"
          >
            <mat-tab 
              *ngFor="let tab of desktopTabs; let i = index" 
              [label]="tab.label"
            >
              <ng-template mat-tab-label>
                <mat-icon class="mr-2">{{ tab.icon }}</mat-icon>
                {{ tab.label }}
                <span 
                  *ngIf="tab.badge && getUnreadCount() > 0" 
                  class="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1"
                >
                  {{ getUnreadCount() }}
                </span>
              </ng-template>
            </mat-tab>
          </mat-tab-group>
        </div>
      </div>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 lg:pb-8">
        <div class="space-y-8">
          <div class="text-center">
            <h2 class="text-3xl font-bold text-navy-900 mb-4">Your Travel Hub</h2>
            <p class="text-gray-600">Manage your trips and bookings</p>
          </div>

          <!-- Statistics Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <mat-card class="shadow-mediterranean">
              <mat-card-content class="p-6">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-lg font-semibold text-navy-900">My Trips</h3>
                  <span class="text-2xl font-bold text-navy-600">{{ myTrips.length }}</span>
                </div>
                <p class="text-sm text-gray-600">Active trips you're transporting</p>
              </mat-card-content>
            </mat-card>

            <mat-card class="shadow-mediterranean">
              <mat-card-content class="p-6">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-lg font-semibold text-navy-900">Bookings</h3>
                  <span class="text-2xl font-bold text-mint-600">{{ myBookings.length }}</span>
                </div>
                <p class="text-sm text-gray-600">Your current bookings</p>
              </mat-card-content>
            </mat-card>

            <mat-card class="shadow-mediterranean">
              <mat-card-content class="p-6">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-lg font-semibold text-navy-900">Notifications</h3>
                  <span class="text-2xl font-bold text-orange-600">{{ getUnreadCount() }}</span>
                </div>
                <p class="text-sm text-gray-600">Unread notifications</p>
              </mat-card-content>
            </mat-card>
          </div>

          <!-- Recent Activity -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Recent Trips -->
            <mat-card class="shadow-mediterranean">
              <mat-card-header>
                <mat-card-title class="text-lg font-semibold text-navy-900">Recent Trips</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div *ngIf="myTrips.length === 0" class="text-center py-8">
                  <img 
                    src="https://images.unsplash.com/photo-1512757776214-26d36777b513?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwzfHx0cmF2ZWx8ZW58MHx8fGJsdWV8MTc1MjI0ODE5Mnww&ixlib=rb-4.1.0&q=85"
                    alt="No trips"
                    class="w-24 h-24 object-cover rounded-lg mx-auto mb-4"
                  />
                  <p class="text-gray-500">No trips yet. Create your first trip!</p>
                  <button mat-raised-button routerLink="/trips/create" class="mt-4 btn-primary">
                    Create Trip
                  </button>
                </div>
                
                <div *ngIf="myTrips.length > 0" class="space-y-4">
                  <div 
                    *ngFor="let trip of myTrips.slice(0, 3)" 
                    class="border rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div class="flex justify-between items-start mb-2">
                      <div>
                        <h4 class="font-semibold text-navy-900">{{ trip.fromLocation }} → {{ trip.toLocation }}</h4>
                        <p class="text-sm text-gray-600">{{ trip.departureDate | date:'short' }}</p>
                      </div>
                      <span [ngClass]="getStatusClass(trip.status)">
                        {{ trip.status }}
                      </span>
                    </div>
                    <div class="flex space-x-4 text-sm text-gray-600">
                      <span>🪑 {{ trip.availableSeats }} seats</span>
                      <span>📦 {{ trip.availableWeightKg }}kg</span>
                    </div>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>

            <!-- Recent Bookings -->
            <mat-card class="shadow-mediterranean">
              <mat-card-header>
                <mat-card-title class="text-lg font-semibold text-navy-900">Recent Bookings</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div *ngIf="myBookings.length === 0" class="text-center py-8">
                  <img 
                    src="https://images.unsplash.com/photo-1647221597996-54f3d0f73809?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwxfHxkZWxpdmVyeXxlbnwwfHx8Ymx1ZXwxNzUyMjQ4MTk3fDA&ixlib=rb-4.1.0&q=85"
                    alt="No bookings"
                    class="w-24 h-24 object-cover rounded-lg mx-auto mb-4"
                  />
                  <p class="text-gray-500">No bookings yet. Search for trips!</p>
                  <button mat-raised-button routerLink="/trips/search" class="mt-4 btn-primary">
                    Search Trips
                  </button>
                </div>
                
                <div *ngIf="myBookings.length > 0" class="space-y-4">
                  <div 
                    *ngFor="let booking of myBookings.slice(0, 3)" 
                    class="border rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div class="flex justify-between items-start mb-2">
                      <div>
                        <h4 class="font-semibold text-navy-900">{{ booking.bookingType }} booking</h4>
                        <p class="text-sm text-gray-600">€{{ booking.totalPrice }}</p>
                      </div>
                      <span [ngClass]="getStatusClass(booking.status)">
                        {{ booking.status }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600">Quantity: {{ booking.quantity }}</p>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>

          <!-- Quick Actions -->
          <div class="text-center">
            <h3 class="text-xl font-semibold text-navy-900 mb-6">Quick Actions</h3>
            <div class="flex flex-wrap justify-center gap-4">
              <button mat-raised-button routerLink="/trips/create" class="btn-primary">
                <mat-icon class="mr-2">add</mat-icon>
                Create Trip
              </button>
              <button mat-raised-button routerLink="/trips/search" class="btn-secondary">
                <mat-icon class="mr-2">search</mat-icon>
                Search Trips
              </button>
              <button mat-raised-button routerLink="/bookings" class="btn-secondary">
                <mat-icon class="mr-2">bookmark</mat-icon>
                My Bookings
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .btn-primary {
      @apply bg-gradient-to-r from-navy-600 to-mint-500 text-white;
    }
    .btn-secondary {
      @apply bg-white text-navy-600 border-2 border-navy-600;
    }
    .shadow-mediterranean {
      box-shadow: 0 4px 6px -1px rgba(30, 41, 59, 0.1), 0 2px 4px -1px rgba(30, 41, 59, 0.06);
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  myTrips: Trip[] = [];
  myBookings: Booking[] = [];
  notifications: Notification[] = [];
  selectedTabIndex = 0;

  mobileNavItems = [
    { route: '/dashboard', icon: 'home', label: 'Home' },
    { route: '/trips/create', icon: 'add', label: 'Create' },
    { route: '/trips/search', icon: 'search', label: 'Search' },
    { route: '/notifications', icon: 'notifications', label: 'Alerts', badge: true }
  ];

  desktopTabs = [
    { route: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { route: '/trips/create', icon: 'add', label: 'Create Trip' },
    { route: '/trips/search', icon: 'search', label: 'Search Trips' },
    { route: '/notifications', icon: 'notifications', label: 'Notifications', badge: true }
  ];

  constructor(
    private authService: AuthService,
    private tripService: TripService,
    private bookingService: BookingService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadTrips();
    this.loadBookings();
    this.loadNotifications();
  }

  private loadUserData(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  private loadTrips(): void {
    this.tripService.getMyTrips().subscribe({
      next: (trips) => this.myTrips = trips,
      error: (error) => console.error('Error loading trips:', error)
    });
  }

  private loadBookings(): void {
    this.bookingService.getMyBookings().subscribe({
      next: (bookings) => this.myBookings = bookings,
      error: (error) => console.error('Error loading bookings:', error)
    });
  }

  private loadNotifications(): void {
    this.notificationService.getNotifications().subscribe({
      next: (notifications) => this.notifications = notifications,
      error: (error) => console.error('Error loading notifications:', error)
    });
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'active':
      case 'confirmed':
        return 'status-active';
      case 'pending':
        return 'status-pending';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-pending';
    }
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  onTabChange(event: any): void {
    this.selectedTabIndex = event.index;
  }

  logout(): void {
    this.authService.logout();
  }
}