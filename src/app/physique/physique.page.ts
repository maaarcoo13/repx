import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-physique',
  templateUrl: './physique.page.html',
  styleUrls: ['./physique.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class PhysiquePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
