import { ToastrService } from 'ngx-toastr';
import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';

import { Post, AppError } from '../models';
import { PostService, RouterService, StoreService, AuthService } from '../services';
import { FadeInAnimation } from '../animations';

@Component({
    selector: 'posts',
    templateUrl: 'views/posts.component.html',
    styleUrls: ['styles/posts.component.css'],
    animations: [FadeInAnimation]
})
export class PostsComponent implements OnInit, OnDestroy {

    private posts: Post[];
    private searchQuery: string;
    private noMore = true;
    private isLoading = false;
    private scrollPosition: number = 0;

    constructor(private postService: PostService,
        private router: RouterService,
        private store: StoreService,
        private toast: ToastrService,
        private auth: AuthService) {
        this.posts = new Array();
    }

    ngOnInit() {
        if(!this.restoreContext())
            this.loadPosts();
    }

    onsubmit() {
        if (!this.searchQuery)
            this.loadPosts();
        else
            this.search();
    }

    loadPosts(last?: string) {
        this.searchQuery = '';
        this.isLoading = true;
        return this.postService.loadPosts(last)
            .finally(() => this.isLoading = false)
            .toPromise()
            .then(posts => {
                if (posts.length === 0 || posts.length < 10)
                    this.noMore = true;
                else 
                    this.noMore = false;

                this.posts = last ? this.posts.concat(posts) : posts;
            })
            .catch((err: AppError) => this.toast.error(err.message));
    }

    search(last?: string) {
        this.isLoading = true;
        return this.postService.search(this.searchQuery, last)
            .finally(() => this.isLoading = false)
            .toPromise()
            .then(posts => {
                if (posts.length === 0 || posts.length < 10)
                    this.noMore = true;
                else 
                    this.noMore = false;

                this.posts = last ? this.posts.concat(posts) : posts;
            })
            .catch((err: AppError) => this.toast.error(err.message));
    }

    getLast() {
        if (!this.posts || this.posts.length === 0)
            return null;

        var last = this.posts[0]._id;

        this.posts.forEach((post) => {
            last = post._id < last ? post._id : last;
        });

        return last;
    }

    loadMore() {
        var last = this.getLast();

        if (this.searchQuery)
            this.search(last);
        else
            this.loadPosts(last);
    }

    saveContext(){
        this.store.setPosts(this.posts);
        this.store.setSearchQuery(this.searchQuery);
    }

    restoreContext(){
        this.posts = this.store.getPosts();
        this.searchQuery = this.store.getSearchQuery();

        return !!this.posts && this.posts.length > 0;
    }

    goToPost(id: string) {
        this.saveContext();
        this.router.goToPost(id);
    }

    scrollup(){
        var speed = 20;
        var currentPosition = this.scrollPosition;
        
        var scrollTimer = setInterval(() => {
            currentPosition -= speed;
            window.scrollTo(0, currentPosition >= 0? currentPosition: 0);

            if(currentPosition <= 0) clearInterval(scrollTimer);
        }, 1);
    }

    @HostListener('window:scroll')
    setScrollPosition(){
        this.scrollPosition = window.pageYOffset;
    }

    ngOnDestroy() { }
}