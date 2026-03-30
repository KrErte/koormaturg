import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, MatDividerModule],
  template: `
    <nav class="navbar">
      <div class="nav-inner">
        <a routerLink="/" class="nav-logo">
          <mat-icon>local_shipping</mat-icon>
          Koormaturg
        </a>
        <div class="nav-links">
          <a routerLink="/veod" class="nav-link">Veoturg</a>
          @if (auth.isLoggedIn()) {
            <a routerLink="/veod/uus" class="nav-link nav-cta">Postita vedu</a>
            <button class="nav-avatar" [matMenuTriggerFor]="menu">
              <mat-icon>account_circle</mat-icon>
            </button>
            <mat-menu #menu="matMenu">
              <a mat-menu-item routerLink="/minu-veod"><mat-icon>list_alt</mat-icon> Minu veod</a>
              <a mat-menu-item routerLink="/minu-pakkumised"><mat-icon>local_offer</mat-icon> Minu pakkumised</a>
              <a mat-menu-item routerLink="/vedaja-profiil"><mat-icon>badge</mat-icon> Vedaja profiil</a>
              @if (auth.isAdmin()) {
                <a mat-menu-item routerLink="/admin"><mat-icon>admin_panel_settings</mat-icon> Admin</a>
              }
              <mat-divider></mat-divider>
              <button mat-menu-item (click)="auth.logout()"><mat-icon>logout</mat-icon> Logi välja</button>
            </mat-menu>
          } @else {
            <a routerLink="/login" class="nav-link">Logi sisse</a>
            <a routerLink="/register" class="nav-link nav-cta-accent">Registreeru</a>
          }
        </div>
      </div>
    </nav>
    <router-outlet />
  `,
  styles: [`
    .navbar {
      background: #1e3a5f;
      padding: 0 20px;
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }

    .nav-inner {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 64px;
    }

    .nav-logo {
      color: white;
      text-decoration: none;
      font-size: 20px;
      font-weight: 800;
      display: flex;
      align-items: center;
      gap: 8px;
      letter-spacing: -0.5px;

      mat-icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
      }
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .nav-link {
      color: rgba(255,255,255,0.85);
      text-decoration: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.15s;

      &:hover {
        color: white;
        background: rgba(255,255,255,0.1);
      }
    }

    .nav-cta {
      background: rgba(255,255,255,0.15) !important;
      color: white !important;
      font-weight: 600;
      border: 1px solid rgba(255,255,255,0.2);
    }

    .nav-cta-accent {
      background: #ff6b35 !important;
      color: white !important;
      font-weight: 600;
      border-radius: 8px;

      &:hover {
        background: #ff8c5e !important;
      }
    }

    .nav-avatar {
      background: rgba(255,255,255,0.15);
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: white;
      transition: background 0.15s;

      &:hover { background: rgba(255,255,255,0.25); }

      mat-icon { font-size: 24px; width: 24px; height: 24px; }
    }
  `],
})
export class AppComponent {
  constructor(public auth: AuthService) {}
}
