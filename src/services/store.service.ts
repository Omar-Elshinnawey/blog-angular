import { Post } from '../models';
import { Injectable } from '@angular/core';

@Injectable()
export class StoreService {

    private posts: Post[];
    private searchQuery: string;
    private updatePost: Post;
    private modalOptions: IModalOptions;

    setPosts(posts: Post[]){
        this.posts = posts;
    }

    setSearchQuery(query: string){
        this.searchQuery = query;
    }
    
    setModalOptions(options: IModalOptions){
        this.modalOptions = options;
    }

    getPosts(){
        return this.posts;
    }

    getPost(index: number){
        if(!this.posts || index >= this.posts.length)
            return null;

        return this.posts[index];
    }

    getModalOptions(){
        return this.modalOptions;
    }

    getSearchQuery(){
        return this.searchQuery;
    }

    getUpdatePost(){
        return this.updatePost;
    }

    clearModalOptions(){
        this.modalOptions = null;
    }

    clear(){
        this.posts = [];
        this.searchQuery = '';
        this.updatePost = null;
    }
}

export interface IModalOptions {
    title: string;
    message: string;
    closeBtn: string;
    confirmBtn: string;
}