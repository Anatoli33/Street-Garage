import { Component, signal, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { getCarById } from '../services/cars';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { collection, addDoc, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';

import { db } from '../services/firestore.js';
import { AuthService } from '../services/auth.service.js';
import { Car } from '../interfaces/car.interface';
import { Comment } from '../interfaces/comment.interface.js'; 
@Component({
  selector: 'app-car-details',
  imports: [DatePipe, RouterModule, FormsModule],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class CarDetails implements OnInit {
  private route = inject(ActivatedRoute);
  public authService = inject(AuthService);

 
  car = signal<Car | null>(null);
  comments = signal<Comment[]>([]);
  
  carId: string = '';
  commentText = '';

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carId = id;
      try {
        const data = await getCarById(id) as Car; 
        this.car.set(data);
        this.loadComments(id);
      } catch (err) {
        console.error(err);
      }
    }
  }

  loadComments(carId: string) {
    const q = query(collection(db, `cars/${carId}/comments`), orderBy('createdAt', 'desc'));

    onSnapshot(q, (snapshot) => {
      const loadedComments: Comment[] = snapshot.docs.map((doc) => {
        const data = doc.data() as Omit<Comment, 'id'>;
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
        };
      });

      this.comments.set(loadedComments);
    });
  }

  async addComment() {
    if (!this.commentText.trim()) return;

    const user = this.authService.currentUser();
    if (!user) return;

    try {
      const newComment: Omit<Comment, 'id'> = {
        text: this.commentText,
        userId: user.uid,
        username: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        createdAt: new Date(), 
      };

      await addDoc(collection(db, `cars/${this.carId}/comments`), newComment);
      this.commentText = '';
    } catch (error) {
      console.error('Error:', error);
    }
  }
}