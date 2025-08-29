import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { TripService } from '../../../services/trip.service';
import { BookingService } from '../../../services/booking.service';
import { Trip } from '../../../models/trip.model';
import { BookingType } from '../../../models/booking.model';

@Component({
  selector: 'app-trip-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  template: `
    <div class="container mx-auto px-4 py-8">
      <!-- Search Form -->
      <mat-card class="shadow-mediterranean mb-8">
        <mat-card-header>
          <mat-card-title class="text-2xl font-bold text-navy-900">Search Trips</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="searchForm" class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <mat-form-field appearance="outline">
              <mat-label>From</mat-label>
              <input matInput formControlName="fromLocation" placeholder="e.g., Tunis, Tunisia">
              <mat-icon matSuffix>flight_takeoff</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>To</mat-label>
              <input matInput formControlName="toLocation" placeholder="e.g., Paris, France">
              <mat-icon matSuffix>flight_land</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Departure Date</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="departureDate">
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
            </mat-form-field>

            <button 
              mat-raised-button 
              type="button"
              (click)="searchTrips()" 
              class="btn-primary h-14"
              [disabled]="isLoading"
            >
              <mat-icon *ngIf="isLoading" class="animate-spin mr-2">refresh</mat-icon>
              {{ isLoading ? 'Searching...' : 'Search' }}
            </button>
          </form>
        </mat-card-content>
      </mat-card>

      <!-- Search Results -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <mat-card 
          *ngFor="let trip of filteredTrips" 
          class="shadow-mediterranean hover:shadow-mediterranean-lg transition-shadow"
        >
          <mat-card-content class="p-6">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-lg font-semibold text-navy-900">
                  {{ trip.fromLocation }} → {{ trip.toLocation }}
                </h3>
                <p class="text-sm text-gray-600">by {{ trip.transporterName }}</p>
              </div>
              <span [ngClass]="getStatusClass(trip.status)">
                {{ trip.status }}
              </span>
            </div>

            <div class="space-y-2 mb-4">
              <p class="text-sm">
                <strong>Departure:</strong> {{ trip.departureDate | date:'medium' }}
              </p>
              <div class="flex space-x-4 text-sm">
                <span>🪑 {{ trip.availableSeats }} seats (€{{ trip.pricePerSeat }} each)</span>
                <span>📦 {{ trip.availableWeightKg }}kg (€{{ trip.pricePerKg }}/kg)</span>
              </div>
              <p *ngIf="trip.notes" class="text-sm text-gray-600">{{ trip.notes }}</p>
            </div>

            <button 
              mat-raised-button 
              (click)="openBookingDialog(trip)"
              class="w-full btn-primary"
              [disabled]="trip.status !== 'ACTIVE'"
            >
              <mat-icon class="mr-2">book</mat-icon>
              Book Now
            </button>
          </mat-card-content>
        </mat-card>

        <!-- No Results -->
        <div *ngIf="!isLoading && filteredTrips.length === 0" class="col-span-full">
          <mat-card class="shadow-mediterranean">
            <mat-card-content class="text-center py-12">
              <mat-icon class="text-6xl text-gray-400 mb-4">search_off</mat-icon>
              <h3 class="text-xl font-semibold text-gray-700 mb-2">No trips found</h3>
              <p class="text-gray-500 mb-4">Try adjusting your search criteria</p>
              <button mat-raised-button (click)="clearSearch()" class="btn-secondary">
                Clear Search
              </button>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="isLoading" class="text-center py-12">
        <mat-icon class="text-6xl text-navy-500 animate-spin mb-4">refresh</mat-icon>
        <p class="text-gray-600">Searching for trips...</p>
      </div>
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
    .shadow-mediterranean-lg {
      box-shadow: 0 10px 15px -3px rgba(30, 41, 59, 0.1), 0 4px 6px -2px rgba(30, 41, 59, 0.05);
    }
    .animate-spin {
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `]
})
export class TripSearchComponent implements OnInit {
  searchForm: FormGroup;
  filteredTrips: Trip[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private tripService: TripService,
    private bookingService: BookingService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.searchForm = this.fb.group({
      fromLocation: [''],
      toLocation: [''],
      departureDate: [null]
    });
  }

  ngOnInit(): void {
    this.loadAllTrips();
  }

  loadAllTrips(): void {
    this.isLoading = true;
    this.tripService.getAllTrips().subscribe({
      next: (trips) => {
        this.filteredTrips = trips;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading trips:', error);
        this.isLoading = false;
        this.snackBar.open('Error loading trips', 'Close', { duration: 3000 });
      }
    });
  }

  searchTrips(): void {
    this.isLoading = true;
    const searchParams = {
      fromLocation: this.searchForm.get('fromLocation')?.value || '',
      toLocation: this.searchForm.get('toLocation')?.value || '',
      departureDate: this.searchForm.get('departureDate')?.value 
        ? this.searchForm.get('departureDate')?.value.toISOString().split('T')[0] 
        : ''
    };

    this.tripService.getAllTrips(searchParams).subscribe({
      next: (trips) => {
        this.filteredTrips = trips;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error searching trips:', error);
        this.isLoading = false;
        this.snackBar.open('Error searching trips', 'Close', { duration: 3000 });
      }
    });
  }

  clearSearch(): void {
    this.searchForm.reset();
    this.loadAllTrips();
  }

  openBookingDialog(trip: Trip): void {
    // This would open a booking dialog - simplified for demo
    const bookingType = confirm('Book a seat (OK) or send a parcel (Cancel)?') 
      ? BookingType.SEAT 
      : BookingType.PARCEL;
    
    const quantity = parseInt(prompt(`How many ${bookingType.toLowerCase()}s?`) || '1');
    
    if (quantity > 0) {
      this.createBooking(trip.id, bookingType, quantity);
    }
  }

  createBooking(tripId: string, bookingType: BookingType, quantity: number): void {
    const bookingRequest = {
      tripId,
      bookingType,
      quantity
    };

    this.bookingService.createBooking(bookingRequest).subscribe({
      next: (booking) => {
        this.snackBar.open('Booking created successfully!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      },
      error: (error) => {
        this.snackBar.open(
          error.error?.message || 'Booking failed. Please try again.',
          'Close',
          {
            duration: 5000,
            panelClass: ['error-snackbar']
          }
        );
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'active':
        return 'status-active';
      case 'pending':
        return 'status-pending';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-pending';
    }
  }
}