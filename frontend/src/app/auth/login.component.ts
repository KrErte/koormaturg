import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
    <div class="auth-wrapper">
      <div class="auth-card">
        <div style="text-align:center;margin-bottom:24px">
          <mat-icon style="font-size:48px;width:48px;height:48px;color:var(--primary)">local_shipping</mat-icon>
        </div>
        <h1>Tere tulemast tagasi</h1>
        <p class="subtitle">Logi sisse oma Koormaturg kontole</p>

        @if (error) {
          <div class="auth-error">{{ error }}</div>
        }

        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <mat-icon matPrefix>email</mat-icon>
          <input matInput [(ngModel)]="email" type="email" placeholder="mati@ettevote.ee">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Parool</mat-label>
          <mat-icon matPrefix>lock</mat-icon>
          <input matInput [(ngModel)]="password" [type]="showPw ? 'text' : 'password'">
          <button mat-icon-button matSuffix (click)="showPw = !showPw" type="button">
            <mat-icon>{{ showPw ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
        </mat-form-field>

        <button mat-raised-button color="primary" class="auth-btn" (click)="onLogin()" [disabled]="loading">
          {{ loading ? 'Login...' : 'Logi sisse' }}
        </button>

        <p class="auth-footer">
          Pole kontot? <a routerLink="/register">Registreeru</a>
        </p>
      </div>
    </div>
  `,
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;
  showPw = false;

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
