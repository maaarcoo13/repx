import { Component, OnInit } from '@angular/core';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Firestore, collection, getDocs, doc, setDoc, query } from '@angular/fire/firestore';

@Component({
  selector: 'app-routine',
  templateUrl: './routine.page.html',
  styleUrls: ['./routine.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class RoutinePage implements OnInit {

  currentUsername: string = localStorage.getItem('currentUsername') || '';
  workouts: { name: string; exercisesCount: number }[] = [];

  constructor(
    private firestore: Firestore,
    private toastController: ToastController,
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadWorkouts();
  }

  async loadWorkouts() {
    this.workouts = [];

    const workoutsRef = collection(this.firestore, `users/${this.currentUsername}/WorkoutPlans`);
    const q = query(workoutsRef);
    const snapshot = await getDocs(q);

    snapshot.forEach(async docSnap => {
      const exercisesRef = collection(this.firestore, `users/${this.currentUsername}/WorkoutPlans/${docSnap.id}/Exercises`);
      const exSnap = await getDocs(exercisesRef);

      this.workouts.push({
        name: docSnap.id,
        exercisesCount: exSnap.size
      });
    });
  }

  async createRoutine() {
    const alert = await this.alertController.create({
      header: 'Create New Routine',
      inputs: [
        {
          name: 'workoutName',
          type: 'text',
          placeholder: 'Workout name'
        }
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Create',
          handler: async (data: { workoutName?: string }) => {
            const workoutName = data.workoutName?.trim();
            if (!workoutName) {
              const toast = await this.toastController.create({
                message: 'Workout name cannot be empty',
                duration: 2000,
                color: 'danger'
              });
              toast.present();
              return;
            }

            try {
              // 1️⃣ Crear documento del WorkoutPlan
              const workoutDocRef = doc(this.firestore, `users/${this.currentUsername}/WorkoutPlans/${workoutName}`);
              await setDoc(workoutDocRef, { createdAt: new Date() });

              // 2️⃣ Crear la colección Exercises con un documento inicial
              const exercisesInitRef = doc(this.firestore, `users/${this.currentUsername}/WorkoutPlans/${workoutName}/Exercises/init`);
              await setDoc(exercisesInitRef, { initialized: true, timestamp: new Date() });

              const toast = await this.toastController.create({
                message: `Workout "${workoutName}" created with Exercises collection!`,
                duration: 2000,
                color: 'success'
              });
              toast.present();

              this.loadWorkouts();

            } catch (err) {
              console.error(err);
              const toast = await this.toastController.create({
                message: 'Error creating workout',
                duration: 2000,
                color: 'danger'
              });
              toast.present();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  goToWorkout(workoutName: string) {
    this.router.navigate(['/workout', workoutName]);
  }
}
