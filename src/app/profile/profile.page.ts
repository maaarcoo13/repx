import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Firestore, collection, getDocs, doc, getDoc, query, where } from '@angular/fire/firestore';

interface User {
  username: string;
  name: string;
  email: string;
  phone?: string;
  rank: string;
  xp: number;
  height?: number;
  weight?: number;
  wingspan?: number;
  sex?: string;
}

interface Rank {
  name: string;
  xpRequired: number;
  image: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
})
export class ProfilePage implements OnInit {
  user: User = {
    username: '',
    name: '',
    email: '',
    rank: 'Beginner',
    xp: 0
  };

  badgeImage: string = 'assets/badges/beginner.png';
  totalWeightThisMonth: number = 0;
  totalWeightLastWeek: number = 0;
  bestMuscle: string = '—';

  currentUsername: string = localStorage.getItem('currentUsername') || '';

  ranks: Rank[] = [
    { name: 'Beginner', xpRequired: 0, image: 'assets/badges/beginner.png' },
    { name: 'Rookie', xpRequired: 2000, image: 'assets/badges/rookie.png' },
    { name: 'Contender', xpRequired: 13000, image: 'assets/badges/contender.png' },
    { name: 'Apex', xpRequired: 20000, image: 'assets/badges/apex.png' },
    { name: 'Vanguard', xpRequired: 26000, image: 'assets/badges/vanguard.png' },
    { name: 'Challenger', xpRequired: 32000, image: 'assets/badges/challenger.png' },
    { name: 'Ironblood', xpRequired: 38000, image: 'assets/badges/ironblood.png' },
    { name: 'Titan', xpRequired: 44000, image: 'assets/badges/titan.png' },
    { name: 'Colossus', xpRequired: 50000, image: 'assets/badges/colossus.png' },
    { name: 'Ascendant', xpRequired: 56000, image: 'assets/badges/ascendant.png' },
    { name: 'Omega', xpRequired: 62000, image: 'assets/badges/omega.png' },
    { name: 'Godform', xpRequired: 70000, image: 'assets/badges/godform.png' },
  ];

  constructor(private firestore: Firestore) {}

  async ngOnInit() {
    if (!this.currentUsername) return;

    await this.loadUserData();
    await this.loadWorkoutStats();
    await this.loadBestMuscle();
  }

  private async loadUserData() {
    try {
      const userRef = doc(this.firestore, 'users', this.currentUsername);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data() as Partial<User>;
        this.user = {
          username: data.username || '',
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          xp: data.xp || 0,
          rank: data.rank || 'Beginner',
          height: data.height,
          weight: data.weight,
          wingspan: data.wingspan,
          sex: data.sex,
        };
        this.updateRankAndBadge(this.user.xp);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  private async loadWorkoutStats() {
    try {
      const workoutsRef = collection(this.firestore, `users/${this.currentUsername}/Workouts`);
      const workoutDocs = await getDocs(workoutsRef);

      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(now.getDate() - 7);

      let totalMonth = 0;
      let totalWeek = 0;

      workoutDocs.forEach(docSnap => {
        const data = docSnap.data() as any;
        const timestamp = data.timestamp;
        const weight = data.weight || 0;
        const reps = data.reps || 0;

        if (!timestamp) return;

        let date: Date;
        if (timestamp.toDate) {
          date = timestamp.toDate(); // Firestore Timestamp
        } else {
          date = new Date(timestamp); // fallback
        }

        const totalLifted = weight * reps;

        if (date >= startOfMonth) totalMonth += totalLifted;
        if (date >= sevenDaysAgo) totalWeek += totalLifted;
      });

      this.totalWeightThisMonth = totalMonth;
      this.totalWeightLastWeek = totalWeek;
    } catch (error) {
      console.error('Error fetching workouts:', error);
    }
  }

  private async loadBestMuscle() {
    try {
      const userRef = doc(this.firestore, 'users', this.currentUsername);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data() as any;
        this.bestMuscle = data.topMuscle || '—';
      }
    } catch (error) {
      console.error('Error fetching top muscle:', error);
    }
  }

  private updateRankAndBadge(xp: number) {
    const currentRank = this.ranks.filter(rank => xp >= rank.xpRequired).pop() || this.ranks[0];
    this.user.rank = currentRank.name;
    this.badgeImage = currentRank.image;
  }
}