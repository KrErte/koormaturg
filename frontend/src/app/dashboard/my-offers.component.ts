import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../core/services/api.service';

@Component({
  selector: 'app-my-offers',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule],
  template: `
    <div class="container">
      <h1 class="page-title">Minu pakkumised</h1>
      <div class="card-grid">
        @for (o of offers; track o.id) {
          <mat-card>
            <mat-card-header>
              <mat-card-title>{{ o.priceEur }} €</mat-card-title>
              <mat-card-subtitle>Vedu #{{ o.listingId }}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              @if (o.message) { <p>{{ o.message }}</p> }
              <span class="status-chip" [class]="o.status.toLowerCase()">{{ o.status }}</span>
            </mat-card-content>
            <mat-card-actions>
              <a mat-button [routerLink]="['/veod', o.listingId]" color="primary">Vaata vedu</a>
            </mat-card-actions>
          </mat-card>
        } @empty {
          <p>Pole veel pakkumisi. <a routerLink="/veod">Mine veoturule!</a></p>
        }
      </div>
    </div>
  `,
})
export class MyOffersComponent implements OnInit {
  offers: any[] = [];
  constructor(private api: ApiService) {}
  ngOnInit() {
    this.api.getMyOffers().subscribe(o => this.offers = o);
  }
}
