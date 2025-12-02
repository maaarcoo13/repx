import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Firestore, doc, setDoc, collection, serverTimestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage {
  username: string = '';
  name: string = '';
  email: string = '';
  phone: string = '';
  password: string = '';
  height: number | null = null;
  weight: number | null = null;
  wingspan: number | null = null;
  sex: string = 'Male';

  constructor(private router: Router, private firestore: Firestore) {}

  async onSubmit() {
    if (!this.username || !this.name || !this.email || !this.phone || !this.password ||
        this.height === null || this.weight === null || this.wingspan === null || !this.sex) {
      alert('Please fill all fields.');
      return;
    }

    try {
      const userRef = doc(this.firestore, 'users', this.username);

      // Crear documento principal del usuario
      await setDoc(userRef, {
        username: this.username,
        name: this.name,
        email: this.email,
        phone: this.phone,
        password: this.password,
        height: this.height,
        weight: this.weight,
        wingspan: this.wingspan,
        sex: this.sex,
        timestamp: serverTimestamp(),
        xp: 0,
        rank: 'Beginner'
      });

      // Crear subcolecciones vacías
      const friendsRef = collection(userRef, 'Friends');
      const groupsRef = collection(userRef, 'Groups');
      const workoutsRef = collection(userRef, 'Workouts');
      const workoutPlansRef = collection(userRef, 'WorkoutPlans');

      // Documento inicial en cada subcolección
      await setDoc(doc(friendsRef, 'init'), { initialized: true, timestamp: serverTimestamp() });
      await setDoc(doc(groupsRef, 'init'), { initialized: true, timestamp: serverTimestamp() });
      await setDoc(doc(workoutsRef, 'init'), { initialized: true, timestamp: serverTimestamp() });
      await setDoc(doc(workoutPlansRef, 'init'), { initialized: true, timestamp: serverTimestamp() });

      alert('Account created successfully! Redirecting to login...');
      this.router.navigateByUrl('/login'); // <-- ahora va a login
    } catch (error) {
      console.error('Error creating account:', error);
      alert('Error creating account. Please try again.');
    }
  }
}
