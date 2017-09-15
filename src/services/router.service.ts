import { StoreService, IModalOptions } from './store.service';
import { Router } from '@angular/router';
import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class RouterService {

    private modal: EventEmitter<boolean>;

    constructor(private router: Router, private store: StoreService){
        this.modal = new EventEmitter<boolean>();
    }

    goToPosts(clearContext = false){
        if(clearContext)
            this.store.clear();

        this.router.navigate(['']);
    }

    goToPost(id: string){
        this.router.navigate(['/post', id]);
    }

    goToCreatePost(){
        this.router.navigate(['/new']);
    }

    goToLogin(){
        this.router.navigate(['/login']);
    }

    openPopup(options: IModalOptions){
        this.store.setModalOptions(options);
        this.router.navigate([{outlets: {popup: ['popup']}}], {skipLocationChange: true});
    }

    closePopup(result: boolean){
        this.modal.emit(result);
        this.store.clearModalOptions();  
        this.router.navigate([{outlets: {popup: null}}], {skipLocationChange: true});
    }

    getModal(){
        return this.modal;
    }
}