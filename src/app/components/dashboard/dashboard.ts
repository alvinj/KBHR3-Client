import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { UrlService, UrlItem, UrlPageResponse } from '../../services/url';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  urls: UrlItem[] = [];
  currentPage = 0;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;
  isLoading = false;
  errorMessage = '';
  
  // Pagination helper properties
  isFirst = true;
  isLast = false;
  hasNext = false;
  hasPrevious = false;

  constructor(
    private urlService: UrlService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Load URLs when component initializes
    this.loadUrls();
  }

  // Load URLs for current page
  loadUrls(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.urlService.getUrls(this.currentPage, this.pageSize).subscribe({
      next: (response: UrlPageResponse) => {
        this.urls = response.urls;
        this.currentPage = response.currentPage;
        this.totalItems = response.totalItems;
        this.totalPages = response.totalPages;
        this.isFirst = response.isFirst;
        this.isLast = response.isLast;
        this.hasNext = response.hasNext;
        this.hasPrevious = response.hasPrevious;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Failed to load URLs. Please try again.';
        this.isLoading = false;
        console.error('Load URLs error:', error);
      }
    });
  }

  // Navigate to specific page
  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadUrls();
    }
  }

  // Go to next page
  nextPage(): void {
    if (this.hasNext) {
      this.goToPage(this.currentPage + 1);
    }
  }

  // Go to previous page
  previousPage(): void {
    if (this.hasPrevious) {
      this.goToPage(this.currentPage - 1);
    }
  }

  // Logout user and redirect to login
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Format date for display
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  // Generate array of page numbers for pagination
  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  // Track by function for ngFor performance optimization
  trackByUrlId(index: number, url: UrlItem): number {
    return url.id;
  }

  // Track by function for pagination
  trackByIndex(index: number): number {
    return index;
  }

  // Copy short URI to clipboard
  copyToClipboard(shortUri: string): void {
    const fullUrl = `http://localhost:8080/${shortUri}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      // Could add a toast notification here
      console.log('Copied to clipboard:', fullUrl);
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  }

  // Navigate to create new URL page
  createNewUrl(): void {
    this.router.navigate(['/urls/new']);
  }

  // Navigate to edit URL page
  editUrl(id: number): void {
    this.router.navigate(['/urls/edit', id]);
  }

  // Delete a URL with confirmation
  deleteUrl(url: UrlItem): void {
    if (confirm(`Are you sure you want to delete the URL "${url.shortUri}"? This action cannot be undone.`)) {
      this.urlService.deleteUrl(url.id).subscribe({
        next: () => {
          // Remove the URL from the local array
          this.urls = this.urls.filter(u => u.id !== url.id);
          this.totalItems--;
          
          // If current page is empty and not the first page, go to previous page
          if (this.urls.length === 0 && this.currentPage > 0) {
            this.goToPage(this.currentPage - 1);
          } else if (this.urls.length === 0) {
            // If first page is empty, reload to show empty state
            this.loadUrls();
          }
          
          console.log('URL deleted successfully');
        },
        error: (error: any) => {
          this.errorMessage = 'Failed to delete URL. Please try again.';
          console.error('Delete URL error:', error);
        }
      });
    }
  }

  // Math property for template access
  Math = Math;
}
