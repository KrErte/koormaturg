import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, MatButtonModule, MatIconModule, MatMenuModule, MatDividerModule],
  template: `
    <nav class="navbar">
      <div class="nav-inner">
        <a routerLink="/" class="nav-logo">Koormaturg</a>
        <div class="nav-links">
          <a routerLink="/veod" class="nav-link">Veoturg</a>
          @if (auth.isLoggedIn()) {
            <a routerLink="/veod/uus" class="nav-link">Postita vedu</a>
            <button class="nav-avatar" [matMenuTriggerFor]="menu">
              <mat-icon>person</mat-icon>
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
            <a routerLink="/register" class="nav-btn">Alusta tasuta</a>
          }
        </div>
      </div>
    </nav>
    <router-outlet />
    <footer class="footer">
      <span>Koormaturg</span>
      <span>&copy; 2026 Koormaturg. Kõik õigused kaitstud.</span>
    </footer>
  `,
  styles: [`
    .navbar {
      background: white;
      padding: 0 24px;
      border-bottom: 1px solid #e5e7eb;
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .nav-inner {
      max-width: 1100px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 60px;
    }

    .nav-logo {
      color: #1a3b6e;
      text-decoration: none;
      font-size: 20px;
      font-weight: 800;
      letter-spacing: -0.5px;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .nav-link {
      color: #374151;
      text-decoration: none;
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      transition: background 0.15s;

      &:hover { background: #f3f4f6; }
    }

    .nav-btn {
      background: #1a3b6e;
      color: white;
      text-decoration: none;
      padding: 8px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      margin-left: 8px;
      transition: background 0.15s;

      &:hover { background: #2557a7; }
    }

    .nav-avatar {
      background: #f3f4f6;
      border: 1px solid #e5e7eb;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #374151;
      margin-left: 8px;
      transition: background 0.15s;

      &:hover { background: #e5e7eb; }
      mat-icon { font-size: 20px; width: 20px; height: 20px; }
    }

    .footer {
      border-top: 1px solid #e5e7eb;
      padding: 24px;
      display: flex;
      justify-content: space-between;
      max-width: 1100px;
      margin: 60px auto 0;
      font-size: 13px;
      color: #9ca3af;

      span:first-child { font-weight: 700; color: #1a3b6e; }
    }
  `],
})
export class AppComponent {
  constructor(public auth: AuthService) {}
}
