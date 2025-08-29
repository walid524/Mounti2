import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
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
              <h1 class="text-3xl font-bold text-navy-900 mb-2">Mounti</h1>
              <p class="text-gray-600">Smart delivery between Tunisia & France</p>
            </div>

            <div class="text-center mb-6">
              <img 
                src="https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwyfHx0cmF2ZWx8ZW58MHx8fGJsdWV8MTc1MjI0ODE5Mnww&ixlib=rb-4.1.0&q=85"
                alt="Travel"
                class="w-full h-48 object-cover rounded-xl mb-4"
              />
              <h2 class="text-xl font-semibold text-navy-900 mb-2">Connect. Travel. Deliver.</h2>
              <p class="text-gray-600 text-sm">Join travelers and senders for smart parcel delivery</p>
            </div>
            
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Email</mat-label>
                <input matInput type="email" formControlName="email" placeholder="your@email.com">
                <mat-icon matSuffix>email</mat-icon>
                <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
                  Email is required
                </mat-error>
                <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
                  Please enter a valid email
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Password</mat-label>
                <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password">
                <button mat-icon-button matSuffix type="button" (click)="hidePassword = !hidePassword">
                  <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                </button>
                <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                  Password is required
                </mat-error>
                <mat-error *ngIf="loginForm.get('password')?.hasError('minlength')">
                  Password must be at least 6 characters
                </mat-error>
              </mat-form-field>

              <button 
                mat-raised-button 
                type="submit" 
                class="w-full btn-primary"
                [disabled]="loginForm.invalid || isLoading"
              >
                <mat-icon *ngIf="isLoading" class="animate-spin mr-2">refresh</mat-icon>
                {{ isLoading ? 'Signing in...' : 'Sign In' }}
              </button>
            </form>

            <div class="mt-6 text-center">
              <p class="text-sm text-gray-600">
                Don't have an account? 
                <a routerLink="/auth/register" class="text-navy-600 hover:text-navy-700 font-semibold">
                  Sign up
                </a>
              </p>
            </div>

            <div class="mt-8 text-center text-xs text-gray-500">
              <p class="mb-2">Demo Accounts:</p>
              <p><strong>Transporter:</strong> transporter@mounti.com</p>
              <p><strong>Client:</strong> client@mounti.com</p>
              <p><strong>Password:</strong> password123</p>
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
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.snackBar.open('Login successful!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open(
            error.error?.message || 'Login failed. Please try again.',
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