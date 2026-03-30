import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../core/services/api.service';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-listing-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatDividerModule, MatIconModule],
  template: `
    <div class="container" style="max-width:800px;margin-top:24px">
      @if (listing) {
        <mat-card>
          <mat-card-header>
            <mat-card-title>{{ listing.title }}</mat-card-title>
            <mat-card-subtitle>
              {{ listing.pickupCity }} → {{ listing.deliveryCity }}
              <span class="status-chip" [class]="listing.status.toLowerCase()" style="margin-left:12px">{{ listing.status }}</span>
            </mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            @if (listing.description) { <p>{{ listing.description }}</p> }
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:16px 0">
              <div><strong>Lähteaadress:</strong> {{ listing.pickupAddress }}</div>
              <div><strong>Sihtaadress:</strong> {{ listing.deliveryAddress }}</div>
              <div><strong>Pealelaadimise kuupäev:</strong> {{ listing.pickupDate }}</div>
              <div><strong>Kohale kuupäev:</strong> {{ listing.deliveryDate || '—' }}</div>
              @if (listing.cargoDescription) { <div><strong>Kaup:</strong> {{ listing.cargoDescription }}</div> }
              @if (listing.cargoWeightKg) { <div><strong>Kaal:</strong> {{ listing.cargoWeightKg }} kg</div> }
              @if (listing.cargoVolumeM3) { <div><strong>Maht:</strong> {{ listing.cargoVolumeM3 }} m³</div> }
              @if (listing.vehicleTypeRequired) { <div><strong>Sõiduk:</strong> {{ listing.vehicleTypeRequired }}</div> }
              @if (listing.budgetEur) { <div><strong>Eelarve:</strong> {{ listing.budgetEur }} €</div> }
              @if (listing.acceptedPriceEur) { <div><strong>Kinnitatud hind:</strong> {{ listing.acceptedPriceEur }} €</div> }
            </div>
            @if (listing.specialRequirements) {
              <p><strong>Erinõuded:</strong> {{ listing.specialRequirements }}</p>
            }
            <p style="color:#999;font-size:13px">Postitatud: {{ listing.createdAt | date:'dd.MM.yyyy HH:mm' }} | Poster: {{ listing.posterName }}</p>
          </mat-card-content>

          @if (isOwner && listing.status === 'OPEN') {
            <mat-card-actions>
              <button mat-button color="warn" (click)="cancel()">Tühista</button>
            </mat-card-actions>
          }
          @if (isOwner && (listing.status === 'MATCHED' || listing.status === 'IN_TRANSIT')) {
            <mat-card-actions>
              <button mat-raised-button color="primary" (click)="complete()">Märgi lõpetatuks</button>
            </mat-card-actions>
          }
        </mat-card>

        <!-- Carrier: Make offer -->
        @if (canOffer) {
          <mat-card style="margin-top:16px">
            <mat-card-header><mat-card-title>Tee pakkumine</mat-card-title></mat-card-header>
            <mat-card-content>
              @if (offerError) { <p style="color:red">{{ offerError }}</p> }
              <div style="display:flex;gap:12px;align-items:end">
                <mat-form-field>
                  <mat-label>Hind (€)</mat-label>
                  <input matInput type="number" [(ngModel)]="offerPrice">
                </mat-form-field>
                <mat-form-field style="flex:1">
                  <mat-label>Sõnum</mat-label>
                  <input matInput [(ngModel)]="offerMessage">
                </mat-form-field>
                <button mat-raised-button color="primary" (click)="submitOffer()">Saada</button>
              </div>
            </mat-card-content>
          </mat-card>
        }

        <!-- Owner: See offers -->
        @if (isOwner && offers.length > 0) {
          <h2 style="margin-top:24px">Pakkumised ({{ offers.length }})</h2>
          @for (o of offers; track o.id) {
            <mat-card style="margin-bottom:12px">
              <mat-card-content>
                <div style="display:flex;justify-content:space-between;align-items:center">
                  <div>
                    <strong>{{ o.carrierName }}</strong> — {{ o.priceEur }} €
                    <span style="color:#666;margin-left:8px">{{ o.vehicleType }}</span>
                    @if (o.ratingAvg) { <span style="margin-left:8px">⭐ {{ o.ratingAvg }}</span> }
                    @if (o.message) { <p style="margin:4px 0;color:#666">{{ o.message }}</p> }
                  </div>
                  <div>
                    @if (o.status === 'PENDING' && listing.status === 'OPEN') {
                      <button mat-raised-button color="primary" (click)="acceptOffer(o.id)" style="margin-right:8px">Aktsepteeri</button>
                      <button mat-button color="warn" (click)="rejectOffer(o.id)">Lükka tagasi</button>
                    }
                    <span class="status-chip" [class]="o.status.toLowerCase()">{{ o.status }}</span>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          }
        }

        <!-- Payment -->
        @if (isOwner && listing.stripePaymentIntentId && !listing.serviceFeePaid) {
          <mat-card style="margin-top:16px">
            <mat-card-content>
              <p>Makse ootab kinnitust. Teenustasu: <strong>12.00 €</strong></p>
              <button mat-raised-button color="accent" (click)="pay()">Maksa nüüd</button>
            </mat-card-content>
          </mat-card>
        }

        <!-- Rating -->
        @if (listing.status === 'COMPLETED' && auth.isLoggedIn()) {
          <mat-card style="margin-top:16px">
            <mat-card-header><mat-card-title>Anna hinnang</mat-card-title></mat-card-header>
            <mat-card-content>
              @if (ratingError) { <p style="color:red">{{ ratingError }}</p> }
              @if (ratingDone) { <p style="color:green">Hinnang antud!</p> }
              @else {
                <div style="display:flex;gap:12px;align-items:end">
                  <mat-form-field style="width:80px">
                    <mat-label>Tähti</mat-label>
                    <input matInput type="number" min="1" max="5" [(ngModel)]="ratingStars">
                  </mat-form-field>
                  <mat-form-field style="flex:1">
                    <mat-label>Kommentaar</mat-label>
                    <input matInput [(ngModel)]="ratingComment">
                  </mat-form-field>
                  <button mat-raised-button color="primary" (click)="submitRating()">Hinda</button>
                </div>
              }
            </mat-card-content>
          </mat-card>
        }
      }
    </div>
  `,
})
export class ListingDetailComponent implements OnInit {
  listing: any;
  offers: any[] = [];
  isOwner = false;
  canOffer = false;
  offerPrice = 0;
  offerMessage = '';
  offerError = '';
  ratingStars = 5;
  ratingComment = '';
  ratingError = '';
  ratingDone = false;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    public auth: AuthService,
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getListing(id).subscribe(l => {
      this.listing = l;
      const user = this.auth.currentUser();
      this.isOwner = !!user && user.id === l.postedById;
      this.canOffer = !!user && !this.isOwner && l.status === 'OPEN';
      if (this.isOwner) {
        this.api.getOffers(id).subscribe(o => this.offers = o);
      }
    });
  }

  submitOffer() {
    this.offerError = '';
    this.api.createOffer(this.listing.id, { priceEur: this.offerPrice, message: this.offerMessage }).subscribe({
      next: () => { this.canOffer = false; },
      error: (e) => this.offerError = e.error?.error || 'Viga',
    });
  }

  acceptOffer(offerId: number) {
    this.api.acceptOffer(this.listing.id, offerId).subscribe(() => this.ngOnInit());
  }

  rejectOffer(offerId: number) {
    this.api.rejectOffer(this.listing.id, offerId).subscribe(() => this.ngOnInit());
  }

  cancel() {
    this.api.cancelListing(this.listing.id).subscribe(() => this.ngOnInit());
  }

  complete() {
    this.api.completeListing(this.listing.id).subscribe(() => this.ngOnInit());
  }

  async pay() {
    this.api.createPaymentIntent(this.listing.id).subscribe(async (res) => {
      const { loadStripe } = await import('@stripe/stripe-js');
      const stripe = await loadStripe('pk_test_placeholder');
      if (stripe) {
        const { error } = await stripe.confirmCardPayment(res.clientSecret, {
          payment_method: { card: { token: 'tok_visa' } as any },
        });
        if (error) alert(error.message);
        else this.ngOnInit();
      }
    });
  }

  submitRating() {
    this.ratingError = '';
    this.api.createRating(this.listing.id, { stars: this.ratingStars, comment: this.ratingComment }).subscribe({
      next: () => this.ratingDone = true,
      error: (e) => this.ratingError = e.error?.error || 'Viga',
    });
  }
}
