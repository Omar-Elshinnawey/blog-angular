import { MResponse, Post, AppError } from '../models';
import { Headers, Http, RequestOptions, RequestOptionsArgs, Response, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class PostService {

    private readonly BASE_URL = 'http://localhost:3000/api/posts';

    constructor(private http: Http) { }

    loadPosts(last?: string) {

        var optns: RequestOptionsArgs = {};
        if (last)
            optns.params = this.setURLQuery([{ key: 'last', value: last }]);

        return this.http.get(`${this.BASE_URL}`, optns)
            .map(this.extractPosts)
            .catch(res => this.errorHandler(res));
    }

    loadPost(id: string) {
        return this.http.get(`${this.BASE_URL}/${id}`)
            .map(this.extractPost)
            .catch(res => this.errorHandler(res));
    }

    loadSimilar(tags: string): Observable<Post[]> {
        var optns: RequestOptionsArgs = {};
        optns.params = this.setURLQuery([{ key: 'tags', value: tags }]);

        return this.http.get(`${this.BASE_URL}/post/similar`, optns)
            .map(this.extractPosts)
            .catch(res => this.errorHandler(res));
    }

    search(query: string, last?: string) {
        var optns: RequestOptionsArgs = {};
        var queryString = [{ key: 'query', value: query }];

        if (last)
            queryString.push({ key: 'last', value: last });

        optns.params = this.setURLQuery(queryString);

        return this.http.get(`${this.BASE_URL}/post/search`, optns)
            .map(this.extractPosts)
            .catch(res => this.errorHandler(res));
    }

    createPost(post: FormData) {
        var authToken = this.getAuthToken();

        if (!authToken)
            return this.errorHandler(null, 'Not authenticated', 403);

        var headers = this.setHeaders(null, authToken);
    
        return this.http.post(`${this.BASE_URL}`, post, headers)
        .map(res => (res.json() as MResponse<Post[]>).message)
        .catch(res => this.errorHandler(res));
    }

    deletePost(id: string, thumbnail_id: string) {
        var authToken = this.getAuthToken();

        if (!authToken)
            return this.errorHandler(null, 'Not authenticated', 403);

        var headers = this.setHeaders(null, authToken);        

        return this.http.delete(`${this.BASE_URL}/${id}/${thumbnail_id}`, headers)
            .map(res => (res.json() as MResponse<Post[]>).message)
            .catch(res => this.errorHandler(res));
    }

    updatePost(post: Post, overrideTags = false) : Observable<Post> {
        var authToken = this.getAuthToken();

        if (!authToken)
            return this.errorHandler(null, 'Not authenticated', 403);

        var headers = this.setHeaders('application/json', authToken);

        var updateobj: any = {
            overrideTags: overrideTags
        };

        updateobj.id = post._id;
        if(post.title) updateobj.title = post.title;
        if(post.body) updateobj.body = post.body;        

        return this.http.put(`${this.BASE_URL}`, updateobj, headers)
            .map(res => (res.json() as MResponse<Post[]>).message)
            .catch(res => this.errorHandler(res));
    }

    private errorHandler(res?: Response, message?: string, type?: number) {

        var message = res? (res.json() as MResponse<Post>).message: message;

        var error: AppError = {
            message: message,
            type: type || res.status
        }

        return Observable.throw(error);
    }

    private extractPosts(res: Response) {
        return (res.json() as MResponse<Post[]>).result;
    }

    private extractPost(res: Response) {
        return (res.json() as MResponse<Post>).result;
    }

    private setHeaders(contentType?: string, authToken?: string) {
        var headers = new Headers();
        
        if(contentType) headers.append('Content-Type', contentType);
        if(authToken) headers.append('Authorization', authToken);

        return new RequestOptions({
            headers: headers
        });
    }

    private setURLQuery(queries: {key: string, value: string}[]) {
        var params = new URLSearchParams();

        queries.forEach(query => params.append(query.key, query.value));

        return params.toString();
    }

    private getAuthToken() {
        return localStorage.getItem('access-token') || null;
    }
}