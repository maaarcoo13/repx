import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { XpService, Exercise, PhysicalProfile } from '../services/xp.service';


interface Stat {
  label: string;
  value: string | number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    RouterModule
  ]
})
export class HomePage implements OnInit {

  weeklyStats: Stat[] = [
    { label: 'Bench Press', value: '150kg' },
    { label: 'Squats', value: '200kg' },
    { label: 'Deadlift', value: '220kg' },
    { label: 'Pull Ups', value: 50 },
  ];

  rankProgress = 68; // Example

  // SINGLE CONSTRUCTOR
  constructor(private xpService: XpService) { }

  ngOnInit() {
    // call your XP calculation here if needed
    this.calculateUserXp();
  }

  calculateUserXp() {
    const exercises: Exercise[] = [
      { name: 'Bench Press', weight: 200, reps: 10, sets: 4, typeMultiplier: 1 },
      { name: 'Incline Bench', weight: 200, reps: 10, sets: 4, typeMultiplier: 1 },
      { name: 'Pec Deck', weight: 135, reps: 10, sets: 4, typeMultiplier: 0.9 },
    ];

    const profile: PhysicalProfile = { height: 70, weight: 155, reach: 69 };
    const xp = this.xpService.calculateTotalXp(exercises, profile, 3); // 3-day streak
    console.log('User XP:', xp);
  }

}
