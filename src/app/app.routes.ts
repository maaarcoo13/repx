import { Routes } from '@angular/router';
import { LoginPage } from './login/login.page';
import { HomePage } from './home/home.page';
import { ProfilePage } from './profile/profile.page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginPage  
  },
  {
    path: 'home',
    component: HomePage
  },
  {
    path: 'profile',
    component: ProfilePage
  }
];
