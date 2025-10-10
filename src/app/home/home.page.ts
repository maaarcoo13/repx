import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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

  constructor() { }

  ngOnInit() { }
}
