import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../core/services/api.service';

@Component({
  selector: 'app-new-listing',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatCheckboxModule, MatButtonModule],
  template: `
    <div class="container" style="max-width:700px;margin-top:24px">
      <h1 class="page-title">Postita vedu</h1>
      <mat-card>
        <mat-card-content>
          @if (error) { <p style="color:red">{{ error }}</p> }

          <h3>Marsruut</h3>
          <div style="display:flex;gap:12px;flex-wrap:wrap">
            <mat-form-field style="flex:1;min-width:200px">
              <mat-label>Lähteaadress</mat-label>
              <input matInput [(ngModel)]="form.pickupAddress" required>
            </mat-form-field>
            <mat-form-field style="width:150px">
              <mat-label>Lähtelinn</mat-label>
              <input matInput [(ngModel)]="form.pickupCity" required>
            </mat-form-field>
          </div>
          <div style="display:flex;gap:12px;flex-wrap:wrap">
            <mat-form-field style="flex:1;min-width:200px">
              <mat-label>Sihtaadress</mat-label>
              <input matInput [(ngModel)]="form.deliveryAddress" required>
            </mat-form-field>
            <mat-form-field style="width:150px">
              <mat-label>Sihtlinn</mat-label>
              <input matInput [(ngModel)]="form.deliveryCity" required>
            </mat-form-field>
          </div>

          <h3>Pealkiri ja kirjeldus</h3>
          <mat-form-field style="width:100%">
            <mat-label>Pealkiri</mat-label>
            <input matInput [(ngModel)]="form.title" required>
          </mat-form-field>
          <mat-form-field style="width:100%">
            <mat-label>Kirjeldus</mat-label>
            <textarea matInput [(ngModel)]="form.description" rows="3"></textarea>
          </mat-form-field>

          <h3>Aeg</h3>
          <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center">
            <mat-form-field style="width:200px">
              <mat-label>Pealelaadimise kuupäev</mat-label>
              <input matInput [matDatepicker]="dp1" [(ngModel)]="form.pickupDate" required>
              <mat-datepicker-toggle matIconSuffix [for]="dp1"></mat-datepicker-toggle>
              <mat-datepicker #dp1></mat-datepicker>
            </mat-form-field>
            <mat-form-field style="width:200px">
              <mat-label>Kohale kuupäev</mat-label>
              <input matInput [matDatepicker]="dp2" [(ngModel)]="form.deliveryDate">
              <mat-datepicker-toggle matIconSuffix [for]="dp2"></mat-datepicker-toggle>
              <mat-datepicker #dp2></mat-datepicker>
            </mat-form-field>
            <mat-checkbox [(ngModel)]="form.flexibleDates">Paindlikud kuupäevad</mat-checkbox>
          </div>

          <h3>Kaup</h3>
          <div style="display:flex;gap:12px;flex-wrap:wrap">
            <mat-form-field style="width:200px">
              <mat-label>Kauba kirjeldus</mat-label>
              <input matInput [(ngModel)]="form.cargoDescription">
            </mat-form-field>
            <mat-form-field style="width:150px">
              <mat-label>Kaal (kg)</mat-label>
              <input matInput type="number" [(ngModel)]="form.cargoWeightKg">
            </mat-form-field>
            <mat-form-field style="width:150px">
              <mat-label>Maht (m³)</mat-label>
              <input matInput type="number" [(ngModel)]="form.cargoVolumeM3">
            </mat-form-field>
          </div>
          <div style="display:flex;gap:12px;flex-wrap:wrap">
            <mat-form-field style="width:200px">
              <mat-label>Sõiduki tüüp</mat-label>
              <mat-select [(ngModel)]="form.vehicleTypeRequired">
                <mat-option value="">Pole oluline</mat-option>
                <mat-option value="CURTAIN">Tentauto</mat-option>
                <mat-option value="REFRIGERATED">Külmaauto</mat-option>
                <mat-option value="FLATBED">Avolava</mat-option>
                <mat-option value="VAN">Kaubik</mat-option>
                <mat-option value="TANKER">Tsistern</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field style="width:150px">
              <mat-label>Eelarve (€)</mat-label>
              <input matInput type="number" [(ngModel)]="form.budgetEur">
            </mat-form-field>
          </div>
          <mat-form-field style="width:100%">
            <mat-label>Erinõuded</mat-label>
            <textarea matInput [(ngModel)]="form.specialRequirements" rows="2"></textarea>
          </mat-form-field>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="submit()" [disabled]="loading">
            {{ loading ? 'Postitan...' : 'Postita vedu' }}
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
})
export class NewListingComponent {
  form: any = { flexibleDates: false };
  error = '';
  loading = false;

  constructor(private api: ApiService, private router: Router) {}

  submit() {
    this.loading = true;
    this.error = '';
    const data = { ...this.form };
    if (data.pickupDate instanceof Date) {
      data.pickupDate = data.pickupDate.toISOString().split('T')[0];
    }
    if (data.deliveryDate instanceof Date) {
      data.deliveryDate = data.deliveryDate.toISOString().split('T')[0];
    }
    this.api.createListing(data).subscribe({
      next: (res) => { this.loading = false; this.router.navigate(['/veod', res.id]); },
      error: (err) => { this.loading = false; this.error = err.error?.error || 'Viga postiteerimisel'; },
    });
  }
}
