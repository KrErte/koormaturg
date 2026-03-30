import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

interface UserInfo {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  role: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private user = signal<UserInfo | null>(null);
  currentUser = this.user.asReadonly();

  constructor(private http: HttpClient, private router: Router) {
    if (this.getToken()) {
      this.loadUser();
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.user()?.role === 'ADMIN';
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  register(data: { email: string; password: string; fullName: string; phone?: string }) {
    return this.http.post<AuthResponse>('/api/auth/register', data).pipe(
      tap(res => this.saveTokens(res))
    );
  }

  login(data: { email: string; password: string }) {
    return this.http.post<AuthResponse>('/api/auth/login', data).pipe(
      tap(res => this.saveTokens(res))
    );
  }

  logout() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      this.http.post('/api/auth/logout', { refreshToken }).subscribe();
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.user.set(null);
    this.router.navigate(['/']);
  }

  refresh() {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<AuthResponse>('/api/auth/refresh', { refreshToken }).pipe(
      tap(res => this.saveTokens(res))
    );
  }

  loadUser() {
    this.http.get<UserInfo>('/api/auth/me').subscribe({
      next: u => this.user.set(u),
      error: () => this.logout(),
    });
  }

  private saveTokens(res: AuthResponse) {
    localStorage.setItem('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    this.loadUser();
  }
}
