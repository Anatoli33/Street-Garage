import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { addCar } from '../services/cars.js';
import { Car } from '../interfaces/car.interface'; 

@Component({
  selector: 'app-create',
  imports: [ReactiveFormsModule],
  templateUrl: './create.html',
  styleUrl: './create.css',
})
export class Create {
  createForm: FormGroup;
  currentYear = new Date().getFullYear();

  constructor(private fb: FormBuilder) {
    this.createForm = this.fb.group({
      brand: ['', [Validators.required, Validators.minLength(2)]],
      model: ['', [Validators.required, Validators.minLength(1)]],
      year: [
        '',
        [Validators.required, Validators.min(1900), Validators.max(this.currentYear)],
      ],
      image: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      tags: [''], 
    });
  }

  async onCreate() {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    const formValue = this.createForm.value;

    const carData: Car = {
      brand: formValue.brand.trim(),
      model: formValue.model.trim(),
      year: formValue.year,
      image: formValue.image.trim(),
      description: formValue.description.trim(),
      tags: formValue.tags
        ? formValue.tags.split(',').map((t: string) => t.trim())
        : [],
      createdAt: new Date(),
    };

    try {
      await addCar(carData);
      console.log('Car added to Firebase:', carData);
      this.createForm.reset();
      alert('Car successfully added!');
    } catch (err) {
      console.error('Error adding car:', err);
      alert('Failed to add car. Check console for details.');
    }
  }
}