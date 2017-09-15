import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { ToastrService } from 'ngx-toastr';

import { PostService, RouterService, StoreService } from '../services';
import { Post, AppError } from '../models';
import { FadeInAnimation } from '../animations';

@Component({
    selector: 'create',
    templateUrl: 'views/create-post.component.html',
    styleUrls: ['styles/create-post.component.css'],
    animations: [FadeInAnimation]
})
export class CreatePostComponent implements OnInit, OnDestroy {

    private preview: boolean = false;
    private isLoading: boolean = false;
    private isUpdate: boolean = false;
    private tags: string;
    private post: Post;
    private originalPost: Post;
    private file: File;
    private sub: Subscription;

    @ViewChild('fpicker') fpicker: ElementRef;

    constructor(private postService: PostService,
        private toast: ToastrService,
        private router: RouterService,
        private activatedRoute: ActivatedRoute,
        private store: StoreService) {
        this.post = new Post();
    }

    ngOnInit() {
        this.sub = this.activatedRoute.queryParams
            .subscribe(params => {
                var id = params['p'];

                if(id){
                    this.isUpdate = true;

                    this.originalPost = this.store.getUpdatePost();

                    if(!this.originalPost) this.loadPost(id);
                }
            });
    }

    toggleReview() {
        this.preview = !this.preview;
    }

    onsubmit() {
        if(this.isUpdate)
            this.updatePost();
        else
            this.createPost();
    }

    onfilechange() {
        this.file = this.fpicker.nativeElement.files[0];

        if (!this.file || (!this.file.name.endsWith('.png') && !this.file.name.endsWith('.jpg') && !this.file.name.endsWith('.jpeg')))
            this.fpicker.nativeElement.invalid = true;
        else this.fpicker.nativeElement.invalid = false;
    }

    getFormData() {
        var formData = new FormData();

        formData.append('title', this.post.title);
        formData.append('body', this.post.body);
        formData.append('tags', this.tags);
        formData.append('thumbnail', this.file);

        return formData;
    }

    private createPost() {
        this.isLoading = true;
        this.postService.createPost(this.getFormData())
            .finally(() => this.isLoading = false)
            .toPromise()
            .then(() => {
                this.toast.success('Post created successfully');
                this.router.goToPosts(true);
            })
            .catch((err: AppError) => this.handleError(err));
    }

    private updatePost() {
        this.isLoading = true;
        this.postService.updatePost(this.getUpdateObject(), true)
        .finally(() => this.isLoading = false)
        .toPromise()
        .then(() => {
            this.toast.success('Post updated successfully');
            this.router.goToPost(this.originalPost._id);
        })
        .catch((err: AppError) => this.handleError(err));
    }

    private loadPost(id: string) {
        this.isLoading = true;
        this.postService.loadPost(id)
            .finally(() => this.isLoading = false)
            .toPromise()
            .then(post => {
                this.originalPost = post;

                this.setPost(post);

                console.log(this.post._id);
            })
            .catch(err => this.toast.error(err));
    }

    private getUpdateObject(){
        var post = new Post();

        post._id = this.originalPost._id;
        if(this.originalPost.title !== this.post.title) post.title = this.post.title;
        if(this.originalPost.body !== this.post.body) post.body = this.post.body;
        if(this.originalPost.tags.join(' ') !== this.tags) post.tags = this.tags.split(' ');

        return post;
    }

    private setPost(post: Post){
        this.post.title = post.title;
        this.post.body = post.body;
        this.post.tags = post.tags;
        this.tags = post.tags.join(' ');
    }

    private handleError(err: AppError){
        this.toast.error(err.message);
        if(err.type === 403){
            localStorage.clear();
            this.router.goToPosts(true);            
        }
    }
    
    ngOnDestroy(){
        this.sub.unsubscribe();
        this.store.clear();
    }
}