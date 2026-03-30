import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule],
  template: `
    <div style="text-align:center;padding:80px 16px">
      <h1 style="font-size:48px;font-weight:700;margin-bottom:16px">Koormaturg</h1>
      <p style="font-size:20px;color:#666;max-width:600px;margin:0 auto 40px">
        Eesti ja Baltikumi veose vahendusplatvorm. Postita vedu, saa pakkumisi sertifitseeritud vedajatelt.
      </p>
      <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap">
        <a mat-raised-button color="primary" routerLink="/veod" style="font-size:16px;padding:8px 32px">
          Vaata veoturg
        </a>
        <a mat-raised-button color="accent" routerLink="/register" style="font-size:16px;padding:8px 32px">
          Registreeru
        </a>
      </div>

      <div style="display:flex;gap:40px;justify-content:center;margin-top:80px;flex-wrap:wrap">
        <div style="max-width:250px">
          <mat-icon style="font-size:48px;width:48px;height:48px;color:#1976d2">local_shipping</mat-icon>
          <h3>Postita vedu</h3>
          <p style="color:#666">Kirjelda oma veose vajadust — tasuta!</p>
        </div>
        <div style="max-width:250px">
          <mat-icon style="font-size:48px;width:48px;height:48px;color:#1976d2">gavel</mat-icon>
          <h3>Saa pakkumisi</h3>
          <p style="color:#666">Sertifitseeritud vedajad teevad pakkumisi</p>
        </div>
        <div style="max-width:250px">
          <mat-icon style="font-size:48px;width:48px;height:48px;color:#1976d2">verified</mat-icon>
          <h3>Maksa 12€</h3>
          <p style="color:#666">Teenustasu ainult siis, kui juht leitud</p>
        </div>
      </div>
    </div>
  `,
})
export class HomeComponent {}
