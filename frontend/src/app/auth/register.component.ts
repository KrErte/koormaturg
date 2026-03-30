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
        <div style="text-align:center;margin-bottom:24px">
          <mat-icon style="font-size:48px;width:48px;height:48px;color:var(--primary)">local_shipping</mat-icon>
        </div>
        <h1>Loo konto</h1>
        <p class="subtitle">Alusta veose postitamist või vedajana tegutsemist</p>

        @if (error) {
          <div class="auth-error">{{ error }}</div>
        }

        <mat-form-field appearance="outline">
          <mat-label>Täisnimi</mat-label>
          <mat-icon matPrefix>person</mat-icon>
          <input matInput [(ngModel)]="fullName" placeholder="Mati Maasikas">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <mat-icon matPrefix>email</mat-icon>
          <input matInput [(ngModel)]="email" type="email" placeholder="mati@ettevote.ee">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Telefon</mat-label>
          <mat-icon matPrefix>phone</mat-icon>
          <input matInput [(ngModel)]="phone" placeholder="+372 5551 2345">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Parool</mat-label>
          <mat-icon matPrefix>lock</mat-icon>
          <input matInput [(ngModel)]="password" [type]="showPw ? 'text' : 'password'">
          <button mat-icon-button matSuffix (click)="showPw = !showPw" type="button">
            <mat-icon>{{ showPw ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
        </mat-form-field>

        <button mat-raised-button color="primary" class="auth-btn" (click)="onRegister()" [disabled]="loading">
          {{ loading ? 'Registreerin...' : 'Registreeru' }}
        </button>

        <p class="auth-footer">
          Juba konto? <a routerLink="/login">Logi sisse</a>
        </p>
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
