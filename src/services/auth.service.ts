import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Headers, Http, RequestOptions, RequestOptionsArgs, Response, URLSearchParams } from '@angular/http';

import { MResponse, User, AppError } from '../models';
import { RouterService } from './router.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class AuthService implements CanActivate {

    private readonly BASE_URL = 'http://localhost:3000/api/users';

    constructor(private http: Http, private router: RouterService) { }

    signin(username: string, password: string) {
        var headers = this.setHeaders('application/json', null);

        return this.http.post(`${this.BASE_URL}/login`, {
            username: username,
            password: password
        }, headers)
            .map(res => {
                var response = res.json() as MResponse<User>;
                localStorage.setItem('access-token', response.token);
            })
            .catch(res => this.errorHandler(res));
    }

    signup(username: string, password: string) {
        var headers = this.setHeaders('application/json', null);

        return this.http.post(`${this.BASE_URL}`, {
            username: username,
            password: password
        }, headers)
            .map(() => { })
            .catch(res => this.errorHandler(res));
    }

    updateUser(username: string, password: string, newUsername?: string, newPassword?: string) {

        var authToken = this.getAuthToken();

        if (!authToken)
            return this.errorHandler(null, 'Not authenticated', 403);

        var headers = this.setHeaders('application/json', authToken);

        var query: any = {
            username: username,
            password: password
        }

        if (newUsername) query.newUsername = newUsername;
        if (newPassword) query.newPassword = newPassword;

        return this.http.put(`${this.BASE_URL}`, query, headers)
            .map(res => (res.json() as MResponse<User[]>).message)
            .catch(res => this.errorHandler(res));
    }

    canActivate() {
        return this.isAuthenticated(true);
    }

    isAuthenticated(redirect = false){
        var result = !!this.getAuthToken();
        if(redirect && !result)
            this.router.goToPosts(true);

        return result;
    }

    private setHeaders(contentType?: string, authToken?: string) {
        var headers = new Headers();

        if (contentType) headers.append('Content-Type', contentType);
        if (authToken) headers.append('Authorization', authToken);

        return new RequestOptions({
            headers: headers
        });
    }

    private errorHandler(res?: Response, message?: string, type?: number) {

        var message = res ? (res.json() as MResponse<User>).message : message;

        var error: AppError = {
            message: message,
            type: type || res.status
        }

        return Observable.throw(error);
    }

    private getAuthToken() {
        return localStorage.getItem('access-token') || null;
    }
}