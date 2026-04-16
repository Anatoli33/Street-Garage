import { Component, OnInit, signal, inject } from '@angular/core';
import { deleteQuestion, getQuestions } from '../services/questions.js';
import { CommonModule } from '@angular/common';
import { Question } from '../interfaces/questions.interface.js';
import { RouterModule } from '@angular/router';
import { likeQuestion } from '../services/questions.js';
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

  questions = signal<Question[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  async ngOnInit() {
    await this.loadQuestions();
  }

  async loadQuestions() {
    try {
      const data = await getQuestions();

      // Тук добавяме "филтър", който превръща likes в масив, ако идва като число
      const sanitizedData = data.map((q: Question) => ({
        ...q,
        likes: Array.isArray(q.likes) ? q.likes : [],
      }));

      // Вече подаваме чистите данни
      this.questions.set(sanitizedData);
    } catch (err) {
      console.error(err);
      this.error.set('Failed to load questions');
    } finally {
      this.isLoading.set(false);
    }
  }
  async onDelete(id: string | undefined) {
    if (!id) return;

    const questionToDelete = this.questions().find((q) => q.id === id);
    const currentUser = this.authService.currentUser();

    if (questionToDelete?.ownerId !== currentUser?.uid) {
      alert("You don't have permission to delete this!");
      return;
    }

    const confirmDelete = confirm('Are you sure you want to delete this question?');
    if (!confirmDelete) return;

    try {
      await deleteQuestion(id);

      this.questions.update((questions) => questions.filter((q) => q.id !== id));
    } catch (err) {
      console.error('Error deleting:', err);
      alert('Failed to delete question.');
    }
  }

  async onLike(questionId: string | undefined) {
    const currentUser = this.authService.currentUser();
    if (!questionId || !currentUser) {
      alert('Трябва да сте влезли в профила си, за да харесвате!');
      return;
    }

    const userId = currentUser.uid;

    // Оптимистично обновяване на UI (веднага променяме картинката/броя)
    this.questions.update((questions) =>
      questions.map((q) => {
        if (q.id === questionId) {
          const hasLiked = q.likes?.includes(userId);
          const newLikes = hasLiked
            ? q.likes.filter((id) => id !== userId)
            : [...(q.likes || []), userId];

          return { ...q, likes: newLikes };
        }
        return q;
      }),
    );

    try {
      await likeQuestion(questionId, userId);
    } catch (err) {
      console.error('Грешка при лайкване:', err);
      this.loadQuestions();
    }
  }
}
