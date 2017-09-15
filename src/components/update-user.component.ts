import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { RouterService, AuthService } from '../services';
import {User, AppError} from '../models';
import {FadeInAnimation} from '../animations';

@Component({
    selector: 'updateUser',
    templateUrl: 'views/update-user.component.html',
    styleUrls: ['styles/login.component.css'],
    animations: [FadeInAnimation]
})

export class UpdateUserComponent implements OnInit {
    private current: User;
    private updated: User;
    private isLoading: boolean = false;

    constructor(private router: RouterService, private auth: AuthService, private toast: ToastrService) {
        this.current = new User();
        this.updated = new User();
    }

    ngOnInit() { }

    onsubmit(){
        this.updateUser();
    }

    updateUser(){
        this.isLoading = true;
        this.auth.updateUser(this.current.username, this.current.password, this.updated.username, this.updated.password)
            .finally(() => {
                this.isLoading = false
                this.current = new User();
                this.updated = new User();
            })
            .toPromise()
            .then(res => this.toast.success('User updated successfully'))
            .catch((err: AppError) => this.handleError(err));
    }

    private handleError(err: AppError){
        this.toast.error(err.message);
        if(err.type === 403){
            localStorage.clear();
            this.router.goToPosts(true);            
        }
    }
}