import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { DashboardComponent } from './components/dashboard/dashboard';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  // Default route redirects to dashboard
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  
  // Login route (public)
  { path: 'login', component: LoginComponent },
  
  // Dashboard route (protected by auth guard)
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  
  // Wildcard route for 404 (redirects to login)
  { path: '**', redirectTo: '/login' }
];
