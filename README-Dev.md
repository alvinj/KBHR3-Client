# KBHR Client - Angular URL Shortener Dashboard

This Angular client application provides a web interface for the KBHR URL-shortening REST API service. It features JWT authentication and a clean dashboard for managing shortened URLs.


## Features Completed

### 1. Authentication System
- **AuthService** (`src/app/services/auth.ts`): Handles JWT token storage, login/logout, and authentication state management
- **Login Component** (`src/app/components/login/`): Bootstrap-styled login form with validation
- **Auth Guard** (`src/app/guards/auth-guard.ts`): Protects routes that require authentication

### 2. URL Management
- **UrlService** (`src/app/services/url.ts`): Handles all API calls to your REST endpoints (count, paginated URLs)
- **Dashboard Component** (`src/app/components/dashboard/`): Displays paginated URL list with search, copy functionality

### 3. Routing & Navigation
- Protected dashboard route requiring authentication
- Public login route
- Automatic redirect to login for unauthenticated users
- Clean route structure with wildcard handling

### 4. UI/UX with Bootstrap
- Responsive Bootstrap 5 styling throughout
- Professional login page with form validation
- Clean dashboard with table view of URLs
- Pagination controls
- Loading states and error handling
- Bootstrap Icons integration

## Key Features

- **JWT Authentication**: Stores tokens in localStorage and includes them in API headers
- **Form Validation**: Username (min 3 chars) and password (min 6 chars) validation
- **Pagination**: Full pagination support matching your API's response structure
- **Responsive Design**: Works on mobile and desktop
- **Error Handling**: User-friendly error messages for failed requests
- **Copy to Clipboard**: Easy copying of shortened URLs
- **Loading States**: Spinners during API calls

## To Run the Application

```bash
npm start
# or
ng serve
```

The app will be available at `http://localhost:4200` and will communicate with your REST API at `http://localhost:8080`.

## File Structure

```
src/app/
├── components/
│   ├── login/           # Login form component
│   └── dashboard/       # URL list dashboard
├── services/
│   ├── auth.ts          # JWT authentication
│   └── url.ts           # API communication
├── guards/
│   └── auth-guard.ts    # Route protection
└── app.routes.ts        # Route configuration
```


## API Integration

The application integrates with the following REST API endpoints:

### Authentication
- `POST /api/auth/login` - Login with username/password to receive JWT token

### URL Management
- `GET /api/urls/count` - Get total count of URLs for authenticated user
- `GET /api/urls?page=0&size=10` - Get paginated list of URLs

### Example API Response Format
```json
{
  "urls": [
    {
      "id": 3,
      "userId": 1,
      "longUrl": "https://github.com",
      "shortUri": "gh",
      "notes": "GitHub - Code repository",
      "created": "2025-08-29T17:43:14"
    }
  ],
  "currentPage": 0,
  "totalItems": 24,
  "totalPages": 5,
  "pageSize": 5,
  "isFirst": true,
  "isLast": false,
  "hasNext": true,
  "hasPrevious": false
}
```

## Development Notes

The application is now ready to use with your existing KBHR REST API! Users can log in with their credentials and view their paginated URL collection in a clean, professional interface.

### Technologies Used
- Angular 18
- Bootstrap 5
- TypeScript
- RxJS for reactive programming
- Angular Reactive Forms for form handling


## QUESTION: How do I start looking at an Angular app like this? That is, what file should I start looking at first?

When exploring an Angular application like this one, here's the logical sequence to follow:

Start Here:

1. src/app/app.routes.ts - The Navigation Map

This shows you all the available routes and how the app is structured. You'll see:

- Which components handle which URLs
- Protected vs public routes
- Default redirects

2. src/app/app.config.ts - The Application Bootstrap

This configures how Angular starts up and what services are available globally.

3. src/app/app.html - The Main Layout

Very simple in this app; just contains <router-outlet /> which is where different page components get rendered.

Then Explore the Features:

4. Authentication Flow:

- src/app/services/auth.ts - How login/logout works
- src/app/guards/auth-guard.ts - How routes are protected
- src/app/components/login/login.ts - The login page logic

5. Main Application:

- src/app/components/dashboard/dashboard.ts - The main URL list page
- src/app/services/url.ts - How API calls are made

Understanding the Structure:

Each component typically has 3 files:

- .ts - The TypeScript logic
- .html - The template (UI)
- .css - Component-specific styles

Quick Overview Path:

1. app.routes.ts ← See the app structure
2. components/login/login.ts ← Understand authentication
3. components/dashboard/dashboard.ts ← See the main functionality
4. services/auth.ts & services/url.ts ← Understand data flow

This gives you a complete picture of how the app works from routing → authentication → main features → data handling.


## Angular Template Syntax Explained

When looking at the HTML templates (like `login.html`), you'll see special Angular syntax:

### **Property Binding: `[property]="expression"`**

```html
[class.is-invalid]="username?.invalid && username?.touched"
```

- **What it does**: Conditionally adds the CSS class `is-invalid` to the element
- **When**: Only when the username field is both invalid AND has been touched by the user
- **Purpose**: Shows Bootstrap's red error styling only after the user has interacted with the field

### **Structural Directives: `*ngIf`**

```html
<div class="invalid-feedback" *ngIf="username?.invalid && username?.touched">
```

- **What it does**: Conditionally shows/hides the entire element from the DOM
- **When**: Only displays the error message div when the condition is true
- **Purpose**: Prevents empty error message containers from taking up space

### **Safe Navigation: `?.`**

```html
username?.invalid
username?.errors?.['required']
```

- **What it does**: Safely accesses properties that might be null/undefined
- **Why needed**: Prevents JavaScript errors if `username` or `errors` don't exist yet
- **Alternative**: Without `?.`, you'd get runtime errors during component initialization

### **Form Control Access:**

```html
formControlName="username"
```

- **What it does**: Links the input field to the reactive form control defined in the TypeScript
- **Connection**: Maps to `this.loginForm.get('username')` in the component

### **Event Binding: `(event)="method()"`**

```html
(ngSubmit)="onSubmit()"
```

- **What it does**: Calls the component's `onSubmit()` method when the form is submitted
- **Purpose**: Handles form submission and validation

### **Interpolation: `{{ }}`**

```html
{{ isLoading ? 'Signing in...' : 'Sign In' }}
```

- **What it does**: Displays dynamic text based on component properties
- **Purpose**: Shows different button text based on loading state

This reactive approach means the UI automatically updates whenever the underlying data changes!
