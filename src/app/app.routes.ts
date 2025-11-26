import { Routes } from '@angular/router';
import { LoginPage } from './login/login.page';
import { HomePage } from './home/home.page';
import { ProfilePage } from './profile/profile.page';
import { RoutinePage } from './routine/routine.page';
import { FriendsPage } from './friends/friends.page';
import { GroupsPage } from './groups/groups.page';
import { PhysiquePage } from './physique/physique.page';
import { WorkoutPage } from './workout/workout.page';
import { LeaderboardPage } from './leaderboard/leaderboard.page';
import { SettingsPage } from './settings/settings.page';

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
  },
  {
    path: 'routine',
    component: RoutinePage
  },
  {
    path: 'friends',
    component: FriendsPage
  },
  {
    path: 'groups',
    component: GroupsPage
  },
  {
    path: 'physique',
    component: PhysiquePage
  },
  {
    path: 'workout',
    component: WorkoutPage
  },
  {
    path: 'leaderboard',
    component: LeaderboardPage
  },
  {
    path: 'settings',
    component: SettingsPage
  }
];
