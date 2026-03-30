import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
  template: `
    <mat-toolbar color="primary">
      <a routerLink="/" style="color:white;text-decoration:none;font-weight:700">Koormaturg</a>
      <span style="flex:1"></span>
      <a mat-button routerLink="/veod" style="color:white">Veoturg</a>
      @if (auth.isLoggedIn()) {
        <a mat-button routerLink="/veod/uus" style="color:white">Postita vedu</a>
        <button mat-icon-button [matMenuTriggerFor]="menu" style="color:white">
          <mat-icon>account_circle</mat-icon>
        </button>
        <mat-menu #menu="matMenu">
          <a mat-menu-item routerLink="/minu-veod">Minu veod</a>
          <a mat-menu-item routerLink="/minu-pakkumised">Minu pakkumised</a>
          <a mat-menu-item routerLink="/vedaja-profiil">Vedaja profiil</a>
          @if (auth.isAdmin()) {
            <a mat-menu-item routerLink="/admin">Admin</a>
          }
          <button mat-menu-item (click)="auth.logout()">Logi välja</button>
        </mat-menu>
      } @else {
        <a mat-button routerLink="/login" style="color:white">Logi sisse</a>
        <a mat-raised-button routerLink="/register" color="accent">Registreeru</a>
      }
    </mat-toolbar>
    <router-outlet />
  `,
})
export class AppComponent {
  constructor(public auth: AuthService) {}
}
