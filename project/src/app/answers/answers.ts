import { Component, OnInit, signal, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { deleteQuestion, getQuestionsRxJS, likeQuestion } from '../services/questions.js';
import { Question } from '../interfaces/questions.interface.js';
import { AuthService } from '../services/auth.service.js';

@Component({
  selector: 'app-answers',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './answers.html',
  styleUrl: './answers.css',
})
export class Answers implements OnInit {
  public authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);

  questions = signal<Question[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions(): void {
    this.isLoading.set(true);

    getQuestionsRxJS()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data: Question[]) => {
          this.questions.set(data);
          this.isLoading.set(false);
        },
        error: (err: Error) => {
          console.error('RxJS Error:', err);
          this.error.set('Failed to load questions. Please try again later.');
          this.isLoading.set(false);
        }
      });
  }

  async onDelete(id: string | undefined): Promise<void> {
    if (!id) return;

    const questionToDelete = this.questions().find((q) => q.id === id);
    const currentUser = this.authService.currentUser();

    if (questionToDelete?.ownerId !== currentUser?.uid) {
      alert("You don't have permission to delete this question!");
      return;
    }

    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
      await deleteQuestion(id);
      this.questions.update((qs) => qs.filter((q) => q.id !== id));
    } catch (err) {
      alert('An error occurred while trying to delete.');
    }
  }

  async onLike(questionId: string | undefined): Promise<void> {
    const currentUser = this.authService.currentUser();
    if (!questionId || !currentUser) {
      alert('Please log in to like this question!');
      return;
    }

    const userId = currentUser.uid;

    this.questions.update((qs) =>
      qs.map((q) => {
        if (q.id === questionId) {
          const likes = Array.isArray(q.likes) ? q.likes : [];
          const hasLiked = likes.includes(userId);
          const newLikes = hasLiked
            ? likes.filter((id) => id !== userId)
            : [...likes, userId];

          return { ...q, likes: newLikes };
        }
        return q;
      })
    );

    try {
      await likeQuestion(questionId, userId);
    } catch (err) {
      alert('Could not update like.');
      this.loadQuestions();
    }
  }
}