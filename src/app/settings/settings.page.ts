import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class SettingsPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {}

  // Navigate to Account page
  goToAccount() {
    this.router.navigate(['/account']);
  }

  // Navigate to Privacy page
  goToPrivacy() {
    this.router.navigate(['/privacy']);
  }

}