import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { ToastrService } from 'ngx-toastr';

import { Post, AppError } from '../models';
import { StoreService, RouterService, PostService, IModalOptions, AuthService } from '../services';

@Component({
    selector: 'post',
    templateUrl: 'views/post.component.html',
    styleUrls: ['styles/post.component.css']
})
export class PostComponent implements OnInit, OnDestroy {

    private post: Post;
    private sub: Subscription;
    private modal: Subscription;
    private isLoading = false;
    private posts: Post[];

    constructor(private store: StoreService,
        private activatedRoute: ActivatedRoute,
        private router: RouterService,
        private postService: PostService,
        private toast: ToastrService,
        private auth: AuthService) { }

    ngOnInit() {
        this.sub = this.activatedRoute.params.subscribe(params => {
            this.loadPost(params['id']);
            this.scrollTop();
        });

        this.modal = this.router.getModal().subscribe((result: boolean) => {
            if (result)
                this.deletePost();
        });
    }

    loadPost(id: string) {
        this.isLoading = true;
        this.postService.loadPost(id)
            .toPromise()
            .then(post => {
                if (!post) return this.router.goToPosts();

                this.post = post;

                this.loadSimilar();
            })
            .catch((err: AppError) => this.handleError(err));
    }

    loadSimilar() {
        this.postService.loadSimilar(this.post.tags.join(' '))
            .finally(() => this.isLoading = false)
            .toPromise()
            .then(posts => this.posts = posts.filter(post => post._id !== this.post._id))
            .catch((err: AppError) => this.handleError(err));
    }

    scrollTop() {
        var speed = 20;
        var scrollPosition = window.pageYOffset;

        var scrollTimer = setInterval(() => {
            scrollPosition -= speed;
            speed += 5;
            window.scrollTo(0, scrollPosition);

            if (scrollPosition <= 0) clearInterval(scrollTimer);
        }, 1);
    }

    openDialog() {

        var modalOptions: IModalOptions = {
            title: `Are you sure you want to delete ${this.post.title}?`,
            message: 'This action cannot be undone.',
            closeBtn: 'No',
            confirmBtn: 'Yes, Delete'
        }

        this.router.openPopup(modalOptions);
    }

    deletePost() {
        this.postService.deletePost(this.post._id, this.getThumbnailId())
            .toPromise()
            .then(res => {
                this.toast.success('Post deleted.');
                this.router.goToPosts(true);
            })
            .catch((err: AppError) => this.handleError(err));
    }

    private getThumbnailId() {
        var thumbnail = this.post.thumbnail;
        return thumbnail.substring(thumbnail.lastIndexOf('/') + 1, thumbnail.lastIndexOf('.'));
    }

    private handleError(err: AppError){
        this.toast.error(err.message);
        if(err.type === 403){
            localStorage.clear();
            this.router.goToPosts(true);            
        }
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
        this.modal.unsubscribe();
    }
}