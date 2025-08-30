import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Create reactive form with validation rules
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Getter methods for easy access to form controls in template
  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }

  // Handle form submission
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const credentials = {
        username: this.loginForm.value.username,
        password: this.loginForm.value.password
      };

      // Call auth service to login
      this.authService.login(credentials).subscribe({
        next: (success: boolean) => {
          this.isLoading = false;
          if (success) {
            // Navigate to dashboard on successful login
            this.router.navigate(['/dashboard']);
          } else {
            this.errorMessage = 'Invalid credentials';
          }
        },
        error: (error: any) => {
          this.isLoading = false;
          this.errorMessage = 'Login failed. Please try again.';
          console.error('Login error:', error);
        }
      });
    }
  }
}
