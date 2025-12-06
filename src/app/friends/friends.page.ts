import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { Firestore, collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { debounceTime } from 'rxjs/operators';

interface Friend {
  username: string;
  name: string;
  xp: number;
  rank: string;
  avatar?: string;
}

interface FriendRequest {
  username: string;
  name: string;
  avatar?: string;
}

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, RouterModule]
})
export class FriendsPage implements OnInit {

  currentUsername: string = '';
  friendsList: Friend[] = [];
  filteredFriends: Friend[] = [];
  friendRequests: FriendRequest[] = [];

  searchControl: FormControl = new FormControl('');
  selectedSegment: string = 'friends';

  constructor(
    private toastController: ToastController,
    private alertController: AlertController,
    private firestore: Firestore
  ) {}

  ngOnInit() {
    this.currentUsername = localStorage.getItem('currentUsername') || '';
    if (!this.currentUsername) return;

    this.loadFriends();

    this.searchControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe(term => this.filterFriends(term));
  }

  // HANDLE SEGMENT SWITCHING
  segmentChanged(event: any) {
    const value = event.detail.value;

    if (value === 'friends') {
      // stay here
    } else if (value === 'groups') {
      window.location.href = '/groups';
    }
  }

  // LOAD FRIENDS + REQUESTS
  async loadFriends() {
    this.friendsList = [];
    this.friendRequests = [];

    const friendsCol = collection(this.firestore, `users/${this.currentUsername}/Friends`);
    const friendsSnapshot = await getDocs(friendsCol);

    for (let snap of friendsSnapshot.docs) {
      const friendUsername = snap.id;
      const status = snap.data()['status'];

      const friendDoc = await getDoc(doc(this.firestore, `users/${friendUsername}`));
      if (!friendDoc.exists()) continue;

      const userData = friendDoc.data();

      const friendObj: Friend = {
        username: friendUsername,
        name: userData['username'] || friendUsername,
        xp: userData['xp'] || 0,
        rank: userData['rank'] || 'Beginner',
        avatar: 'assets/icon/profile-pic.jpg'
      };

      if (status === 'accepted') {
        this.friendsList.push(friendObj);
      } else if (status === 'requested') {
        this.friendRequests.push({
          username: friendObj.username,
          name: friendObj.name,
          avatar: friendObj.avatar
        });
      }
    }

    this.filteredFriends = [...this.friendsList];
  }

  filterFriends(term: string) {
    if (!term) {
      this.filteredFriends = [...this.friendsList];
      return;
    }

    const t = term.toLowerCase();
    this.filteredFriends = this.friendsList.filter(f =>
      f.username.toLowerCase().includes(t) ||
      f.name.toLowerCase().includes(t)
    );
  }

  // SEND FRIEND REQUEST
  async addFriend() {
    const alert = await this.alertController.create({
      header: 'Add Friend',
      inputs: [{ name: 'username', type: 'text', placeholder: 'Enter username' }],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Send Request',
          handler: async (data) => {
            const target = data.username?.trim();
            if (!target || target === this.currentUsername) return false;

            const targetDoc = await getDoc(doc(this.firestore, `users/${target}`));
            if (!targetDoc.exists()) {
              this.showToast(`User "${target}" does not exist.`, 'danger');
              return false;
            }

            await setDoc(doc(this.firestore, `users/${target}/Friends/${this.currentUsername}`), {
              status: 'requested'
            });

            this.showToast(`Friend request sent to ${target}!`, 'success');
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  // ACCEPT REQUEST
  async acceptFriend(username: string) {
    await updateDoc(doc(this.firestore, `users/${this.currentUsername}/Friends/${username}`), {
      status: 'accepted'
    });

    await setDoc(doc(this.firestore, `users/${username}/Friends/${this.currentUsername}`), {
      status: 'accepted'
    });

    this.friendRequests = this.friendRequests.filter(r => r.username !== username);
    this.loadFriends();

    this.showToast(`You are now friends with ${username}!`, 'success');
  }

  // DECLINE REQUEST
  async declineFriend(username: string) {
    await deleteDoc(doc(this.firestore, `users/${this.currentUsername}/Friends/${username}`));

    this.friendRequests = this.friendRequests.filter(r => r.username !== username);

    this.showToast(`Friend request from ${username} declined.`, 'medium');
  }

  async viewProfile(username: string) {
    this.showToast(`Viewing ${username}'s profile...`, 'dark');
  }

  async openChat(username: string) {
    this.showToast(`Chat coming soon!`, 'warning');
  }

  // TOAST HELPER
  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
      color
    });
    toast.present();
  }
}