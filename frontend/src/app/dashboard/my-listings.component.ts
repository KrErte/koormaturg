import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../core/services/api.service';

@Component({
  selector: 'app-my-listings',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule],
  template: `
    <div class="container">
      <h1 class="page-title">Minu veod</h1>
      <div class="card-grid">
        @for (l of listings; track l.id) {
          <mat-card>
            <mat-card-header>
              <mat-card-title>{{ l.title }}</mat-card-title>
              <mat-card-subtitle>{{ l.pickupCity }} → {{ l.deliveryCity }}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p>{{ l.pickupDate }}</p>
              <span class="status-chip" [class]="l.status.toLowerCase()">{{ l.status }}</span>
            </mat-card-content>
            <mat-card-actions>
              <a mat-button [routerLink]="['/veod', l.id]" color="primary">Vaata</a>
            </mat-card-actions>
          </mat-card>
        } @empty {
          <p>Pole veel veoseid. <a routerLink="/veod/uus">Postita esimene!</a></p>
        }
      </div>
    </div>
  `,
})
export class MyListingsComponent implements OnInit {
  listings: any[] = [];
  constructor(private api: ApiService) {}
  ngOnInit() {
    this.api.getMyListings().subscribe(l => this.listings = l);
  }
}
