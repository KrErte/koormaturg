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
        <h1>Logi sisse</h1>
        <p class="subtitle">Koormaturg — veoste vahendusplatvorm</p>

        @if (error) {
          <div class="auth-error">{{ error }}</div>
        }

        <mat-form-field appearance="outline">
          <mat-label>E-post</mat-label>
          <mat-icon matPrefix>email</mat-icon>
          <input matInput [(ngModel)]="email" type="email">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Parool</mat-label>
          <mat-icon matPrefix>lock</mat-icon>
          <input matInput [(ngModel)]="password" [type]="showPw ? 'text' : 'password'">
          <button mat-icon-button matSuffix (click)="showPw = !showPw" type="button">
            <mat-icon>{{ showPw ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
        </mat-form-field>

        <button mat-raised-button class="auth-btn" (click)="onLogin()" [disabled]="loading">
          {{ loading ? 'Laadin...' : 'Logi sisse' }}
        </button>

        <div class="auth-footer">
          <a routerLink="/register">Pole kontot? Registreeri</a>
        </div>
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
