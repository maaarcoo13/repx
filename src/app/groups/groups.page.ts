import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.page.html',
  styleUrls: ['./groups.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class GroupsPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    // Redirect to friends page with groups tab selected
    setTimeout(() => {
      this.router.navigate(['/friends'], { queryParams: { tab: 'groups' } });
    }, 100);
  }

}
