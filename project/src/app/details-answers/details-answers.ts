import { Component, inject, signal, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { getQuestionById } from '../services/questions';
import { AuthService } from '../services/auth.service.js';
import { db } from '../services/firestore.js';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  Timestamp 
} from 'firebase/firestore';

@Component({
  selector: 'app-question-details',
  standalone: true,
  imports: [RouterModule, FormsModule, DatePipe],
  styleUrl: './details-answers.css',
  templateUrl: './details-answers.html',
})
export class DetailsAnswersComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  public authService = inject(AuthService);

  question = signal<any>(null);
  questionId: string = '';
  
  commentText = '';
  comments = signal<any[]>([]);

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.questionId = id;
      
      try {
        const data = await getQuestionById(id);
        this.question.set(data);
        this.loadComments(id);
        this.cdr.detectChanges();
      } catch (error) {
        console.error("Грешка при зареждане на въпроса:", error);
      }
    }
  }

  loadComments(id: string) {
    const q = query(
      collection(db, `questions/${id}/comments`),
      orderBy('createdAt', 'desc')
    );

    onSnapshot(q, (snapshot) => {
      const loadedComments = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data['createdAt'] instanceof Timestamp ? data['createdAt'].toDate() : new Date()
        };
      });

      this.comments.set(loadedComments);
      

      this.cdr.detectChanges();
    });
  }

  async addComment() {
    if (!this.commentText.trim()) return;

    const user = this.authService.currentUser();
    if (!user) return;

    try {
      await addDoc(collection(db, `questions/${this.questionId}/comments`), {
        text: this.commentText,
        userId: user.uid,
        username: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        createdAt: new Date()
      });

      this.commentText = '';
    } catch (error) {
      console.error("Грешка при добавяне на коментар:", error);
    }
  }
}