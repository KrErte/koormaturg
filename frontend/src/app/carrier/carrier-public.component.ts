import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { ApiService } from '../core/services/api.service';

@Component({
  selector: 'app-carrier-public',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatChipsModule],
  template: `
    <div class="container" style="max-width:700px;margin-top:24px">
      @if (carrier) {
        <mat-card>
          <mat-card-header>
            <mat-card-title>{{ carrier.fullName }}</mat-card-title>
            <mat-card-subtitle>
              {{ carrier.companyName || 'FIE' }} · {{ carrier.vehicleType }} · {{ carrier.vehiclePlate }}
            </mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            @if (carrier.verified) { <mat-chip-set><mat-chip color="primary" highlighted>Kinnitatud vedaja</mat-chip></mat-chip-set> }
            @if (carrier.ratingAvg) { <p>⭐ {{ carrier.ratingAvg }} ({{ carrier.ratingCount }} hinnangut)</p> }
            <p><strong>Max koormus:</strong> {{ carrier.maxLoadKg }} kg</p>
            @if (carrier.bio) { <p>{{ carrier.bio }}</p> }
          </mat-card-content>
        </mat-card>

        @if (ratings.length > 0) {
          <h2 style="margin-top:24px">Hinnangud</h2>
          @for (r of ratings; track r.id) {
            <mat-card style="margin-bottom:8px">
              <mat-card-content>
                <strong>{{ r.ratedByName }}</strong> — ⭐ {{ r.stars }}
                @if (r.comment) { <p style="margin:4px 0;color:#666">{{ r.comment }}</p> }
                <p style="font-size:12px;color:#999">{{ r.createdAt | date:'dd.MM.yyyy' }}</p>
              </mat-card-content>
            </mat-card>
          }
        }
      }
    </div>
  `,
})
export class CarrierPublicComponent implements OnInit {
  carrier: any;
  ratings: any[] = [];

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getCarrier(id).subscribe(c => this.carrier = c);
    this.api.getCarrierRatings(id).subscribe(r => this.ratings = r);
  }
}
