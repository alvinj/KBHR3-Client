import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector:    'app-user-card',
    imports:     [],
    templateUrl: './user-card.html',
    styleUrl:    './user-card.css'
})
export class UserCardComponent {

    // `@Input()` - Parent passes data TO this component.
    //              (Receive data FROM the parent).
    @Input() user = { id: 0, name: '', email: '' };

    // `@Output()` - This component sends events TO parent.
    // EventEmitter allows us to emit custom events that parent can listen to.
    @Output() viewProfile = new EventEmitter<string>();
    @Output() deleteUser  = new EventEmitter<number>();

    // When user clicks "View Profile", emit the user's name to parent
    onViewProfile() {
        this.viewProfile.emit(this.user.name);
    }

    // When user clicks "Delete", emit the user's ID to parent
    onDeleteUser() {
        this.deleteUser.emit(this.user.id);
    }

}
