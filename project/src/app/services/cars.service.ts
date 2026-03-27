import { Injectable } from '@angular/core';
import { Car } from '../interfaces/car.interface';

@Injectable({
  providedIn: 'root'
})
export class CarsService {
  private cars: Car[] = [
 {
      "id": "1",
      "brand": "BMW",
      "model": "330d",
      "year": 2015,
      "description": "Stage 1, 300hp",
      "image": "assets/cars/bmw.jpg"
    },
    {
      "id": "2",
      "brand": "Volkswagen",
      "model": "Golf 5",
      "year": 2007,
      "description": "Clean daily build",
      "image": "assets/cars/golf.jpg"
    },
    {
      "id": "3",
      "brand": "Mercedes-Benz",
      "model": "C63 AMG",
      "year": 2013,
      "description": "V8 power",
      "image": "assets/cars/amg.jpg"
    },
    {
      "id": "4",
      "brand": "Audi",
      "model": "A4",
      "year": 2012,
      "description": "S-line, daily driver",
      "image": "assets/cars/audi.jpg"

    }
  ];

  getAllCars(): Car[] {
    return this.cars;
  }

}