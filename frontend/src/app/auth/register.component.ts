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
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
    <div class="auth-wrapper">
      <div class="auth-card">
        <h1>Registreeri</h1>
        <p class="subtitle">Loo konto ja alusta veose postitamist</p>

        @if (error) {
          <div class="auth-error">{{ error }}</div>
        }

        <mat-form-field appearance="outline">
          <mat-label>Täisnimi</mat-label>
          <mat-icon matPrefix>person</mat-icon>
          <input matInput [(ngModel)]="fullName">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>E-post</mat-label>
          <mat-icon matPrefix>email</mat-icon>
          <input matInput [(ngModel)]="email" type="email">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Telefon</mat-label>
          <mat-icon matPrefix>phone</mat-icon>
          <input matInput [(ngModel)]="phone">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Parool</mat-label>
          <mat-icon matPrefix>lock</mat-icon>
          <input matInput [(ngModel)]="password" [type]="showPw ? 'text' : 'password'">
          <button mat-icon-button matSuffix (click)="showPw = !showPw" type="button">
            <mat-icon>{{ showPw ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
        </mat-form-field>

        <button mat-raised-button class="auth-btn" (click)="onRegister()" [disabled]="loading">
          {{ loading ? 'Registreerin...' : 'Registreeri' }}
        </button>

        <div class="auth-footer">
          <a routerLink="/login">Juba konto? Logi sisse</a>
        </div>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  fullName = '';
  email = '';
  phone = '';
  password = '';
  error = '';
  loading = false;
  showPw = false;

  constructor(private auth: AuthService, private router: Router) {}

  onRegister() {
    this.loading = true;
    this.error = '';
    this.auth.register({
      email: this.email, password: this.password,
      fullName: this.fullName, phone: this.phone || undefined,
    }).subscribe({
      next: () => { this.loading = false; this.router.navigate(['/veod']); },
      error: (err) => { this.loading = false; this.error = err.error?.error || 'Viga registreerimisel'; },
    });
  }
}
