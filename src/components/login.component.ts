import { ToastrService } from 'ngx-toastr';
import { User, AppError } from '../models';
import { Component } from '@angular/core';
import {FadeInAnimation} from '../animations';
import {AuthService, RouterService} from '../services';

import 'rxjs/add/operator/finally';

@Component({
    selector: 'login',
    templateUrl: 'views/login.component.html',
    styleUrls: ['styles/login.component.css'],
    animations: [FadeInAnimation]
})
export class LoginComponent {

    private user: User;
    private isLoading: boolean = false;

    constructor(private router: RouterService, private auth: AuthService, private toast: ToastrService) {
        this.user = new User();
    }

    onsubmit(){
        this.isLoading = true;

        this.auth.signin(this.user.username, this.user.password)
        .finally(() => this.isLoading = false)
        .toPromise()
        .then(() => {
            this.toast.success('Welcome back Omar');
            this.router.goToPosts(true);
        })
        .catch((err: AppError) => this.toast.error(err.message));
    }
}