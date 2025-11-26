import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-routine',
  templateUrl: './routine.page.html',
  styleUrls: ['./routine.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class RoutinePage implements OnInit {

  constructor(private toastController: ToastController) { }

  ngOnInit() {
  }

  async createRoutine() {
    const toast = await this.toastController.create({
      message: '➕ Create Routine feature coming soon!',
      duration: 2000,
      position: 'top',
      color: 'primary'
    });
    toast.present();
  }

  async startRoutine(routineName: string) {
    const toast = await this.toastController.create({
      message: `▶️ Starting ${routineName}...`,
      duration: 1500,
      position: 'bottom',
      color: 'success'
    });
    toast.present();
  }

  async editRoutine(routineName: string) {
    const toast = await this.toastController.create({
      message: `✏️ Editing ${routineName}...`,
      duration: 1500,
      position: 'bottom',
      color: 'dark'
    });
    toast.present();
  }

}
