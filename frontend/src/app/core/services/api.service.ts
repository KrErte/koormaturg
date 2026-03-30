import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  // Listings
  getListings(filters?: Record<string, string>): Observable<any> {
    let params = new HttpParams();
    if (filters) {
      Object.entries(filters).forEach(([key, val]) => {
        if (val) params = params.set(key, val);
      });
    }
    return this.http.get('/api/listings', { params });
  }

  getListing(id: number): Observable<any> {
    return this.http.get(`/api/listings/${id}`);
  }

  createListing(data: any): Observable<any> {
    return this.http.post('/api/listings', data);
  }

  updateListing(id: number, data: any): Observable<any> {
    return this.http.put(`/api/listings/${id}`, data);
  }

  cancelListing(id: number): Observable<any> {
    return this.http.put(`/api/listings/${id}/cancel`, {});
  }

  completeListing(id: number): Observable<any> {
    return this.http.put(`/api/listings/${id}/complete`, {});
  }

  getMyListings(): Observable<any> {
    return this.http.get('/api/listings/my');
  }

  // Offers
  getOffers(listingId: number): Observable<any> {
    return this.http.get(`/api/listings/${listingId}/offers`);
  }

  createOffer(listingId: number, data: any): Observable<any> {
    return this.http.post(`/api/listings/${listingId}/offers`, data);
  }

  acceptOffer(listingId: number, offerId: number): Observable<any> {
    return this.http.put(`/api/listings/${listingId}/offers/${offerId}/accept`, {});
  }

  rejectOffer(listingId: number, offerId: number): Observable<any> {
    return this.http.put(`/api/listings/${listingId}/offers/${offerId}/reject`, {});
  }

  getMyOffers(): Observable<any> {
    return this.http.get('/api/carriers/me/offers');
  }

  // Carriers
  registerCarrier(data: any): Observable<any> {
    return this.http.post('/api/carriers/register', data);
  }

  getMyCarrier(): Observable<any> {
    return this.http.get('/api/carriers/me');
  }

  updateCarrier(data: any): Observable<any> {
    return this.http.put('/api/carriers/me', data);
  }

  uploadLicense(file: File): Observable<any> {
    const fd = new FormData();
    fd.append('file', file);
    return this.http.post('/api/carriers/me/license', fd, { responseType: 'text' });
  }

  uploadInsurance(file: File): Observable<any> {
    const fd = new FormData();
    fd.append('file', file);
    return this.http.post('/api/carriers/me/insurance', fd, { responseType: 'text' });
  }

  getCarrier(id: number): Observable<any> {
    return this.http.get(`/api/carriers/${id}`);
  }

  getCarrierRatings(id: number): Observable<any> {
    return this.http.get(`/api/carriers/${id}/ratings`);
  }

  // Ratings
  createRating(listingId: number, data: any): Observable<any> {
    return this.http.post(`/api/ratings/listings/${listingId}`, data);
  }

  // Payment
  createPaymentIntent(listingId: number): Observable<any> {
    return this.http.post(`/api/payment/listings/${listingId}/create-intent`, {});
  }

  // Admin
  getAdminCarriers(verified?: boolean): Observable<any> {
    let params = new HttpParams();
    if (verified !== undefined) params = params.set('verified', String(verified));
    return this.http.get('/api/admin/carriers', { params });
  }

  verifyCarrier(id: number): Observable<any> {
    return this.http.put(`/api/admin/carriers/${id}/verify`, {});
  }

  rejectCarrier(id: number, reason: string): Observable<any> {
    return this.http.put(`/api/admin/carriers/${id}/reject`, { reason });
  }

  getAdminStats(): Observable<any> {
    return this.http.get('/api/admin/stats');
  }
}
