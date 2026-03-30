import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../core/services/api.service';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-listing-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule],
  template: `
    <div class="detail-wrapper">
      @if (listing) {
        <div class="detail-card">
          <div class="detail-header">
            <div class="route-display">
              <mat-icon>location_on</mat-icon>
              {{ listing.pickupCity }} → {{ listing.deliveryCity }}
              <span class="status-chip" [class]="listing.status.toLowerCase()" style="margin-left:auto">{{ listing.status }}</span>
            </div>
            <h1>{{ listing.title }}</h1>
          </div>

          <div class="detail-body">
            @if (listing.description) {
              <p style="font-size:15px;color:#64748b;line-height:1.6;margin:0 0 24px">{{ listing.description }}</p>
            }

            <div class="detail-grid">
              <div class="detail-item">
                <label>Lähteaadress</label>
                <div class="value">{{ listing.pickupAddress }}</div>
              </div>
              <div class="detail-item">
                <label>Sihtaadress</label>
                <div class="value">{{ listing.deliveryAddress }}</div>
              </div>
              <div class="detail-item">
                <label>Pealelaadimise kuupäev</label>
                <div class="value">{{ listing.pickupDate }}</div>
              </div>
              <div class="detail-item">
                <label>Kohale kuupäev</label>
                <div class="value">{{ listing.deliveryDate || 'Pole määratud' }}</div>
              </div>
              @if (listing.cargoDescription) {
                <div class="detail-item">
                  <label>Kaup</label>
                  <div class="value">{{ listing.cargoDescription }}</div>
                </div>
              }
              @if (listing.cargoWeightKg) {
                <div class="detail-item">
                  <label>Kaal</label>
                  <div class="value">{{ listing.cargoWeightKg }} kg</div>
                </div>
              }
              @if (listing.cargoVolumeM3) {
                <div class="detail-item">
                  <label>Maht</label>
                  <div class="value">{{ listing.cargoVolumeM3 }} m³</div>
                </div>
              }
              @if (listing.vehicleTypeRequired) {
                <div class="detail-item">
                  <label>Sõiduki tüüp</label>
                  <div class="value">{{ listing.vehicleTypeRequired }}</div>
                </div>
              }
              @if (listing.budgetEur) {
                <div class="detail-item">
                  <label>Eelarve</label>
                  <div class="value" style="font-size:20px;font-weight:700;color:var(--primary)">{{ listing.budgetEur }} €</div>
                </div>
              }
              @if (listing.acceptedPriceEur) {
                <div class="detail-item">
                  <label>Kinnitatud hind</label>
                  <div class="value" style="font-size:20px;font-weight:700;color:#059669">{{ listing.acceptedPriceEur }} €</div>
                </div>
              }
            </div>

            @if (listing.specialRequirements) {
              <div class="section-card" style="margin-top:0;background:var(--bg)">
                <strong>Erinõuded:</strong> {{ listing.specialRequirements }}
              </div>
            }

            <p style="color:#94a3b8;font-size:13px;margin-top:24px">
              Postitatud: {{ listing.createdAt | date:'dd.MM.yyyy HH:mm' }} · {{ listing.posterName }}
            </p>

            @if (isOwner && listing.status === 'OPEN') {
              <div style="margin-top:16px">
                <button mat-raised-button color="warn" (click)="cancel()">Tühista vedu</button>
              </div>
            }
            @if (isOwner && (listing.status === 'MATCHED' || listing.status === 'IN_TRANSIT')) {
              <div style="margin-top:16px">
                <button mat-raised-button color="primary" (click)="complete()">Märgi lõpetatuks</button>
              </div>
            }
          </div>
        </div>

        <!-- Carrier: Make offer -->
        @if (canOffer) {
          <div class="section-card">
            <h2><mat-icon style="vertical-align:middle;margin-right:8px">local_offer</mat-icon>Tee pakkumine</h2>
            @if (offerError) { <div class="auth-error" style="margin-bottom:16px">{{ offerError }}</div> }
            <div style="display:flex;gap:12px;align-items:flex-end;flex-wrap:wrap">
              <mat-form-field appearance="outline" style="width:140px">
                <mat-label>Hind (€)</mat-label>
                <input matInput type="number" [(ngModel)]="offerPrice">
              </mat-form-field>
              <mat-form-field appearance="outline" style="flex:1;min-width:200px">
                <mat-label>Sõnum</mat-label>
                <input matInput [(ngModel)]="offerMessage" placeholder="Lisa kommentaar...">
              </mat-form-field>
              <button mat-raised-button color="primary" (click)="submitOffer()" style="height:48px;border-radius:10px">
                Saada pakkumine
              </button>
            </div>
          </div>
        }

        <!-- Owner: See offers -->
        @if (isOwner && offers.length > 0) {
          <div class="section-card">
            <h2>Pakkumised ({{ offers.length }})</h2>
            @for (o of offers; track o.id) {
              <div class="offer-card">
                <div class="offer-info">
                  <div class="offer-carrier">
                    {{ o.carrierName }}
                    @if (o.ratingAvg) { <span style="margin-left:8px;color:#f59e0b">★ {{ o.ratingAvg }}</span> }
                  </div>
                  @if (o.message) { <div class="offer-message">{{ o.message }}</div> }
                  <div class="offer-meta">{{ o.vehicleType }}</div>
                </div>
                <div class="offer-actions">
                  <span class="offer-price">{{ o.priceEur }} €</span>
                  @if (o.status === 'PENDING' && listing.status === 'OPEN') {
                    <button mat-raised-button color="primary" (click)="acceptOffer(o.id)" style="border-radius:8px">Aktsepteeri</button>
                    <button mat-button color="warn" (click)="rejectOffer(o.id)">Lükka tagasi</button>
                  } @else {
                    <span class="status-chip" [class]="o.status.toLowerCase()">{{ o.status }}</span>
                  }
                </div>
              </div>
            }
          </div>
        }

        <!-- Payment -->
        @if (isOwner && listing.stripePaymentIntentId && !listing.serviceFeePaid) {
          <div class="section-card" style="border:2px solid var(--accent);background:#fff7ed">
            <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap">
              <mat-icon style="font-size:32px;width:32px;height:32px;color:var(--accent)">payment</mat-icon>
              <div>
                <strong>Makse ootab kinnitust</strong>
                <p style="margin:4px 0 0;color:#64748b">Teenustasu: <strong>12.00 €</strong></p>
              </div>
              <button mat-raised-button color="accent" (click)="pay()" style="margin-left:auto;border-radius:10px">Maksa nüüd</button>
            </div>
          </div>
        }

        <!-- Rating -->
        @if (listing.status === 'COMPLETED' && auth.isLoggedIn()) {
          <div class="section-card">
            <h2><mat-icon style="vertical-align:middle;margin-right:8px">star</mat-icon>Anna hinnang</h2>
            @if (ratingError) { <div class="auth-error">{{ ratingError }}</div> }
            @if (ratingDone) {
              <p style="color:#059669;font-weight:600">Hinnang antud! Täname.</p>
            } @else {
              <div style="display:flex;gap:12px;align-items:flex-end;flex-wrap:wrap">
                <mat-form-field appearance="outline" style="width:100px">
                  <mat-label>Tähti</mat-label>
                  <input matInput type="number" min="1" max="5" [(ngModel)]="ratingStars">
                </mat-form-field>
                <mat-form-field appearance="outline" style="flex:1;min-width:200px">
                  <mat-label>Kommentaar</mat-label>
                  <input matInput [(ngModel)]="ratingComment">
                </mat-form-field>
                <button mat-raised-button color="primary" (click)="submitRating()" style="height:48px;border-radius:10px">Hinda</button>
              </div>
            }
          </div>
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
