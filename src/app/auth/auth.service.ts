import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface User {
  id: string;
  nom: string;
  email: string;
  role: string;
  enabled?: boolean;
}

export interface AuthResponse {
  token: string;
  utilisateur: User;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  login(credentials: { email: string; motDePasse: string }): Observable<HttpResponse<AuthResponse>> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, credentials, { observe: 'response' }).pipe(
      tap((response: HttpResponse<AuthResponse>) => {
        if (isPlatformBrowser(this.platformId)) {
          if (response.body && response.body.token && response.body.utilisateur) {
            localStorage.setItem('token', response.body.token);
            localStorage.setItem('role', response.body.utilisateur.role.replace('ROLE_', ''));
            localStorage.setItem('userId', response.body.utilisateur.id.toString());
          } else {
            throw new Error('Réponse d\'authentification invalide');
          }
        }
      })
    );
  }

  register(user: { nom: string; email: string; motDePasse: string }): Observable<HttpResponse<AuthResponse>> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, user, { observe: 'response' });
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('userId');
    }
  }

  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  getRole(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('role');
    }
    return null;
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  getUserId(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('userId');
    }
    return null;
  }
}