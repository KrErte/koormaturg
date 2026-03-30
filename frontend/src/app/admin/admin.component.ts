import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink } from '@angular/router';
import { ApiService } from '../core/services/api.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatTabsModule, RouterLink],
  template: `
    <div class="container" style="margin-top:24px">
      <h1 class="page-title">Admin paneel</h1>

      @if (stats) {
        <div style="display:flex;gap:16px;margin-bottom:24px;flex-wrap:wrap">
          <mat-card style="padding:16px;min-width:150px"><h3>{{ stats.totalListings }}</h3><p>Vedu</p></mat-card>
          <mat-card style="padding:16px;min-width:150px"><h3>{{ stats.totalCarriers }}</h3><p>Vedajat</p></mat-card>
          <mat-card style="padding:16px;min-width:150px"><h3>{{ stats.verifiedCarriers }}</h3><p>Kinnitatud</p></mat-card>
        </div>
      }

      <mat-tab-group>
        <mat-tab label="Kinnitamata vedajad">
          @for (c of unverified; track c.id) {
            <mat-card style="margin:12px 0">
              <mat-card-content>
                <div style="display:flex;justify-content:space-between;align-items:center">
                  <div>
                    <strong>{{ c.fullName }}</strong>
                    {{ c.companyName ? '(' + c.companyName + ')' : '' }}
                    <br>
                    Litsents: {{ c.licenseNumber }} · {{ c.vehicleType }} · {{ c.vehiclePlate }} · {{ c.maxLoadKg }} kg
                  </div>
                  <div>
                    <button mat-raised-button color="primary" (click)="verify(c.id)" style="margin-right:8px">Kinnita</button>
                    <button mat-button color="warn" (click)="reject(c.id)">Lükka tagasi</button>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          } @empty {
            <p style="padding:16px;color:#666">Kõik vedajad on kinnitatud.</p>
          }
        </mat-tab>
        <mat-tab label="Kõik vedajad">
          @for (c of allCarriers; track c.id) {
            <mat-card style="margin:12px 0">
              <mat-card-content>
                <strong>{{ c.fullName }}</strong>
                {{ c.companyName ? '(' + c.companyName + ')' : '' }}
                · {{ c.vehicleType }}
                @if (c.verified) { <span style="color:green"> ✓ Kinnitatud</span> }
                @else { <span style="color:orange"> Ootab</span> }
              </mat-card-content>
            </mat-card>
          }
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
})
export class AdminComponent implements OnInit {
  stats: any;
  unverified: any[] = [];
  allCarriers: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.api.getAdminStats().subscribe(s => this.stats = s);
    this.api.getAdminCarriers(false).subscribe(c => this.unverified = c);
    this.api.getAdminCarriers().subscribe(c => this.allCarriers = c);
  }

  verify(id: number) {
    this.api.verifyCarrier(id).subscribe(() => this.load());
  }

  reject(id: number) {
    this.api.rejectCarrier(id, 'Dokumendid puuduvad').subscribe(() => this.load());
  }
}
