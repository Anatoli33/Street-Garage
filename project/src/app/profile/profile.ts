import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service.js';
import { getCars } from '../services/cars.js';
import { getQuestions } from '../services/questions.js';
import { Car } from '../interfaces/car.interface.js';
import { Question } from '../interfaces/questions.interface.js';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  public authService = inject(AuthService);
  
  allCars = signal<Car[]>([]);
  allQuestions = signal<Question[]>([]);
  selectedTab = signal<'cars' | 'questions'>('cars');
  isLoading = signal(true);


  user = computed(() => this.authService.currentUser());


  userCars = computed(() => 
    this.allCars().filter(car => car.ownerId === this.user()?.uid)
  );


  userQuestions = computed(() => 
    this.allQuestions().filter(q => q.ownerId === this.user()?.uid)
  );

  async ngOnInit() {
    try {

      const carsData = await getCars() as Car[];
      const questionsData = await getQuestions() as Question[];
      
      this.allCars.set(carsData);
      this.allQuestions.set(questionsData);
    } catch (error) {
      console.error("Грешка при зареждане на профила:", error);
    } finally {
      this.isLoading.set(false);
    }
  }

  setTab(tab: 'cars' | 'questions') {
    this.selectedTab.set(tab);
  }
}