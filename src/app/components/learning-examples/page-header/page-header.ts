import { Component, Input } from '@angular/core';

@Component({
    selector:    'app-page-header',
    imports:     [],
    templateUrl: './page-header.html',
    styleUrl:    './page-header.css'
})
export class PageHeaderComponent {

    // @Input() allows parent components to pass data to this component
    // These properties can be set from the parent template using [property]="value"
    @Input() title = 'Default Title';
    @Input() subtitle = 'Default subtitle';

}
