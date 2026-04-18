import { Component, inject, signal, OnInit } from '@angular/core';
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
import { Question } from '../interfaces/questions.interface';
import { Comment } from '../interfaces/comment.interface.js';

@Component({
  selector: 'app-question-details',
  imports: [RouterModule, FormsModule, DatePipe],
  styleUrl: './details-answers.css',
  templateUrl: './details-answers.html',
})
export class DetailsAnswersComponent implements OnInit {
  private route = inject(ActivatedRoute);
  public authService = inject(AuthService);

  question = signal<Question | null>(null);
  questionId: string = '';
  
  commentText: string = '';
  comments = signal<Comment[]>([]);

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.questionId = id;
      
      try {
        const data = await getQuestionById(id);
        if (data) {

          this.question.set(data as Question);
          this.loadComments(id);
        }
      } catch (error) {

        console.error("Error loading question:", error);
      }
    }
  }

  loadComments(id: string): void {
    const q = query(
      collection(db, `questions/${id}/comments`),
      orderBy('createdAt', 'desc')
    );

    onSnapshot(q, (snapshot) => {
      const loadedComments: Comment[] = snapshot.docs.map(doc => {
        const data = doc.data() as Comment;
        
        const rawDate = data.createdAt;
        const normalizedDate = rawDate instanceof Timestamp ? rawDate.toDate() : new Date();

        return {
          id: doc.id,
          ...data,
          createdAt: normalizedDate
        };
      });

      this.comments.set(loadedComments);
    });
  }

  async addComment(): Promise<void> {
    if (!this.commentText.trim()) return;

    const user = this.authService.currentUser();
    if (!user) return;

    try {
      const newComment: Omit<Comment, 'id'> = {
        text: this.commentText,
        userId: user.uid,
        username: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        createdAt: new Date()
      };

      await addDoc(collection(db, `questions/${this.questionId}/comments`), newComment);
      this.commentText = '';
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  }
}