import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { addQuestion } from '../services/questions.js';

@Component({
  selector: 'app-questions',
  imports: [ReactiveFormsModule],
  templateUrl: './questions.html',
  styleUrl: './questions.css',
})
export class Questions {
  questionForm: FormGroup;

  constructor(private fb: FormBuilder) {
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

    const questionData = {
      ...this.questionForm.value,
      createdAt: new Date(),
    };

    try {
      await addQuestion(questionData);
      console.log('Question added:', questionData);
      this.questionForm.reset();
      alert('Question posted successfully!');
    } catch (err) {
      console.error('Error adding question:', err);
      alert('Failed to post question.');
    }
  }
}