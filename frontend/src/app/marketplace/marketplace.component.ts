import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../core/services/api.service';

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule],
  template: `
    <div class="container" style="padding-top:32px;padding-bottom:60px">
      <h1 class="page-title">Veoturg</h1>

      <div class="filter-bar">
        <mat-form-field appearance="outline" style="width:200px">
          <mat-label>Lähtelinn</mat-label>
          <mat-icon matPrefix>location_on</mat-icon>
          <input matInput [(ngModel)]="filters.pickup_city" placeholder="nt. Tallinn">
        </mat-form-field>
        <mat-form-field appearance="outline" style="width:200px">
          <mat-label>Sihtlinn</mat-label>
          <mat-icon matPrefix>flag</mat-icon>
          <input matInput [(ngModel)]="filters.delivery_city" placeholder="nt. Riia">
        </mat-form-field>
        <mat-form-field appearance="outline" style="width:200px">
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
        <button mat-raised-button color="primary" (click)="search()" style="height:48px;border-radius:10px">
          <mat-icon>search</mat-icon> Otsi
        </button>
      </div>

      <div class="card-grid">
        @for (l of listings; track l.id) {
          <a [routerLink]="['/veod', l.id]" class="listing-card">
            <div class="listing-route">
              <span>{{ l.pickupCity }}</span>
              <span class="route-arrow">→</span>
              <span>{{ l.deliveryCity }}</span>
            </div>
            <div class="listing-title">{{ l.title }}</div>
            <div class="listing-meta">
              <div class="meta-item">
                <mat-icon>calendar_today</mat-icon>
                {{ l.pickupDate }}
              </div>
              @if (l.cargoWeightKg) {
                <div class="meta-item">
                  <mat-icon>scale</mat-icon>
                  {{ l.cargoWeightKg }} kg
                </div>
              }
              @if (l.vehicleTypeRequired) {
                <div class="meta-item">
                  <mat-icon>local_shipping</mat-icon>
                  {{ l.vehicleTypeRequired }}
                </div>
              }
            </div>
            <div class="listing-footer">
              @if (l.budgetEur) {
                <span class="listing-price">{{ l.budgetEur }} €</span>
              } @else {
                <span style="color:#64748b;font-size:14px">Hind kokkuleppel</span>
              }
              <span class="status-chip" [class]="l.status.toLowerCase()">{{ l.status }}</span>
            </div>
          </a>
        } @empty {
          <div class="empty-state" style="grid-column:1/-1">
            <mat-icon>search_off</mat-icon>
            <h3>Ühtegi vedu ei leitud</h3>
            <p>Proovi muuta otsingufiltreid või postita ise vedu.</p>
          </div>
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
