import { Component, OnInit, signal } from '@angular/core';
import { deleteQuestion, getQuestions } from '../services/questions.js';
import { CommonModule, DatePipe } from '@angular/common';
import { Question } from '../interfaces/questions.interface.js';
import { RouterModule } from '@angular/router';
import { likeQuestion } from '../services/questions.js';

@Component({
  selector: 'app-answers',
  imports: [DatePipe, CommonModule, RouterModule],
  templateUrl: './answers.html',
  styleUrl: './answers.css',
})
export class Answers implements OnInit {
  questions = signal<Question[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  async loadQuestions() {
    try {
      const data = await getQuestions();
      this.questions.set(data);
    } catch (err) {
      console.error(err);
      this.error.set('Failed to load questions');
    } finally {
      this.isLoading.set(false);
    }
  }

  ngOnInit() {
    this.loadQuestions();
  }
  async onDelete(id: string) {
    const confirmDelete = confirm('Are you sure you want to delete this car?');
  
    if (!confirmDelete) return;
  
    await deleteQuestion(id);
  
    
    this.questions.update(questions => questions.filter(q => q.id !== id));
  }
async onLike(questionId: string) {
  this.questions.update(questions =>
    questions.map(question =>
      question.id === questionId
        ? { ...question, likes: (question.likes || 0) + 1 }
        : question
    )
  );

  await likeQuestion(questionId);
}
}