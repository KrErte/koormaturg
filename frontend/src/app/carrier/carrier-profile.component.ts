import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { ApiService } from '../core/services/api.service';

@Component({
  selector: 'app-carrier-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatChipsModule],
  template: `
    <div class="container" style="max-width:600px;margin-top:24px">
      <h1 class="page-title">{{ isEdit ? 'Vedaja profiil' : 'Registreeru vedajaks' }}</h1>
      <mat-card>
        <mat-card-content>
          @if (error) { <p style="color:red">{{ error }}</p> }
          @if (success) { <p style="color:green">{{ success }}</p> }

          @if (carrier?.verified) {
            <mat-chip-set><mat-chip color="primary" highlighted>Kinnitatud</mat-chip></mat-chip-set>
          } @else if (isEdit) {
            <p style="color:orange">Ootab kinnitust</p>
          }

          <mat-form-field style="width:100%">
            <mat-label>Firma nimi</mat-label>
            <input matInput [(ngModel)]="form.companyName">
          </mat-form-field>
          <mat-form-field style="width:100%">
            <mat-label>Litsentsi number</mat-label>
            <input matInput [(ngModel)]="form.licenseNumber" required>
          </mat-form-field>
          <div style="display:flex;gap:12px">
            <mat-form-field style="flex:1">
              <mat-label>Sõiduki tüüp</mat-label>
              <mat-select [(ngModel)]="form.vehicleType" required>
                <mat-option value="CURTAIN">Tentauto</mat-option>
                <mat-option value="REFRIGERATED">Külmaauto</mat-option>
                <mat-option value="FLATBED">Avolava</mat-option>
                <mat-option value="VAN">Kaubik</mat-option>
                <mat-option value="TANKER">Tsistern</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field style="flex:1">
              <mat-label>Numbrimärk</mat-label>
              <input matInput [(ngModel)]="form.vehiclePlate" required>
            </mat-form-field>
          </div>
          <mat-form-field style="width:100%">
            <mat-label>Max koormus (kg)</mat-label>
            <input matInput type="number" [(ngModel)]="form.maxLoadKg" required>
          </mat-form-field>
          <mat-form-field style="width:100%">
            <mat-label>Bio</mat-label>
            <textarea matInput [(ngModel)]="form.bio" rows="3"></textarea>
          </mat-form-field>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="save()">
            {{ isEdit ? 'Uuenda' : 'Registreeru' }}
          </button>
        </mat-card-actions>
      </mat-card>

      @if (isEdit) {
        <mat-card style="margin-top:16px">
          <mat-card-header><mat-card-title>Dokumendid</mat-card-title></mat-card-header>
          <mat-card-content>
            <div style="margin-bottom:12px">
              <label>Litsents (PDF/JPG):</label>
              <input type="file" (change)="uploadLicense($event)" accept=".pdf,.jpg,.jpeg,.png">
              @if (carrier?.licenseDocPath) { <span style="color:green;margin-left:8px">Üles laaditud</span> }
            </div>
            <div>
              <label>Kindlustus (PDF/JPG):</label>
              <input type="file" (change)="uploadInsurance($event)" accept=".pdf,.jpg,.jpeg,.png">
              @if (carrier?.insuranceDocPath) { <span style="color:green;margin-left:8px">Üles laaditud</span> }
            </div>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
})
export class CarrierProfileComponent implements OnInit {
  form: any = {};
  carrier: any;
  isEdit = false;
  error = '';
  success = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getMyCarrier().subscribe({
      next: (c) => {
        this.carrier = c;
        this.isEdit = true;
        this.form = {
          companyName: c.companyName, licenseNumber: c.licenseNumber,
          vehicleType: c.vehicleType, vehiclePlate: c.vehiclePlate,
          maxLoadKg: c.maxLoadKg, operatingRegions: c.operatingRegions, bio: c.bio,
        };
      },
      error: () => { /* no carrier yet */ },
    });
  }

  save() {
    this.error = ''; this.success = '';
    const obs = this.isEdit ? this.api.updateCarrier(this.form) : this.api.registerCarrier(this.form);
    obs.subscribe({
      next: () => { this.success = 'Salvestatud!'; this.ngOnInit(); },
      error: (e) => this.error = e.error?.error || 'Viga',
    });
  }

  uploadLicense(event: any) {
    const file = event.target.files[0];
    if (file) this.api.uploadLicense(file).subscribe(() => this.ngOnInit());
  }

  uploadInsurance(event: any) {
    const file = event.target.files[0];
    if (file) this.api.uploadInsurance(file).subscribe(() => this.ngOnInit());
  }
}
