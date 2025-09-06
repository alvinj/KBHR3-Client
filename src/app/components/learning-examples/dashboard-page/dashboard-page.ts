import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../page-header/page-header';
import { UserCardComponent } from '../user-card/user-card';
import { LearningFormComponent } from '../learning-form/learning-form';

/**
 * This component demonstrates how to combine multiple components into one page.
 * It shows parent-child communication using @Input() and @Output().
 */
@Component({
    selector: 'app-dashboard-page',
    imports: [
        CommonModule,           // For @if, @for, and other directives
        PageHeaderComponent,    // Our custom header component
        UserCardComponent,      // Our custom user card component  
        LearningFormComponent   // Our learning form from earlier
    ],
    templateUrl: './dashboard-page.html',
    styleUrl:    './dashboard-page.css'
})
export class DashboardPageComponent {
    // Data that will be passed to child components
    pageTitle = 'Component Composition Demo';
    pageSubtitle = 'Learn how multiple Angular components work together';

    // Array of users - each will create a separate UserCardComponent
    users = [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
        { id: 4, name: 'Alice Brown', email: 'alice@example.com' }
    ];

    // Methods that handle events from child components
    
    // Called when a UserCardComponent emits viewProfile event
    handleViewProfile(userName: string) {
        alert(`Viewing profile for: ${userName}`);
        console.log('View profile clicked for:', userName);
    }

    // Called when a UserCardComponent emits deleteUser event  
    handleDeleteUser(userId: number) {
        const user = this.users.find(u => u.id === userId);
        if (user && confirm(`Delete ${user.name}?`)) {
            // Remove user from array - this will automatically update the UI
            this.users = this.users.filter(u => u.id !== userId);
            console.log(`Deleted user ${userId}`);
        }
    }
}