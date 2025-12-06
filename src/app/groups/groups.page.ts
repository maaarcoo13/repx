import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs
} from '@angular/fire/firestore';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.page.html',
  styleUrls: ['./groups.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class GroupsPage implements OnInit {

  currentUsername: string = '';

  groups: any[] = [];
  filteredGroups: any[] = [];

  searchQuery: string = '';

  showJoinInput: boolean = false;
  joinGroupName: string = '';

  selectedSegment: string = 'groups'; // default segment

  constructor(
    private firestore: Firestore,
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.currentUsername = localStorage.getItem('currentUsername') || '';
    if (!this.currentUsername) return;

    this.loadGroups();
  }

  /** Segment change handler */
  segmentChanged(event: any) {
    const value = event.detail.value;
    if (value === 'friends') {
      this.router.navigate(['/friends']);
    }
    // 'groups' stays on this page
  }

  /** Load User Groups */
  async loadGroups() {
    const userGroupsRef = collection(
      this.firestore,
      `users/${this.currentUsername}/Groups`
    );

    const snap = await getDocs(userGroupsRef);

    this.groups = snap.docs.map(docSnap => ({
      groupName: docSnap.id,
      status: docSnap.data()['Status'] || 'Member'
    }));

    this.applyFilter();
  }

  /** Filter Groups */
  applyFilter() {
    const q = this.searchQuery.toLowerCase();
    this.filteredGroups = this.groups.filter(g =>
      g.groupName.toLowerCase().includes(q)
    );
  }

  /** Navigate to Group View */
  openGroupView(groupName: string) {
    this.router.navigate(['/groupsview'], {
      queryParams: { name: groupName }
    });
  }

  /** Toggle Join Input */
  toggleJoinInput() {
    this.showJoinInput = !this.showJoinInput;
    this.joinGroupName = '';
  }

  /** Join Group */
  async joinGroup() {
    const groupName = this.joinGroupName.trim();
    if (!groupName) return;

    const groupRef = doc(this.firestore, `Groups/${groupName}`);
    const exists = await getDoc(groupRef);

    if (!exists.exists()) {
      this.showToast('❌ Group does not exist');
      return;
    }

    // Get user XP
    const userRef = doc(this.firestore, `users/${this.currentUsername}`);
    const userSnap = await getDoc(userRef);
    const xp = userSnap.exists() ? (userSnap.data()['xp'] || 0) : 0;

    // Add to global Groups/Members
    const memberRef = doc(
      this.firestore,
      `Groups/${groupName}/Members/${this.currentUsername}`
    );
    await setDoc(memberRef, { status: 'Pending', xp });

    // Add to user's Groups
    const userGroupRef = doc(
      this.firestore,
      `users/${this.currentUsername}/Groups/${groupName}`
    );
    await setDoc(userGroupRef, { Status: 'Pending' });

    this.showToast(`⏳ Requested to join ${groupName}`);
    this.showJoinInput = false;
    this.loadGroups();
  }

  /** Create Group */
  async openCreateGroupPrompt() {
    const alert = await this.alertCtrl.create({
      header: 'Create Group',
      message: 'Enter group name:',
      inputs: [
        { name: 'groupName', type: 'text', placeholder: 'Group name' }
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Create',
          handler: async (data) => {
            const groupName = data.groupName?.trim();
            if (groupName) this.createGroup(groupName);
          }
        }
      ]
    });

    await alert.present();
  }

  async createGroup(groupName: string) {
    // Global Groups
    const groupRef = doc(this.firestore, `Groups/${groupName}`);
    await setDoc(groupRef, {
      CreatedBy: this.currentUsername
    });

    // User XP
    const userRef = doc(this.firestore, `users/${this.currentUsername}`);
    const userSnap = await getDoc(userRef);
    const xp = userSnap.exists() ? (userSnap.data()['xp'] || 0) : 0;

    // Add leader in global Members
    const memberRef = doc(
      this.firestore,
      `Groups/${groupName}/Members/${this.currentUsername}`
    );
    await setDoc(memberRef, { status: 'Leader', xp });

    // Add group to user
    const userGroupRef = doc(
      this.firestore,
      `users/${this.currentUsername}/Groups/${groupName}`
    );
    await setDoc(userGroupRef, { Status: 'Leader' });

    this.showToast(`🎉 Group "${groupName}" created!`);
    this.loadGroups();
  }

  /** Toast Helper */
  async showToast(message: string) {
    const t = await this.toastCtrl.create({
      message,
      duration: 1800,
      color: 'success',
      position: 'top'
    });
    t.present();
  }
}