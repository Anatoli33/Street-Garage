import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { getQuestionById, updateQuestion } from '../services/questions';

@Component({
  selector: 'app-edit-question',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './edit-question.html',
  styleUrl: './edit-question.css',
})
export class EditQuestionComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);

  questionId!: string;
  questionForm: FormGroup;

  constructor() {

    this.questionForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      tags: [''],
    });
  }

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


      this.questionForm.patchValue({
        title: data.title,
        description: data.description,
        tags: data.tags 
      });

      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading question:', error);
      this.router.navigate(['/answers']);
    }
  }

  async onSubmit() {
    if (this.questionForm.invalid) {
      this.questionForm.markAllAsTouched();
      return;
    }

    try {
      const updatedData = this.questionForm.value;
      await updateQuestion(this.questionId, updatedData);
      this.router.navigate(['/answers']);
    } catch (error) {
      console.error('Error updating question:', error);
      alert('Failed to save changes. Please try again.');
    }
  }
}