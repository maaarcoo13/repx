import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { Firestore, doc, getDoc, collection, getDocs, updateDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class AccountPage implements OnInit {

  username: string = '';
  email: string = '';
  rank: string = '';
  password: string = '';
  timestamp: any = '';
  workoutsCompleted: number = 0;

  newPassword: string = '';

  constructor(
    private firestore: Firestore,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    const storedUsername = localStorage.getItem('currentUsername');
    if (storedUsername) {
      this.username = storedUsername;
      this.loadUserData();
      this.countWorkouts();
    }
  }

  async loadUserData() {
    try {
      const userRef = doc(this.firestore, `users/${this.username}`);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        this.email = data['email'] || '';
        this.rank = data['rank'] || '';
        this.password = data['password'] || '';
      }
    } catch (err: any) {
      const toast = await this.toastCtrl.create({
        message: `Error loading user data: ${err.message}`,
        duration: 2500,
        color: 'danger',
        position: 'top'
      });
      toast.present();
    }
  }

  async countWorkouts() {
    try {
      const workoutsRef = collection(this.firestore, `users/${this.username}/Workouts`);
      const snap = await getDocs(workoutsRef);
      this.workoutsCompleted = snap.size;
    } catch (err: any) {
      const toast = await this.toastCtrl.create({
        message: `Error counting workouts: ${err.message}`,
        duration: 2500,
        color: 'danger',
        position: 'top'
      });
      toast.present();
    }
  }

  async changePassword() {
    if (!this.newPassword) return;

    try {
      const userRef = doc(this.firestore, `users/${this.username}`);
      await updateDoc(userRef, { password: this.newPassword });
      this.password = this.newPassword;
      this.newPassword = '';

      const toast = await this.toastCtrl.create({
        message: '✅ Password updated successfully',
        duration: 2000,
        color: 'success',
        position: 'top'
      });
      toast.present();
    } catch (err: any) {
      const toast = await this.toastCtrl.create({
        message: `❌ Error updating password: ${err.message}`,
        duration: 2500,
        color: 'danger',
        position: 'top'
      });
      toast.present();
    }
  }
}