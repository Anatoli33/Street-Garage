import { RouterLink } from '@angular/router';
import { Component, signal } from '@angular/core';
import { getCars } from '../services/cars';
import { DatePipe } from '@angular/common';
import { deleteCar } from '../services/cars';
import { likeCar } from '../services/cars';
import { AuthService } from '../services/auth.service.js';

@Component({
  selector: 'app-feed',
  imports: [RouterLink, DatePipe],
  templateUrl: './feed.html',
  styleUrl: './feed.css',
})
export class Feed {
  constructor(
    public authService: AuthService,
  ) {}

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
  async onDelete(id: string) {
  const confirmDelete = confirm('Are you sure you want to delete this car?');

  if (!confirmDelete) return;

  await deleteCar(id);

  
  this.cars.update(cars => cars.filter(c => c.id !== id));
}
async onLike(carId: string) {
  this.cars.update(cars =>
    cars.map(car => {
      if (car.id !== carId) return car;

      const isLiked = car.likedByMe ?? false;

      return {
        ...car,
        likedByMe: !isLiked,
        likes: isLiked
          ? (car.likes || 1) - 1
          : (car.likes || 0) + 1,
      };
    })
  );

  await likeCar(carId);
}
}

