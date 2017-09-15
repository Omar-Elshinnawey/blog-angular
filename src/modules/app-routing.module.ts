import { NgModule } from '@angular/core';
import { RouterModule, Router, Routes } from '@angular/router';
import {
    PostsComponent,
    PostComponent,
    CreatePostComponent,
    LoginComponent,
    ModalComponent,
    UpdateUserComponent
} from '../components';

import {AuthService} from '../services';

export const routes: Routes = [
    { path: 'post/:id', component: PostComponent },
    { path: 'new', component: CreatePostComponent, canActivate: [AuthService] },
    { path: 'login', component: LoginComponent },
    { path: 'user', component: UpdateUserComponent, canActivate: [AuthService] },
    { path: 'popup', component: ModalComponent, outlet: 'popup' },
    { path: '', component: PostsComponent },
    { path: '**', redirectTo: '', pathMatch: 'full'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
