import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Firestore, doc, setDoc, serverTimestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage {
  username: string = '';
  email: string = '';
  password: string = '';
  height: number | null = null;
  weight: number | null = null;
  wingspan: number | null = null;
  sex: string = 'Male';

  constructor(private router: Router, private firestore: Firestore) {}

  async onSubmit() {
    if (!this.username || !this.email || !this.password || this.height === null || this.weight === null || this.wingspan === null || !this.sex) {
      alert('Please fill all fields.');
      return;
    }

    const userRef = doc(this.firestore, 'users', this.username);
    await setDoc(userRef, {
      username: this.username,
      email: this.email,
      password: this.password,
      height: this.height,
      weight: this.weight,
      wingspan: this.wingspan,
      sex: this.sex,
      timestamp: serverTimestamp(),
      xp: 0,
      rank: 'Beginner'
    });

    this.router.navigateByUrl('/home');
  }
}
