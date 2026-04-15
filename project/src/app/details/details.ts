import { Component, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { getCarById } from '../services/cars';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy
} from 'firebase/firestore';

import { db } from '../services/firestore.js';

@Component({
  selector: 'app-car-details',
  standalone: true,
  imports: [DatePipe, RouterModule, FormsModule],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class CarDetails implements OnInit {
  car = signal<any>(null);

  carId: string = '';

  commentText = '';
  comments = signal<any[]>([]);

  constructor(private route: ActivatedRoute) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.carId = id;

      const data = await getCarById(id);
      this.car.set(data);

      await this.loadComments(id);
    }
  }

  async loadComments(carId: string) {
    const q = query(
      collection(db, `cars/${carId}/comments`),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);

    this.comments.set(
      snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    );
  }

  async addComment() {
    if (!this.commentText.trim()) return;

  
    const user = {
      uid: 'test123',
      displayName: 'Tomi'
    };

    await addDoc(collection(db, `cars/${this.carId}/comments`), {
      text: this.commentText,
      userId: user.uid,
      username: user.displayName,
      createdAt: new Date()
    });

    this.commentText = '';
    await this.loadComments(this.carId);
  }
}