import { RouterLink } from '@angular/router';
import { Component, signal } from '@angular/core';
import { getCars, deleteCar, toggleLikeCar } from '../services/cars';
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
  const user = this.authService.currentUser();
  if (!user) {
    alert('Моля, влезте в профила си, за да харесвате!');
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
        ? likedBy.filter((id: string) => id !== userId)
        : [...likedBy, userId]; 

      return {
        ...car,
        likedBy: newLikedBy,
        likes: wasLikedAlready ? (car.likes - 1) : (car.likes + 1)
      };
    })
  );

  try {
    await toggleLikeCar(carId, userId, wasLikedAlready);
  } catch (err) {
    console.error("Грешка при лайкване:", err);

  }
}

}