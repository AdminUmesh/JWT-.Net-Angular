// src/app/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string; // ISO date string
  refreshTokenExpiresAt: string; // ISO date string
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = `${environment.apiBaseUrl}/auth`;
  private _isRefreshing = false;

  constructor(private http: HttpClient) {}

  login(userName: string, password: string): Observable<TokenResponse> {
    return this.http
      .post<TokenResponse>(`${this.api}/login`, { userName, password })
      .pipe(tap((res) => this.saveTokens(res)));
  }

  logout(): Observable<any> {
    // call server to revoke refresh tokens then clear local storage
    return this.http
      .post(`${this.api}/logout`, {})
      .pipe(tap(() => this.clearTokens()));
  }

  refreshToken(): Observable<TokenResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return of(null as any);
    }
    return this.http
      .post<TokenResponse>(`${this.api}/refresh`, { refreshToken })
      .pipe(
        tap((res) => {
          if (res) this.saveTokens(res);
        })
      );
  }

  saveTokens(res: TokenResponse) {
    // store tokens and expiry (simple demo)
    localStorage.setItem('access_token', res.accessToken);
    localStorage.setItem('refresh_token', res.refreshToken);
    localStorage.setItem('access_token_expires', res.accessTokenExpiresAt);
    localStorage.setItem('refresh_token_expires', res.refreshTokenExpiresAt);
  }

  clearTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('access_token_expires');
    localStorage.removeItem('refresh_token_expires');
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }
}
