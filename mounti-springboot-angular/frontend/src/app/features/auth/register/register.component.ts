import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatIconModule
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-mint-50 flex items-center justify-center px-4">
      <div class="max-w-md w-full">
        <mat-card class="shadow-mediterranean-lg">
          <mat-card-content class="p-8">
            <div class="text-center mb-8">
              <div class="w-16 h-16 bg-gradient-to-r from-navy-600 to-mint-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <mat-icon class="text-white text-2xl">flight</mat-icon>
              </div>
              <h1 class="text-3xl font-bold text-navy-900 mb-2">Join Mounti</h1>
              <p class="text-gray-600">Create your account</p>
            </div>
            
            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-6">
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Full Name</mat-label>
                <input matInput type="text" formControlName="name" placeholder="Your full name">
                <mat-icon matSuffix>person</mat-icon>
                <mat-error *ngIf="registerForm.get('name')?.hasError('required')">
                  Name is required
                </mat-error>
                <mat-error *ngIf="registerForm.get('name')?.hasError('minlength')">
                  Name must be at least 2 characters
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Email</mat-label>
                <input matInput type="email" formControlName="email" placeholder="your@email.com">
                <mat-icon matSuffix>email</mat-icon>
                <mat-error *ngIf="registerForm.get('email')?.hasError('required')">
                  Email is required
                </mat-error>
                <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
                  Please enter a valid email
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Password</mat-label>
                <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password">
                <button mat-icon-button matSuffix type="button" (click)="hidePassword = !hidePassword">
                  <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                </button>
                <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
                  Password is required
                </mat-error>
                <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">
                  Password must be at least 6 characters
                </mat-error>
              </mat-form-field>

              <div class="flex items-center space-x-2">
                <mat-checkbox formControlName="isTransporter" color="primary">
                  I am a transporter
                </mat-checkbox>
              </div>
              <p class="text-xs text-gray-500 -mt-2">
                Check this if you plan to offer trips and transport parcels/passengers
              </p>

              <button 
                mat-raised-button 
                type="submit" 
                class="w-full btn-primary"
                [disabled]="registerForm.invalid || isLoading"
              >
                <mat-icon *ngIf="isLoading" class="animate-spin mr-2">refresh</mat-icon>
                {{ isLoading ? 'Creating account...' : 'Create Account' }}
              </button>
            </form>

            <div class="mt-6 text-center">
              <p class="text-sm text-gray-600">
                Already have an account? 
                <a routerLink="/auth/login" class="text-navy-600 hover:text-navy-700 font-semibold">
                  Sign in
                </a>
              </p>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .animate-spin {
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  hidePassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      isTransporter: [false]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      
      this.authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.snackBar.open('Account created successfully!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open(
            error.error?.message || 'Registration failed. Please try again.',
            'Close',
            {
              duration: 5000,
              panelClass: ['error-snackbar']
            }
          );
        }
      });
    }
  }
}