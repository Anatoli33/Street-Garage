import { RouterLink } from '@angular/router';
import { Component, signal, OnInit, inject } from '@angular/core';
import { getCars, deleteCar, toggleLikeCar } from '../services/cars';
import { DatePipe } from '@angular/common';
import { AuthService } from '../services/auth.service.js';
import { Car } from '../interfaces/car.interface'; 

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './feed.html',
  styleUrl: './feed.css',
})
export class Feed implements OnInit {
  public authService = inject(AuthService);

  cars = signal<Car[]>([]);
  isLoading = signal(true);

  async ngOnInit(): Promise<void> {
    try {
      const data = await getCars();
      this.cars.set(data as Car[]);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      this.isLoading.set(false);
    }
  }

  async onDelete(id: string): Promise<void> {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    try {
      await deleteCar(id);
      this.cars.update(cars => cars.filter(car => car.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
      alert('An error occurred while trying to delete the listing.');
    }
  }

  async onLike(carId: string): Promise<void> {
    const user = this.authService.currentUser();
    if (!user) {
      alert('Please log in to like this car!');
      return;
    }

    const userId = user.uid;
    let wasLikedAlready = false;

    this.cars.update(cars =>
      cars.map(car => {
        if (car.id !== carId) return car;

        const likedBy = car.likedBy || [];
        wasLikedAlready = likedBy.includes(userId);

        const newLikedBy = wasLikedAlready
          ? likedBy.filter(id => id !== userId)
          : [...likedBy, userId]; 

        const currentLikes = car.likes || 0;

        return {
          ...car,
          likedBy: newLikedBy,
          likes: wasLikedAlready ? (currentLikes - 1) : (currentLikes + 1)
        } as Car;
      })
    );

    try {
      await toggleLikeCar(carId, userId, wasLikedAlready);
    } catch (err) {
      console.error("Like error:", err);
      alert('Something went wrong while processing your like.');
      const data = await getCars();
      this.cars.set(data as Car[]);
    }
  }
}