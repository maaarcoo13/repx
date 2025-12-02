import { Component, AfterViewInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  Chart,
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

Chart.register(
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

@Component({
  selector: 'app-physique',
  templateUrl: './physique.page.html',
  styleUrls: ['./physique.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class PhysiquePage implements AfterViewInit {

  currentUsername: string = '';
  maxXP: number = 15000;

  muscleGroups: { name: string; xp: number; rank: string; color: string }[] = [];

  // Rank table
  rankTable: Record<string, number> = {
    Apex: 20000,
    Ascendant: 56000,
    Beginner: 0,
    Challenger: 32000,
    Colossus: 50000,
    Contender: 13000,
    Godform: 70000,
    Ironblood: 38000,
    Omega: 62000,
    Rookie: 2000,
    Titan: 44000,
    Vanguard: 26000
  };

  rankColors: string[] = ['bronze','silver','gold','red','blue']; // can extend mapping if needed

  constructor(private firestore: Firestore) {}

  ngAfterViewInit() {
    this.currentUsername = localStorage.getItem('currentUsername') || '';
    if (!this.currentUsername) return;

    this.loadUserData();
  }

  async loadUserData() {
    const userRef = doc(this.firestore, `users/${this.currentUsername}`);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return;

    const data = userSnap.data() || {};

    const shoulders = data['ShoulderXP'] || 0;
    const chest = data['ChestXP'] || 0;
    const back = data['BackXP'] || 0;
    const arms = data['ArmXP'] || 0;
    const core = data['CoreXP'] || 0;
    const legs = data['LegXP'] || 0;

    const muscleValues = [
      { name: 'Shoulders', xp: shoulders },
      { name: 'Chest', xp: chest },
      { name: 'Back', xp: back },
      { name: 'Arms', xp: arms },
      { name: 'Core', xp: core },
      { name: 'Legs', xp: legs }
    ];

    // Populate muscleGroups for display below chart
    this.muscleGroups = muscleValues.map(m => {
      const xp6 = m.xp * 6;
      const rank = this.getRank(xp6);
      const color = this.getColorByRank(rank);
      return { ...m, rank, color };
    });

    // Draw radar chart
    this.loadRadarChart([shoulders, chest, back, arms, core, legs]);
  }

  loadRadarChart(values: number[]) {
    const ctx = document.getElementById('physiqueRadarChart') as HTMLCanvasElement;

    new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Shoulders', 'Chest', 'Back', 'Arms', 'Core', 'Legs'],
        datasets: [
          {
            label: 'Stats',
            data: values.map(v => (v / this.maxXP) * 100),
            borderWidth: 2,
            borderColor: 'rgba(255, 0, 0, 0.8)',
            backgroundColor: 'rgba(255, 0, 0, 0.15)',
            pointBackgroundColor: 'red',
            pointRadius: 4
          },
          { data: [100, 100, 100, 100, 100, 100], borderColor: 'rgba(200,200,200,0.3)', borderWidth: 1, pointRadius: 0, fill: false },
          { data: [80, 80, 80, 80, 80, 80], borderColor: 'rgba(200,200,200,0.25)', borderWidth: 1, pointRadius: 0, fill: false },
          { data: [60, 60, 60, 60, 60, 60], borderColor: 'rgba(200,200,200,0.2)', borderWidth: 1, pointRadius: 0, fill: false },
          { data: [40, 40, 40, 40, 40, 40], borderColor: 'rgba(200,200,200,0.15)', borderWidth: 1, pointRadius: 0, fill: false },
          { data: [20, 20, 20, 20, 20, 20], borderColor: 'rgba(200,200,200,0.1)', borderWidth: 1, pointRadius: 0, fill: false }
        ]
      },
      options: {
        scales: {
          r: {
            suggestedMin: 0,
            suggestedMax: 100,
            angleLines: { display: false },
            ticks: { display: false },
            grid: { color: 'rgba(255,255,255,0.06)' },
            pointLabels: { color: 'white', font: { size: 14 } }
          }
        },
        plugins: { legend: { display: false } }
      }
    });
  }

  getRank(xp6: number): string {
    // Find the highest rank for which xp6 >= threshold
    const ranks = Object.entries(this.rankTable)
      .sort((a, b) => b[1] - a[1]); // descending
    for (const [rank, threshold] of ranks) {
      if (xp6 >= threshold) return rank;
    }
    return 'Beginner';
  }

  getColorByRank(rank: string): string {
    // Map rank to color
    switch (rank) {
      case 'Apex':
      case 'Ascendant':
      case 'Godform':
        return 'red';
      case 'Titan':
      case 'Colossus':
      case 'Omega':
        return 'gold';
      case 'Challenger':
      case 'Ironblood':
      case 'Vanguard':
        return 'silver';
      case 'Contender':
      case 'Rookie':
      case 'Beginner':
        return 'bronze';
      default:
        return 'blue';
    }
  }
}