import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import { Firestore, collection, getDocs, doc, getDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.page.html',
  styleUrls: ['./leaderboard.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule
  ]
})
export class LeaderboardPage implements OnInit {

  users: any[] = [];
  topUsers: any[] = [];
  filterMuscle: string = 'Total'; // 'Total' or muscle name
  muscleGroups = ['Total', 'Arm', 'Chest', 'Core', 'Leg', 'Shoulder', 'Back'];

  constructor(
    private firestore: Firestore,
    private toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  /** LOAD ALL USERS */
  async loadUsers() {
    const usersRef = collection(this.firestore, 'users');
    const snap = await getDocs(usersRef);

    const usersTemp = await Promise.all(snap.docs.map(async docSnap => {
      const data = docSnap.data();
      const username = docSnap.id;
      const topMuscle = data['topMuscle'] || 'N/A';
      // Total XP
      const totalXP = data['xp'] || 0;

      // Muscle-specific XP
      const armXP = data['ArmXP'] || 0;
      const chestXP = data['ChestXP'] || 0;
      const coreXP = data['CoreXP'] || 0;
      const legXP = data['LegXP'] || 0;
      const shoulderXP = data['ShoulderXP'] || 0;
      const backXP = data['BackXP'] || 0;

      return {
        username,
        totalXP,
        topMuscle,
        ArmXP: armXP,
        ChestXP: chestXP,
        CoreXP: coreXP,
        LegXP: legXP,
        ShoulderXP: shoulderXP,
        BackXP: backXP
      };
    }));

    this.users = usersTemp;
    this.applyFilter();
  }

  /** FILTER TOP 20 */
  applyFilter() {
    if (this.filterMuscle === 'Total') {
      this.topUsers = [...this.users]
        .sort((a, b) => b.totalXP - a.totalXP)
        .slice(0, 20);
    } else {
      const key = this.filterMuscle + 'XP';
      this.topUsers = [...this.users]
        .sort((a, b) => b[key] - a[key])
        .slice(0, 20);
    }
  }

  /** SELECT FILTER */
  selectFilter(muscle: string) {
    this.filterMuscle = muscle;
    this.applyFilter();
  }

}