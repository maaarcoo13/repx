import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Firestore, collection, getDocs, doc, setDoc } from '@angular/fire/firestore';

interface Exercise {
  id: string;
  reps: number;
  weight: number;
}

@Component({
  selector: 'app-startwork',
  templateUrl: './startwork.page.html',
  styleUrls: ['./startwork.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class StartworkPage implements OnInit {

  workoutName: string = "";
  currentUsername: string = localStorage.getItem("currentUsername") || "";
  exercises: Exercise[] = [];

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.workoutName = this.route.snapshot.paramMap.get("workoutName") || "";
    this.loadExercises();
  }

  
  // LOAD EXERCISES
  
  async loadExercises() {
    const ref = collection(
      this.firestore,
      `users/${this.currentUsername}/WorkoutPlans/${this.workoutName}/Exercises`
    );

    const snap = await getDocs(ref);

    this.exercises = snap.docs.map(d => ({
      id: d.id,
      reps: d.data()['reps'],
      weight: d.data()['weight']
    }));
  }

  
  // EDIT EXERCISE
  
  async editExercise(ex: Exercise) {
    const alert = await this.alertCtrl.create({
      header: ex.id,
      inputs: [
        { name: 'reps', type: 'number', value: ex.reps },
        { name: 'weight', type: 'number', value: ex.weight }
      ],
      buttons: [
        { text: "Cancel", role: "cancel" },
        {
          text: "Save",
          handler: (data) => {
            ex.reps = Number(data.reps);
            ex.weight = Number(data.weight);
          }
        }
      ]
    });

    await alert.present();
  }

  
  // CONFIRM END WORKOUT
  
  async confirmEndWorkout() {
    const alert = await this.alertCtrl.create({
      header: "End Workout",
      message: "Are you sure you have finished?",
      buttons: [
        { text: "Cancel", role: "cancel" },
        {
          text: "Yes, I'm sure",
          handler: () => this.endWorkout()
        }
      ]
    });

    await alert.present();
  }

  
  // SAVE EXERCISES + XP
  
  async endWorkout() {
    const username = this.currentUsername;
    if (!username) return;

    const usersCollection = collection(this.firestore, `users`);
    const usersSnap = await getDocs(usersCollection);

    let userData: any = {};
    usersSnap.forEach(docSnap => {
      if (docSnap.id === username) userData = docSnap.data();
    });

    if (!userData) return;

    const height = userData.height || 1;
    const wingspan = userData.wingspan || 1;
    const scale = (height + wingspan) / 2;

    const userXP = {
      ArmXP: userData.ArmXP || 0,
      BackXP: userData.BackXP || 0,
      CoreXP: userData.CoreXP || 0,
      ShoulderXP: userData.ShoulderXP || 0,
      ChestXP: userData.ChestXP || 0,
      LegXP: userData.LegXP || 0
    };

    const multipliersCollection = collection(this.firestore, `Workouts/WorkoutList/WorkoutList`);
    const allMultipliersSnap = await getDocs(multipliersCollection);
    const multipliersMap: Record<string, any> = {};
    allMultipliersSnap.forEach(docSnap => multipliersMap[docSnap.id] = docSnap.data());

    // process
    for (let ex of this.exercises) {
      const timestamp = new Date().getTime();
      const docId = `${ex.id}_${timestamp}`;

      // save exercise
      const workoutRef = doc(this.firestore, `users/${username}/Workouts/${docId}`);
      await setDoc(workoutRef, {
        name: ex.id,
        reps: ex.reps,
        weight: ex.weight,
        workout: this.workoutName,
        timestamp: new Date().toISOString()
      });

      const multipliers = multipliersMap[ex.id] || {};

      const repsClamped = Math.min(Math.max(ex.reps, 1), 12);
      const weightClamped = Math.min(Math.max(ex.weight, 1), 100);
      const intensity = repsClamped * weightClamped * scale;

      const globalFactor = 0.0005; 
      userXP.ArmXP      += intensity * (multipliers.Arm ?? 0) * globalFactor * 0.6; // brazo extra nerf
      userXP.BackXP     += intensity * (multipliers.Back ?? 0) * globalFactor;
      userXP.CoreXP     += intensity * (multipliers.Core ?? 0) * globalFactor;
      userXP.ShoulderXP += intensity * (multipliers.Shoulder ?? 0) * globalFactor;
      userXP.ChestXP    += intensity * (multipliers.Chest ?? 0) * globalFactor;
      userXP.LegXP      += intensity * (multipliers.Leg ?? 0) * globalFactor;
    }

    // round xp
    for (const key of Object.keys(userXP)) {
      userXP[key as keyof typeof userXP] = Math.round(userXP[key as keyof typeof userXP]);
    }

    // Compute XPs
    const xpTotal =
      userXP.ArmXP +
      userXP.BackXP +
      userXP.CoreXP +
      userXP.ShoulderXP +
      userXP.ChestXP +
      userXP.LegXP;

    const muscleXPMap = {
      Arm: userXP.ArmXP,
      Back: userXP.BackXP,
      Core: userXP.CoreXP,
      Shoulder: userXP.ShoulderXP,
      Chest: userXP.ChestXP,
      Leg: userXP.LegXP
    };

    let topMuscle = "Arm";
    let maxXP = 0;
    for (const [muscle, xp] of Object.entries(muscleXPMap)) {
      if (xp > maxXP) { maxXP = xp; topMuscle = muscle; }
    }

    const userRef = doc(this.firestore, `users/${username}`);
    await setDoc(userRef, {
      ...userXP,
      xp: Math.round(xpTotal),
      topMuscle
    }, { merge: true });

    this.router.navigate(['workout', this.workoutName]);
  }

  
  // MARK AS DONE
  
  completeExercise(ex: Exercise) {
    this.editExercise(ex);
  }
}
