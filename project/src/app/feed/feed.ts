import { RouterLink } from '@angular/router';
import { Component, signal } from '@angular/core';
import { getCars } from '../services/cars';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-feed',
  imports: [RouterLink, DatePipe],
  templateUrl: './feed.html',
  styleUrl: './feed.css',
})
export class Feed {
  cars = signal<any[]>([]);
  isLoading = signal(true);

  async ngOnInit() {
    try {
      const data = await getCars();
      this.cars.set(data);
    } catch (err) {
      console.error('Error loading cars:', err);
    } finally {
      this.isLoading.set(false);
    }
  }
}
// import { Component } from '@angular/core';
// import { CarsService } from '../services/cars.service';
// import { Car } from '../interfaces/car.interface';

// @Component({
//   selector: 'app-feed',
//   imports: [RouterLink],
//   templateUrl: './feed.html',
//   styleUrl: './feed.css',
// })
// export class Feed {
//     cars: Car[] = [];

//     constructor(private carsService: CarsService){
//       this.cars = this.carsService.getAllCars();
//     }
// }
