import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { ApiService } from '../core/services/api.service';

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatChipsModule],
  template: `
    <div class="container">
      <h1 class="page-title">Veoturg</h1>

      <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:24px">
        <mat-form-field style="width:180px">
          <mat-label>Lähtelinn</mat-label>
          <input matInput [(ngModel)]="filters.pickup_city">
        </mat-form-field>
        <mat-form-field style="width:180px">
          <mat-label>Sihtlinn</mat-label>
          <input matInput [(ngModel)]="filters.delivery_city">
        </mat-form-field>
        <mat-form-field style="width:180px">
          <mat-label>Sõiduki tüüp</mat-label>
          <mat-select [(ngModel)]="filters.vehicle_type">
            <mat-option value="">Kõik</mat-option>
            <mat-option value="CURTAIN">Tentauto</mat-option>
            <mat-option value="REFRIGERATED">Külmaauto</mat-option>
            <mat-option value="FLATBED">Avolava</mat-option>
            <mat-option value="VAN">Kaubik</mat-option>
            <mat-option value="TANKER">Tsistern</mat-option>
          </mat-select>
        </mat-form-field>
        <button mat-raised-button color="primary" (click)="search()">Otsi</button>
      </div>

      <div class="card-grid">
        @for (l of listings; track l.id) {
          <mat-card>
            <mat-card-header>
              <mat-card-title>{{ l.title }}</mat-card-title>
              <mat-card-subtitle>{{ l.pickupCity }} → {{ l.deliveryCity }}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p>Kuupäev: {{ l.pickupDate }}</p>
              @if (l.cargoWeightKg) { <p>Kaal: {{ l.cargoWeightKg }} kg</p> }
              @if (l.budgetEur) { <p>Eelarve: {{ l.budgetEur }} €</p> }
              @if (l.vehicleTypeRequired) { <p>Sõiduk: {{ l.vehicleTypeRequired }}</p> }
              <span class="status-chip" [class]="l.status.toLowerCase()">{{ l.status }}</span>
            </mat-card-content>
            <mat-card-actions>
              <a mat-button [routerLink]="['/veod', l.id]" color="primary">Vaata lähemalt</a>
            </mat-card-actions>
          </mat-card>
        } @empty {
          <p style="color:#666">Vedu ei leitud. Proovi teisi filtreid.</p>
        }
      </div>
    </div>
  `,
})
export class MarketplaceComponent implements OnInit {
  listings: any[] = [];
  filters: {[key: string]: string; pickup_city: string; delivery_city: string; vehicle_type: string} = { pickup_city: '', delivery_city: '', vehicle_type: '' };

  constructor(private api: ApiService) {}

  ngOnInit() { this.search(); }

  search() {
    this.api.getListings(this.filters).subscribe((res: any) => {
      this.listings = res.content || res;
    });
  }
}
