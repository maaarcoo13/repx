import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class FriendsPage implements OnInit {

  selectedSegment: string = 'friends';
  
  // Friend requests data
  friendRequests = [
    { name: 'John Smith', username: '@johnsmith_gym', avatar: 'assets/icon/profile-pic.jpg' },
    { name: 'Lisa Wang', username: '@lisawang_fit', avatar: 'assets/icon/profile-pic.jpg' }
  ];

  // Groups data
  groups = [
    { name: 'Morning Grinders', members: 12, description: 'Early morning workout crew. 6 AM daily sessions!', workouts: 156, status: 'Active' },
    { name: 'Powerlifting Squad', members: 8, description: 'Focused on compound lifts and strength training', workouts: 98, status: 'Active' },
    { name: 'Cardio Warriors', members: 15, description: 'Running, cycling, and HIIT enthusiasts', workouts: 45, status: 'Inactive' },
    { name: 'College Gym Crew', members: 20, description: 'Students supporting each other\'s fitness journey', workouts: 203, status: 'Active' }
  ];

  constructor(
    private toastController: ToastController, 
    private alertController: AlertController,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // Check if we should show groups tab
    this.route.queryParams.subscribe(params => {
      if (params['tab'] === 'groups') {
        this.selectedSegment = 'groups';
      }
    });
  }

  async acceptFriend(name: string) {
    // Remove from friend requests
    this.friendRequests = this.friendRequests.filter(req => req.name !== name);
    
    const toast = await this.toastController.create({
      message: `✅ You are now friends with ${name}!`,
      duration: 2000,
      position: 'top',
      color: 'success'
    });
    toast.present();
  }

  async declineFriend(name: string) {
    // Remove from friend requests
    this.friendRequests = this.friendRequests.filter(req => req.name !== name);
    
    const toast = await this.toastController.create({
      message: `❌ Friend request from ${name} declined`,
      duration: 2000,
      position: 'top',
      color: 'medium'
    });
    toast.present();
  }

  async viewProfile(name: string) {
    const toast = await this.toastController.create({
      message: `👤 Viewing ${name}'s profile...`,
      duration: 1500,
      position: 'bottom',
      color: 'dark'
    });
    toast.present();
  }

  async openChat(name: string) {
    const toast = await this.toastController.create({
      message: `💬 Chat feature coming soon! (No database yet)`,
      duration: 2000,
      position: 'bottom',
      color: 'warning'
    });
    toast.present();
  }

  async createGroup() {
    const alert = await this.alertController.create({
      header: 'Create New Group',
      inputs: [
        {
          name: 'groupName',
          type: 'text',
          placeholder: 'Group Name',
          attributes: {
            maxlength: 30
          }
        },
        {
          name: 'description',
          type: 'textarea',
          placeholder: 'Description',
          attributes: {
            maxlength: 100
          }
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Create',
          handler: (data) => {
            if (data.groupName && data.groupName.trim()) {
              // Add new group to the list
              this.groups.unshift({
                name: data.groupName,
                members: 1,
                description: data.description || 'No description',
                workouts: 0,
                status: 'Active'
              });
              
              // Show success message
              this.toastController.create({
                message: `✅ Group "${data.groupName}" created!`,
                duration: 2000,
                position: 'top',
                color: 'success'
              }).then(toast => toast.present());
              
              return true;
            } else {
              // Show error if name is empty
              this.toastController.create({
                message: '❌ Please enter a group name',
                duration: 2000,
                position: 'top',
                color: 'danger'
              }).then(toast => toast.present());
              return false;
            }
          }
        }
      ]
    });
    
    await alert.present();
  }

}
