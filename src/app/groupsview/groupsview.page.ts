import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Firestore, collection, doc, getDocs, setDoc, deleteDoc, getDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-groupsview',
  templateUrl: './groupsview.page.html',
  styleUrls: ['./groupsview.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class GroupsviewPage implements OnInit {

  groupName: string = '';
  currentUsername: string = '';
  isLeader: boolean = false;

  members: any[] = [];
  pendingRequests: any[] = [];

  constructor(
    private firestore: Firestore,
    private route: ActivatedRoute,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  async ngOnInit() {
    this.currentUsername = localStorage.getItem('currentUsername') || '';
    this.route.queryParams.subscribe(params => {
      this.groupName = params['name'] || '';
      if (this.groupName) this.loadGroupData();
    });
  }

  async loadGroupData() {
    const membersRef = collection(this.firestore, `Groups/${this.groupName}/Members`);
    const snap = await getDocs(membersRef);

    this.members = await Promise.all(snap.docs.map(async docSnap => {
      const username = docSnap.id;

      // Obtener la XP real del usuario desde users/username/xp
      const userRef = doc(this.firestore, `users/${username}`);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();
      const xp = Math.round(userData?.['xp'] || 0); // redondeo a entero

      const status = docSnap.data()['status'] || 'Member';

      return {
        username,
        xp,
        status
      };
    }));

    // Ordenar miembros por XP descendente
    this.members.sort((a, b) => b.xp - a.xp);

    // Determinar si el usuario actual es líder
    const currentMember = this.members.find(m => m.username === this.currentUsername);
    this.isLeader = currentMember?.status === 'Leader';

    // Filtrar solicitudes pendientes
    this.pendingRequests = this.members.filter(m => m.status === 'Pending');
  }

  /** Accept a pending member */
  async acceptRequest(username: string) {
    const memberRef = doc(this.firestore, `Groups/${this.groupName}/Members/${username}`);
    await setDoc(memberRef, { status: 'Member', xp: this.members.find(m => m.username === username)?.xp || 0 });

    const userGroupRef = doc(this.firestore, `users/${username}/Groups/${this.groupName}`);
    await setDoc(userGroupRef, { Status: 'Member' });

    this.showToast(`${username} accepted!`);
    this.loadGroupData();
  }

  /** Decline a pending member */
  async declineRequest(username: string) {
    const memberRef = doc(this.firestore, `Groups/${this.groupName}/Members/${username}`);
    await deleteDoc(memberRef);

    const userGroupRef = doc(this.firestore, `users/${username}/Groups/${this.groupName}`);
    await deleteDoc(userGroupRef);

    this.showToast(`${username} declined.`);
    this.loadGroupData();
  }

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
