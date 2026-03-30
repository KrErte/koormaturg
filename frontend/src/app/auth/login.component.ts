import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <div class="container" style="max-width:400px;margin-top:60px">
      <mat-card>
        <mat-card-header><mat-card-title>Logi sisse</mat-card-title></mat-card-header>
        <mat-card-content>
          @if (error) {
            <p style="color:red;margin:8px 0">{{ error }}</p>
          }
          <mat-form-field style="width:100%">
            <mat-label>Email</mat-label>
            <input matInput [(ngModel)]="email" type="email">
          </mat-form-field>
          <mat-form-field style="width:100%">
            <mat-label>Parool</mat-label>
            <input matInput [(ngModel)]="password" type="password">
          </mat-form-field>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="onLogin()" [disabled]="loading" style="width:100%">
            {{ loading ? 'Laadin...' : 'Logi sisse' }}
          </button>
          <p style="text-align:center;margin-top:16px">
            Pole kontot? <a routerLink="/register">Registreeru</a>
          </p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  onLogin() {
    this.loading = true;
    this.error = '';
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => { this.loading = false; this.router.navigate(['/veod']); },
      error: (err) => { this.loading = false; this.error = err.error?.error || 'Viga sisselogimisel'; },
    });
  }
}
