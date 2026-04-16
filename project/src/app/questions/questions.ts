import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { addQuestion } from '../services/questions.js';
import { AuthService } from '../services/auth.service.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './questions.html',
  styleUrl: './questions.css',
})
export class Questions {
  private fb = inject(FormBuilder);
  public authService = inject(AuthService);
  private router = inject(Router);

  questionForm: FormGroup;

  constructor() {
    this.questionForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      tags: [''],
    });
  }

  async onSubmit() {
    if (this.questionForm.invalid) {
      this.questionForm.markAllAsTouched();
      return;
    }

    const user = this.authService.currentUser();

    if (!user) {
      alert('You must be logged in to post a question!');
      return;
    }

    const formValue = this.questionForm.value;

    const questionData = {
      title: formValue.title.trim(),
      description: formValue.description.trim(),
      tags: formValue.tags || '',
      createdAt: new Date(),
      likes: [],
      ownerId: user.uid,
    };

    try {
      await addQuestion(questionData);
      console.log('Question added with owner:', user.uid);
      this.questionForm.reset();
      alert('Question posted successfully!');
      this.router.navigate(['/answers']);
    } catch (err) {
      console.error('Error adding question:', err);
      alert('Failed to post question.');
    }
  }
}
