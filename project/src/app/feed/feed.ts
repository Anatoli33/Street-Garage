import { RouterLink } from '@angular/router';
import { Component, signal } from '@angular/core';
import { getCars, deleteCar, likeCar } from '../services/cars';
import { DatePipe } from '@angular/common';
import { AuthService } from '../services/auth.service.js';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './feed.html',
  styleUrl: './feed.css',
})
export class Feed {

  constructor(public authService: AuthService) {}

  cars = signal<any[]>([]);
  isLoading = signal(true);

  async ngOnInit() {
    try {
      const data = await getCars();
      this.cars.set(data);
    } catch (err) {
      console.error(err);
    } finally {
      this.isLoading.set(false);
    }
  }

  async onDelete(id: string) {
    const confirmDelete = confirm('Delete this car?');
    if (!confirmDelete) return;

    await deleteCar(id);

    this.cars.update(c => c.filter(x => x.id !== id));
  }


async onLike(carId: string) {

  let currentState = false;

  this.cars.update(cars =>
    cars.map(car => {
      if (car.id !== carId) return car;

      currentState = car.liked ?? false;

      return {
        ...car,
        liked: !currentState,
        likes: currentState
          ? (car.likes || 1) - 1
          : (car.likes || 0) + 1
      };
    })
  );

  await likeCar(carId, currentState);
}
}