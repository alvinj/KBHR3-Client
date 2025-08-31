import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UrlService, CreateUrlRequest, UpdateUrlRequest, UrlItem } from '../../services/url';

@Component({
  selector: 'app-url-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './url-form.html',
  styleUrl: './url-form.css'
})
export class UrlFormComponent implements OnInit {
  urlForm: FormGroup;
  isLoading = false;
  isEditMode = false;
  urlId: number | null = null;
  errorMessage = '';
  successMessage = '';
  isSubmitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private urlService: UrlService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Create reactive form with validation rules
    this.urlForm = this.formBuilder.group({
      shortUri: ['', [Validators.required, Validators.maxLength(20)]],
      longUrl: ['', [Validators.required, Validators.maxLength(255), Validators.pattern(/^https?:\/\/.+/)]],
      notes: ['', [Validators.maxLength(255)]]
    });
  }


  ngOnInit(): void {
    // Check if we're in edit mode by looking for an ID in the route
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.urlId = parseInt(params['id']);
        this.loadUrl();
        // In edit mode, shortUri cannot be changed
        this.urlForm.get('shortUri')?.disable();
      }
    });
  }

  // Load URL data for editing
  loadUrl(): void {
    if (!this.urlId) return;
    
    this.isLoading = true;
    this.urlService.getUrlById(this.urlId).subscribe({
      next: (url: UrlItem) => {
        this.urlForm.patchValue({
          shortUri: url.shortUri,
          longUrl: url.longUrl,
          notes: url.notes || ''
        });
        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load URL. Please try again.';
        console.error('Load URL error:', error);
      }
    });
  }

  // Getter methods for easy access to form controls in template
  get shortUri() { return this.urlForm.get('shortUri'); }
  get longUrl() { return this.urlForm.get('longUrl'); }
  get notes() { return this.urlForm.get('notes'); }

  // Handle form submission
  onSubmit(): void {
    if (this.urlForm.valid && !this.isSubmitted) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      if (this.isEditMode) {
        this.updateUrl();
      } else {
        this.createUrl();
      }
    }
  }

  // Create new URL
  private createUrl(): void {
    const createData: CreateUrlRequest = {
      shortUri: this.urlForm.value.shortUri,
      longUrl: this.urlForm.value.longUrl,
      notes: this.urlForm.value.notes || undefined
    };

    this.urlService.createUrl(createData).subscribe({
      next: (url: UrlItem) => {
        this.isSubmitted = true;
        this.urlForm.disable(); // Disable entire form
        this.successMessage = `URL created successfully! Short URL: ${url.shortUri}`;
        this.isLoading = false;
        // Redirect to dashboard after a delay
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 2000);
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('Create URL error:', error);
        
        // Handle specific error cases
        if (error.status === 400) {
          this.errorMessage = 'Short URI already exists or invalid input. Please try a different short URI.';
        } else {
          this.errorMessage = 'Failed to create URL. Please try again.';
        }
      }
    });
  }

  // Update existing URL
  private updateUrl(): void {
    if (!this.urlId) return;

    const updateData: UpdateUrlRequest = {
      longUrl: this.urlForm.value.longUrl,
      notes: this.urlForm.value.notes || undefined
    };

    this.urlService.updateUrl(this.urlId, updateData).subscribe({
      next: (url: UrlItem) => {
        this.isSubmitted = true;
        this.urlForm.disable(); // Disable entire form
        this.successMessage = 'URL updated successfully!';
        this.isLoading = false;
        // Redirect to dashboard after a delay
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 2000);
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to update URL. Please try again.';
        console.error('Update URL error:', error);
      }
    });
  }

  // Cancel and go back to dashboard
  onCancel(): void {
    this.router.navigate(['/dashboard']);
  }
}
