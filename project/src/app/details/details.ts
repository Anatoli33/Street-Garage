import { Component, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { getCarById } from '../services/cars';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { onSnapshot } from 'firebase/firestore';

import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy
} from 'firebase/firestore';

import { db } from '../services/firestore.js';
import { AuthService } from '../services/auth.service.js';

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

  constructor(
    private route: ActivatedRoute,
    public authService: AuthService
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.carId = id;

      const data = await getCarById(id);
      this.car.set(data);

      this.loadComments(id); // ✅ без await
    }
  }

  loadComments(carId: string) {
    const q = query(
      collection(db, `cars/${carId}/comments`),
      orderBy('createdAt', 'desc')
    );

    onSnapshot(q, (snapshot) => {
      this.comments.set(
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      );
    });
  }

  async addComment() {
    if (!this.commentText.trim()) return;

    const user = this.authService.currentUser();
    if (!user) return;

    await addDoc(collection(db, `cars/${this.carId}/comments`), {
      text: this.commentText,
      userId: user.uid,
      username: user.displayName || user.email,
      createdAt: new Date()
    });

    this.commentText = ''; // ✅ това е достатъчно
  }
}