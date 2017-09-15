import { RouteReuseStrategy } from '@angular/router';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MarkdownModule } from 'angular2-markdown';
import {ToastrModule} from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import {
    AppComponent,
    PostsComponent,
    LoadingComponent,
    PostComponent,
    CreatePostComponent,
    LoginComponent,
    ModalComponent,
    UpdateUserComponent
} from '../components';
import { FocusDirective, ActiveBtnDirective } from '../directives';
import { PostService, StoreService, RouterService, AuthService } from '../services';

const toastConfig = {
    timeOut: 2000,
    maxOpened: 1,
    autoDismiss: true,
    preventDuplicates: true,
    tapToDismiss: true,
    progressBar: true,
    positionClass: 'toast-bottom-right'
}

@NgModule({
    declarations: [
        AppComponent,
        PostsComponent,
        FocusDirective,
        ActiveBtnDirective,
        LoadingComponent,
        PostComponent,
        CreatePostComponent,
        LoginComponent,
        ModalComponent,
        UpdateUserComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        MarkdownModule.forRoot(),
        ToastrModule.forRoot(toastConfig),
        HttpModule,
        AppRoutingModule
    ],
    providers: [
        PostService,
        StoreService,
        RouterService,
        AuthService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }