import { Component, Input } from '@angular/core';

@Component({
    selector: 'loading',
    templateUrl: 'views/loading.component.html',
    styleUrls: ['styles/loading.component.css'],
})
export class LoadingComponent {

    @Input() isLoading: boolean;
}