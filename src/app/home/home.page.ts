import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import { ChartType, ChartOptions, ChartData } from 'chart.js';
import { Firestore, collection, getDocs, doc, getDoc } from '@angular/fire/firestore';

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
  imports: [IonicModule, CommonModule, RouterModule, NgChartsModule]
})
export class HomePage implements OnInit {

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

  // BAR CHART
  barChartData: ChartData<'bar', number[], string> = {
    labels: [],
    datasets: [
      { label: 'Reps per day', data: [], backgroundColor: '#FF0000', borderRadius: 6 }
    ]
  };

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: { legend: { display: false }, tooltip: { enabled: true } },
    scales: { x: { grid: { display: false } }, y: { beginAtZero: true } }
  };

  constructor(private firestore: Firestore) {}

  async ngOnInit() {
    const username = localStorage.getItem('currentUsername');
    if (!username) return;

    // 1️⃣ Load XP and set rank
    await this.loadXP(username);

    // 2️⃣ Load last 7 days of workouts and build chart
    await this.loadWeeklyProgress(username);
  }

  private async loadXP(username: string) {
    const userRef = doc(this.firestore, `users/${username}`);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return;

    const data = userSnap.data() as any;
    this.XP = data.xp || 0;

    this.updateRank();
  }

  private updateRank() {
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

  private async loadWeeklyProgress(username: string) {
    const workoutsRef = collection(this.firestore, `users/${username}/Workouts`);
    const workoutDocs = await getDocs(workoutsRef);

    const repsByDay: Record<string, number> = {};

    // Get last 7 days
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dayKey = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
      repsByDay[dayKey] = 0;
    }

    workoutDocs.forEach(docSnap => {
      const data = docSnap.data() as any;
      const timestamp = data.timestamp;
      const reps = data.reps || 0;

      if (!timestamp) return;

      let date: Date;
      if (timestamp.toDate) {
        date = timestamp.toDate(); // Firestore Timestamp
      } else {
        date = new Date(timestamp); // fallback
      }

      const dayKey = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
      if (repsByDay[dayKey] !== undefined) {
        repsByDay[dayKey] += reps;
      }
    });

    // Prepare chart data
    const labels: string[] = [];
    const data: number[] = [];
    Object.keys(repsByDay).sort().forEach(key => {
      labels.push(key); 
      data.push(repsByDay[key]);
    });

    this.barChartData = { labels, datasets: [{ label: 'Reps per day', data, backgroundColor: '#FF0000', borderRadius: 6 }] };
  }

}