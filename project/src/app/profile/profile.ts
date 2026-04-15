import { Component, signal, OnInit } from '@angular/core';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

type Tab = 'cars' | 'questions';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {

  auth = getAuth();

  // 🔥 user from firebase (NOT hardcoded)
  user = signal<any>(null);

  selectedTab = signal<Tab>('cars');

  cars = signal([
    {
      id: '1',
      model: 'VW Golf 5',
      description: '1.6 FSI clean build',
      likes: 10,
      ownerId: 'user123'
    }
  ]);

  questions = signal([
    {
      id: '1',
      title: 'Как да направя Golf да пука?',
      description: 'Софтуер или генерация?',
      likes: 5,
      ownerId: 'user123'
    }
  ]);

  ngOnInit() {
    // 🔥 listen for auth changes
    onAuthStateChanged(this.auth, (firebaseUser) => {
      if (firebaseUser) {
        this.user.set({
          id: firebaseUser.uid,
          username: firebaseUser.displayName || firebaseUser.email,
          avatar: firebaseUser.photoURL || 'https://i.pravatar.cc/150'
        });
      } else {
        this.user.set(null);
      }
    });
  }

  setTab(tab: Tab) {
    this.selectedTab.set(tab);
  }
}