import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { getCarById, updateCar } from '../services/cars';
import { FormsModule } from '@angular/forms';
import { Car } from '../interfaces/car.interface';


@Component({
  selector: 'app-edit-car',
  imports: [FormsModule, RouterModule],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class EditCarComponent implements OnInit {
  carId!: string;

  car: Car = {
    brand: '',
    model: '',
    year: 0,
    description: '',
    image: '',
    createdAt: new Date()
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef 
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.router.navigate(['/feed']);
      return;
    }

    this.carId = id;

    try {
      const data = await getCarById(this.carId);

      if (!data) {
        this.router.navigate(['/feed']);
        return;
      }

      this.car = { ...data };

      this.cdr.detectChanges(); 
      
    } catch (error) {
      console.error('Error loading car:', error);
      this.router.navigate(['/']);
    }
  }

  async onSubmit() {
    try {
      await updateCar(this.carId, this.car);
      this.router.navigate(['/feed']);
    } catch (error) {
      console.error('Error updating car:', error);
      alert('Failed to save changes. Please try again.');
    }
  }
}