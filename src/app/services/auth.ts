import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

// Interface for login credentials
interface LoginCredentials {
  username: string;
  password: string;
}

// Interface for JWT token response
interface TokenResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_BASE = 'http://localhost:8080/api';
  private readonly TOKEN_KEY = 'jwt_token';
  
  // BehaviorSubject to track authentication state across the app
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Login method - sends credentials to server and stores JWT token
  login(credentials: LoginCredentials): Observable<boolean> {
    return this.http.post<TokenResponse>(`${this.API_BASE}/auth/login`, credentials)
      .pipe(
        map(response => {
          if (response.token) {
            // Store token in localStorage for persistence
            localStorage.setItem(this.TOKEN_KEY, response.token);
            this.isAuthenticatedSubject.next(true);
            return true;
          }
          return false;
        })
      );
  }

  // Logout method - removes token and updates auth state
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.isAuthenticatedSubject.next(false);
  }

  // Get stored JWT token
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Check if user has a valid token stored
  private hasToken(): boolean {
    return !!this.getToken();
  }

  // Check if user is currently authenticated
  isAuthenticated(): boolean {
    return this.hasToken();
  }
}
