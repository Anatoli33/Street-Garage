import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getCarById, updateCar } from '../services/cars';
import { FormsModule } from '@angular/forms';
import { Car } from '../interfaces/car.interface';


@Component({
  selector: 'app-edit-car',
  standalone: true, 
  imports: [FormsModule],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class EditCarComponent {

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
    private router: Router
  ) {}

async ngOnInit() {
  const id = this.route.snapshot.paramMap.get('id');

  if (!id) {
    this.router.navigate(['/']);
    return;
  }

  this.carId = id;
;

 const data = await getCarById(this.carId);

if (!data) {
  this.router.navigate(['/']);
  return;
}

this.car.brand = data.brand;
this.car.model = data.model;
this.car.year = data.year;
this.car.image = data.image;
this.car.description = data.description;


}
  async onSubmit() {
    await updateCar(this.carId, this.car);
    this.router.navigate(['/']);
  }
}