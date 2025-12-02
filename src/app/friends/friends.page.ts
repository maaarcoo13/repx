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

    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe(searchTerm => {
      this.filterFriends(searchTerm);
    });
  }

  async loadFriends() {
    this.friendsList = [];
    this.friendRequests = [];

    const friendsCol = collection(this.firestore, `users/${this.currentUsername}/Friends`);
    const friendsSnapshot = await getDocs(friendsCol);

    for (let friendDocSnap of friendsSnapshot.docs) {
      const friendUsername = friendDocSnap.id;
      const status = friendDocSnap.data()['status'];

      const friendDataDoc = await getDoc(doc(this.firestore, `users/${friendUsername}`));
      if (!friendDataDoc.exists()) continue;

      const friendData = friendDataDoc.data();
      const friendObj: Friend = {
        username: friendUsername,
        name: friendData['username'] || friendUsername,
        xp: friendData['xp'] || 0,
        rank: friendData['rank'] || 'Beginner',
        avatar: 'assets/icon/profile-pic.jpg'
      };

      if (status.toLowerCase() === 'accepted') {
        this.friendsList.push(friendObj);
      } else if (status.toLowerCase() === 'requested') {
        this.friendRequests.push({
          username: friendObj.username,
          name: friendObj.name,
          avatar: friendObj.avatar
        });
      }
    }

    this.filteredFriends = [...this.friendsList];
  }

  filterFriends(searchTerm: string) {
    if (!searchTerm) {
      this.filteredFriends = [...this.friendsList];
    } else {
      const lower = searchTerm.toLowerCase();
      this.filteredFriends = this.friendsList.filter(f =>
        f.username.toLowerCase().includes(lower) || f.name.toLowerCase().includes(lower)
      );
    }
  }

  // --- ADD FRIEND ---
  async addFriend() {
    const alert = await this.alertController.create({
      header: 'Add Friend',
      inputs: [
        {
          name: 'username',
          type: 'text',
          placeholder: 'Enter username'
        }
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Send Request',
          handler: async (data) => {
            const targetUsername = data.username?.trim();
            if (!targetUsername || targetUsername === this.currentUsername) return false;

            // Check if user exists
            const targetDoc = await getDoc(doc(this.firestore, `users/${targetUsername}`));
            if (!targetDoc.exists()) {
              this.toastController.create({
                message: `User "${targetUsername}" does not exist.`,
                duration: 2000,
                color: 'danger',
                position: 'top'
              }).then(toast => toast.present());
              return false;
            }

            // Add to target user's Friends collection with status "requested"
            const targetFriendRef = doc(this.firestore, `users/${targetUsername}/Friends/${this.currentUsername}`);
            await setDoc(targetFriendRef, { status: 'requested' });

            this.toastController.create({
              message: `✅ Friend request sent to ${targetUsername}!`,
              duration: 2000,
              color: 'success',
              position: 'top'
            }).then(toast => toast.present());

            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  // --- ACCEPT FRIEND ---
  async acceptFriend(username: string) {
    const friendRef = doc(this.firestore, `users/${this.currentUsername}/Friends/${username}`);
    await updateDoc(friendRef, { status: 'accepted' });

    // Also update the other user to add you as their friend
    const myRefInOther = doc(this.firestore, `users/${username}/Friends/${this.currentUsername}`);
    await setDoc(myRefInOther, { status: 'accepted' });

    const index = this.friendRequests.findIndex(f => f.username === username);
    if (index > -1) {
      const request = this.friendRequests.splice(index, 1)[0];

      const friendDataDoc = await getDoc(doc(this.firestore, `users/${username}`));
      let xp = 0, rank = 'Beginner', name = username;
      if (friendDataDoc.exists()) {
        const friendData = friendDataDoc.data();
        xp = friendData['xp'] || 0;
        rank = friendData['rank'] || 'Beginner';
        name = friendData['username'] || username;
      }

      this.friendsList.push({
        username,
        name,
        xp,
        rank,
        avatar: request.avatar
      });
      this.filterFriends(this.searchControl.value || '');
    }

    const toast = await this.toastController.create({
      message: `✅ You are now friends with ${username}!`,
      duration: 2000,
      position: 'top',
      color: 'success'
    });
    toast.present();
  }

  async declineFriend(username: string) {
    const friendRef = doc(this.firestore, `users/${this.currentUsername}/Friends/${username}`);
    await deleteDoc(friendRef);

    this.friendRequests = this.friendRequests.filter(f => f.username !== username);

    const toast = await this.toastController.create({
      message: `❌ Friend request from ${username} declined`,
      duration: 2000,
      position: 'top',
      color: 'medium'
    });
    toast.present();
  }

  async viewProfile(username: string) {
    const toast = await this.toastController.create({
      message: `👤 Viewing ${username}'s profile...`,
      duration: 1500,
      position: 'bottom',
      color: 'dark'
    });
    toast.present();
  }

  async openChat(username: string) {
    const toast = await this.toastController.create({
      message: `💬 Chat feature coming soon!`,
      duration: 2000,
      position: 'bottom',
      color: 'warning'
    });
    toast.present();
  }
}