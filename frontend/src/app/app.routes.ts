import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./auth/home.component').then(m => m.HomeComponent) },
  { path: 'veod', loadComponent: () => import('./marketplace/marketplace.component').then(m => m.MarketplaceComponent) },
  { path: 'veod/uus', loadComponent: () => import('./listing/new-listing.component').then(m => m.NewListingComponent), canActivate: [authGuard] },
  { path: 'veod/:id', loadComponent: () => import('./listing/listing-detail.component').then(m => m.ListingDetailComponent) },
  { path: 'vedaja/:id', loadComponent: () => import('./carrier/carrier-public.component').then(m => m.CarrierPublicComponent) },
  { path: 'minu-veod', loadComponent: () => import('./dashboard/my-listings.component').then(m => m.MyListingsComponent), canActivate: [authGuard] },
  { path: 'minu-pakkumised', loadComponent: () => import('./dashboard/my-offers.component').then(m => m.MyOffersComponent), canActivate: [authGuard] },
  { path: 'vedaja-profiil', loadComponent: () => import('./carrier/carrier-profile.component').then(m => m.CarrierProfileComponent), canActivate: [authGuard] },
  { path: 'login', loadComponent: () => import('./auth/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./auth/register.component').then(m => m.RegisterComponent) },
  { path: 'admin', loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent), canActivate: [adminGuard] },
  { path: '**', redirectTo: '' },
];
