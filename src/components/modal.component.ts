import { RouterService, IModalOptions, StoreService } from '../services';
import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'modal',
    templateUrl: 'views/modal.component.html',
    styleUrls: ['styles/modal.component.css']
})

export class ModalComponent implements OnInit {
    private options: IModalOptions = {
        title: 'Are you sure?',
        message: 'Are you sure?',
        closeBtn: 'No',
        confirmBtn: 'Yes'
    }

    constructor(private router: RouterService, private store: StoreService) { }

    ngOnInit() { 
        this.options = this.store.getModalOptions();
        if(!this.options) this.router.closePopup(false);
    }

    close(){
        this.router.closePopup(false);
    }

    confirm(){
        this.router.closePopup(true);
    }
}