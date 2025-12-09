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
import { SignupPage } from './signup/signup.page';
import { GroupsviewPage } from './groupsview/groupsview.page';
import { StartworkPage } from './startwork/startwork.page';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPage },
  { path: 'home', component: HomePage },
  { path: 'profile', component: ProfilePage },
  { path: 'routine', component: RoutinePage },
  { path: 'friends', component: FriendsPage },
  { path: 'groups', component: GroupsPage },
  { path: 'physique', component: PhysiquePage },
  // Dynamic route to pass workout name
  { path: 'workout/:workoutName', component: WorkoutPage },
  { path: 'leaderboard', component: LeaderboardPage },
  { path: 'settings', component: SettingsPage },
  { path: 'signup', component: SignupPage },
  { path: 'groupsview', component: GroupsviewPage },
  { path: 'startwork/:workoutName', loadComponent: () => import('./startwork/startwork.page').then(m => m.StartworkPage)},
  { path: 'privacy', loadComponent: () => import('./privacy/privacy.page').then( m => m.PrivacyPage) },
  { path: 'account', loadComponent: () => import('./account/account.page').then( m => m.AccountPage) }
];
