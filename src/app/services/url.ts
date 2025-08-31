import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

// Interface for individual URL items from the API
export interface UrlItem {
  id: number;
  userId: number;
  longUrl: string;
  shortUri: string;
  notes: string;
  created: string;
}

// Interface for creating/updating URLs (without readonly fields)
export interface CreateUrlRequest {
  longUrl: string;
  shortUri: string;
  notes?: string;
}

// Interface for updating URLs (only editable fields)
export interface UpdateUrlRequest {
  longUrl: string;
  notes?: string;
}

// Interface for paginated URL response from the API
export interface UrlPageResponse {
  urls: UrlItem[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
  pageSize: number;
  isFirst: boolean;
  isLast: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UrlService {
  private readonly API_BASE = 'http://localhost:8080/api';

  constructor(
    private http: HttpClient, 
    private authService: AuthService
  ) {}

  // Create HTTP headers with JWT authorization token
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Get total count of URLs for the authenticated user
  getUrlCount(): Observable<number> {
    return this.http.get<number>(`${this.API_BASE}/urls/count`, {
      headers: this.getAuthHeaders()
    });
  }

  // Get paginated list of URLs with optional page and size parameters
  getUrls(page: number = 0, size: number = 10): Observable<UrlPageResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<UrlPageResponse>(`${this.API_BASE}/urls`, {
      headers: this.getAuthHeaders(),
      params: params
    });
  }

  // Get URLs for a specific page (convenience method)
  getUrlsForPage(page: number, size: number = 10): Observable<UrlPageResponse> {
    return this.getUrls(page, size);
  }

  // Get a specific URL by ID
  getUrlById(id: number): Observable<UrlItem> {
    return this.http.get<UrlItem>(`${this.API_BASE}/urls/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Create a new URL
  createUrl(urlData: CreateUrlRequest): Observable<UrlItem> {
    return this.http.post<UrlItem>(`${this.API_BASE}/urls`, urlData, {
      headers: this.getAuthHeaders()
    });
  }

  // Update an existing URL by ID
  updateUrl(id: number, urlData: UpdateUrlRequest): Observable<UrlItem> {
    return this.http.put<UrlItem>(`${this.API_BASE}/urls/${id}`, urlData, {
      headers: this.getAuthHeaders()
    });
  }

  // Delete a URL by ID
  deleteUrl(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_BASE}/urls/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
