import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';


interface User {
  username: string;
  email: string;
  password: string;
  height?: number;
  weight?: number;
  wingspan?: number;
  sex?: string;
  timestamp?: any;
  xp?: number;
  rank?: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule, RouterModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  username: string = ''; // login por username
  password: string = '';

  constructor(private router: Router, private firestore: Firestore) {}

  async onSubmit() {
    if (!this.username || !this.password) {
      alert('Please enter both username and password.');
      return;
    }

    try {
      const userRef = doc(this.firestore, 'users', this.username);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        alert('User does not exist.');
        return;
      }

      const userData = userSnap.data() as User;

      if (userData.password === this.password) {
        this.router.navigateByUrl('/home');
      } else {
        alert('Incorrect password.');
      }
    } catch (error) {
      console.error(error);
      alert('Error logging in.');
    }
  }

  goToSignup() {
    this.router.navigateByUrl('/signup');
  }
}
