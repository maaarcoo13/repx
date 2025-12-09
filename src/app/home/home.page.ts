import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import { ChartType, ChartOptions, ChartData } from 'chart.js';
import { Firestore, doc, getDoc, collection, getDocs, query, orderBy, limit } from '@angular/fire/firestore';

interface Rank {
  name: string;
  image: string;
  xpRequired: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    RouterModule,
    NgChartsModule
  ]
})
export class HomePage implements OnInit {

  // === XP / Rank ===
  XP = 0;
  rankProgress = 0;

  currentRank: Rank = { name: '', image: '', xpRequired: 0 };
  previousRank: Rank = { name: '', image: '', xpRequired: 0 };
  nextRank: Rank = { name: '', image: '', xpRequired: 0 };

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

  // === Weekly Chart ===
  barChartData: ChartData<'bar', number[], string> = {
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [
      {
        label: 'Reps',
        data: [0, 0, 0, 0, 0, 0, 0],
        backgroundColor: '#FF0000',
        borderRadius: 6
      }
    ]
  };

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: { legend: { display: false }, tooltip: { enabled: true } },
    scales: { x: { grid: { display: false } }, y: { beginAtZero: true } }
  };

  // === Personal Records Placeholder ===
  personalRecords = [
    { exercise: 'Bench Press', maxWeight: 225, date: '2025-10-10' },
    { exercise: 'Squat', maxWeight: 315, date: '2025-10-08' },
    { exercise: 'Deadlift', maxWeight: 405, date: '2025-10-12' },
    { exercise: 'Overhead Press', maxWeight: 135, date: '2025-10-09' },
  ];

  currentUsername: string = '';

  constructor(private firestore: Firestore) {}

  async ngOnInit() {
    this.currentUsername = localStorage.getItem('currentUsername') || '';
    if (!this.currentUsername) return;

    await this.loadUserXP();
    await this.loadWeeklyProgress();
  }

  async loadUserXP() {
    const userRef = doc(this.firestore, `users/${this.currentUsername}`);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return;

    const data: any = userSnap.data();
    this.XP = data?.xp || 0;
    this.updateRank();
  }

  updateRank() {
    let currentIdx = 0;
    for (let i = 0; i < this.ranks.length; i++) {
      if (this.XP >= this.ranks[i].xpRequired) currentIdx = i;
    }

    this.currentRank = this.ranks[currentIdx];
    this.previousRank = this.ranks[currentIdx - 1] || this.ranks[0];
    this.nextRank = this.ranks[currentIdx + 1] || this.ranks[this.ranks.length - 1];

    const xpForCurrent = this.currentRank.xpRequired;
    const xpForNext = this.nextRank.xpRequired;
    this.rankProgress = Math.floor(((this.XP - xpForCurrent) / (xpForNext - xpForCurrent)) * 100);
  }

  async loadWeeklyProgress() {
    const workoutsCol = collection(this.firestore, `users/${this.currentUsername}/Workouts`);
    const q = query(workoutsCol, orderBy('timestamp', 'desc'), limit(100));
    const querySnap = await getDocs(q);

    // initialize 7-day array
    const last7Days: number[] = Array(7).fill(0);
    const today = new Date();

    querySnap.forEach(docSnap => {
      const data: any = docSnap.data();
      const reps = data?.reps || 0;
      const timestamp = data?.timestamp?.toDate?.() || new Date(data.timestamp);

      if (!timestamp) return;

      const diff = Math.floor((today.getTime() - timestamp.getTime()) / (1000 * 60 * 60 * 24));
      if (diff >= 0 && diff < 7) {
        last7Days[6 - diff] += reps; // 6-diff to reverse order: Sun=0 ... Sat=6
      }
    });

    this.barChartData.datasets[0].data = last7Days;
  }
}