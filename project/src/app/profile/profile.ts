import { Component, signal } from '@angular/core';

type Tab = 'cars' | 'questions';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {

  user = {
    id: 'user123',
    username: 'toli_dev',
    avatar: 'https://i.pravatar.cc/150?img=12'
  };


  selectedTab = signal<Tab>('cars');

  cars = signal([
    {
      id: '1',
      model: 'VW Golf 5',
      description: '1.6 FSI clean build',
      likes: 10,
      ownerId: 'user123'
    },
    {
      id: '2',
      model: 'BMW F10',
      description: 'Stage 1 pops & bangs',
      likes: 25,
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

  setTab(tab: Tab) {
    this.selectedTab.set(tab);
  }
}