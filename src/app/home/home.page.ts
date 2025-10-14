import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import { ChartType, ChartOptions, ChartData } from 'chart.js';

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
  XP = 65000; // manual input for testing
  rankProgress = 0;

  currentRank: Rank = { name: '', image: '', xpRequired: 0 };
  previousRank: Rank = { name: '', image: '', xpRequired: 0 };
  nextRank: Rank = { name: '', image: '', xpRequired: 0 };

  ranks: Rank[] = [
  { name: 'Beginner', xpRequired: 0, image: 'assets/badges/beginner.png' },
  { name: 'Rookie', xpRequired: 2000, image: 'assets/badges/rookie.png' },
  { name: 'Contender', xpRequired: 13000, image: 'assets/badges/contender.png' }, // tú
  { name: 'Apex', xpRequired: 20000, image: 'assets/badges/apex.png' },
  { name: 'Vanguard', xpRequired: 26000, image: 'assets/badges/vanguard.png' },
  { name: 'Challenger', xpRequired: 32000, image: 'assets/badges/challenger.png' },
  { name: 'Ironblood', xpRequired: 38000, image: 'assets/badges/ironblood.png' },
  { name: 'Titan', xpRequired: 44000, image: 'assets/badges/titan.png' },
  { name: 'Colossus', xpRequired: 50000, image: 'assets/badges/colossus.png' },
  { name: 'Ascendant', xpRequired: 56000, image: 'assets/badges/ascendant.png' },
  { name: 'Omega', xpRequired: 62000, image: 'assets/badges/omega.png' }, // Andoni
  { name: 'Godform', xpRequired: 70000, image: 'assets/badges/godform.png' }, // Cbum
];


  // === BAR CHART DATA ===
  barChartData: ChartData<'bar', number[], string> = {
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [
      {
        label: 'Weight Lifted (lbs)',
        data: [0, 1433, 1257, 0, 1325, 0, 1653],
        backgroundColor: '#FF0000',
        borderRadius: 6
      }
    ]
  };

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true }
    }
  };

  // === PERSONAL RECORDS ===
personalRecords = [
  { exercise: 'Bench Press', maxWeight: 225, date: '2025-10-10' },
  { exercise: 'Squat', maxWeight: 315, date: '2025-10-08' },
  { exercise: 'Deadlift', maxWeight: 405, date: '2025-10-12' },
  { exercise: 'Overhead Press', maxWeight: 135, date: '2025-10-09' },
];


  constructor() { }

  ngOnInit() {
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

  // Example XP calculation (optional)
  /*
  calculateUserXp() {
    const exercises: Exercise[] = [
      { name: 'Bench Press', weight: 200, reps: 10, sets: 4, typeMultiplier: 1.2 },
      { name: 'Incline Bench', weight: 200, reps: 10, sets: 4, typeMultiplier: 1 },
      { name: 'Pec Deck', weight: 135, reps: 10, sets: 4, typeMultiplier: 0.9 },
    ];

    const profile: PhysicalProfile = { height: 70, weight: 155, reach: 69 };
    const xp = this.xpService.calculateTotalXp(exercises, profile, 3); // 3-day streak
    console.log('User XP:', xp);
  } */
}
