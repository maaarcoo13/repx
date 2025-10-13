import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { XpService, Exercise, PhysicalProfile } from '../services/xp.service';
import { NgChartsModule } from 'ng2-charts'; // <-- import standalone chart directive
import { ChartType, ChartOptions, ChartData } from 'chart.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    RouterModule,
    NgChartsModule // <-- aquí no hay NgChartsModule
  ]
})
export class HomePage implements OnInit {

  weeklyWeights = [
    { day: 'Sun', weight: 12000 },
    { day: 'Mon', weight: 15000 },
    { day: 'Tue', weight: 13500 },
    { day: 'Wed', weight: 18000 },
    { day: 'Thu', weight: 16500 },
    { day: 'Fri', weight: 20000 },
    { day: 'Sat', weight: 17500 },
  ];
  barChartData: ChartData<'bar', number[], string> = {
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [
      {
        label: 'Weight Lifted (lbs)',
        data: [12000, 15000, 13500, 18000, 16500, 20000, 17500],
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


  rankProgress = 68;

  constructor(private xpService: XpService) { }

  ngOnInit() {
    this.calculateUserXp();
  }

  calculateUserXp() {
    const exercises: Exercise[] = [
      { name: 'Bench Press', weight: 200, reps: 10, sets: 4, typeMultiplier: 1.2 },
      { name: 'Incline Bench', weight: 200, reps: 10, sets: 4, typeMultiplier: 1 },
      { name: 'Pec Deck', weight: 135, reps: 10, sets: 4, typeMultiplier: 0.9 },
    ];

    const profile: PhysicalProfile = { height: 70, weight: 155, reach: 69 };
    const xp = this.xpService.calculateTotalXp(exercises, profile, 3); // 3-day streak
    console.log('User XP:', xp);
  }
}
