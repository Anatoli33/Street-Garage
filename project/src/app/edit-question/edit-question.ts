import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { getQuestionById, updateQuestion } from '../services/questions';
import { Question } from '../interfaces/questions.interface.js';

@Component({
  selector: 'app-edit-question',
  imports: [FormsModule, RouterModule],
  templateUrl: './edit-question.html',
  styleUrl: './edit-question.css',
})
export class EditQuestionComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  questionId!: string;

  question: Question = {
    id: '',
    title: '',
    description: '',
    tags: '',
    likes: 0,
    createdAt: new Date(),
  };

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.router.navigate(['/answers']);
      return;
    }

    this.questionId = id;

    try {
      const data = await getQuestionById(id);

      if (!data) {
        this.router.navigate(['/answers']);
        return;
      }

      this.question = {
        ...this.question,
        ...data,
        id: id,
      } as Question;

      this.cdr.detectChanges();
    } catch (error) {
      console.error('Грешка при зареждане:', error);
      this.router.navigate(['/answers']);
    }
  }

  async onSubmit() {
    try {
      await updateQuestion(this.questionId, this.question);
      this.router.navigate(['/answers']);
    } catch (error) {
      console.error('Грешка при обновяване:', error);
    }
  }
}
