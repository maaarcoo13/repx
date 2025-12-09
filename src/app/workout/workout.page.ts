import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Firestore, collection, getDocs, doc, setDoc, deleteDoc } from '@angular/fire/firestore';

interface Exercise {
  id: string;
  reps: number;
  weight: number;
}

@Component({
  selector: 'app-workout',
  templateUrl: './workout.page.html',
  styleUrls: ['./workout.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class WorkoutPage implements OnInit {

  currentUsername: string = localStorage.getItem('currentUsername') || '';
  workoutName: string = '';
  exercises: Exercise[] = [];
  availableExercises: string[] = [];

  selectedExercise: string = '';
  newReps: number | null = null;
  newWeight: number | null = null;
  showAddForm: boolean = false;

  constructor(
    private firestore: Firestore,
    private route: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.workoutName = this.route.snapshot.paramMap.get('workoutName') || 'Unknown Workout';
    this.loadExercises();
    this.loadExerciseList();
  }

  // Load exercises already added to this workout
  async loadExercises() {
    const exercisesRef = collection(
      this.firestore,
      `users/${this.currentUsername}/WorkoutPlans/${this.workoutName}/Exercises`
    );

    const snapshot = await getDocs(exercisesRef);

    // Delete the "init" document if it exists
    const initDoc = snapshot.docs.find(d => d.id === "init");
    if (initDoc) {
      await deleteDoc(
        doc(this.firestore, `users/${this.currentUsername}/WorkoutPlans/${this.workoutName}/Exercises/init`)
      );
    }

    // Now load exercises normally
    this.exercises = snapshot.docs
      .filter(doc => doc.id !== 'init')
      .map(doc => ({
        id: doc.id,
        reps: doc.data()['reps'] || 0,
        weight: doc.data()['weight'] || 0
      }));
  }

  // Load list of available exercises from Workouts/WorkoutList/WorkoutList
  async loadExerciseList() {
    const listRef = collection(this.firestore, 'Workouts/WorkoutList/WorkoutList');
    const snapshot = await getDocs(listRef);
    this.availableExercises = snapshot.docs.map(doc => doc.id); // document IDs are exercise names
  }

  // Add selected exercise to the workout
  async addExercise() {
    if (!this.selectedExercise || this.newReps === null || this.newWeight === null) return;

    const newDoc = doc(
      this.firestore,
      `users/${this.currentUsername}/WorkoutPlans/${this.workoutName}/Exercises/${this.selectedExercise}`
    );

    await setDoc(newDoc, {
      reps: this.newReps,
      weight: this.newWeight
    });

    // Reset form
    this.showAddForm = false;
    this.newReps = null;
    this.newWeight = null;
    this.selectedExercise = '';

    this.loadExercises();
  }

  // Delete exercise from workout
  async deleteExercise(exerciseId: string) {
    const alert = await this.alertController.create({
      header: 'Confirm Deletion',
      message: `Delete ${exerciseId} from workout?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          handler: async () => {
            await deleteDoc(
              doc(this.firestore, `users/${this.currentUsername}/WorkoutPlans/${this.workoutName}/Exercises/${exerciseId}`)
            );
            this.loadExercises();
          }
        }
      ]
    });

    await alert.present();
  }
}
