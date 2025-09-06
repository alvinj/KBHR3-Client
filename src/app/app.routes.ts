import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { DashboardComponent } from './components/dashboard/dashboard';
import { UrlFormComponent } from './components/url-form/url-form';
import { LearningFormComponent } from './components/learning-form/learning-form';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  // Default route redirects to dashboard
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  
  // Login route (public)
  { path: 'login', component: LoginComponent },
  
  // Dashboard route (protected by auth guard)
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  
  // Create new URL route (protected)
  { path: 'urls/new', component: UrlFormComponent, canActivate: [authGuard] },
  
  // Edit existing URL route (protected)
  { path: 'urls/edit/:id', component: UrlFormComponent, canActivate: [authGuard] },
  
  // Learning form route (public - for learning purposes)
  { path: 'learning-form', component: LearningFormComponent },
  
  // Wildcard route for 404 (redirects to login)
  { path: '**', redirectTo: '/login' }
];
