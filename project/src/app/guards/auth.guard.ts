import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take, switchMap, from, of } from 'rxjs';
import { getQuestionById } from '../services/questions.js';
import { getCarById } from '../services/cars.js';

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return toObservable(authService.currentUser).pipe(
    filter((user) => user !== undefined), 
    take(1),                               
    map((user) => {
      if (user) {
        router.navigate(['/']); 
        return false;
      }
      return true; 
    })
  );
};

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return toObservable(authService.currentUser).pipe(
    filter((user) => user !== undefined),
    take(1),
    map((user) => {
      if (!user) {
        router.navigate(['/login']);
        return false;
      }
      return true; 
    })
  );
};
export const isOwnerGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const id = route.paramMap.get('id');
  const resourceType = route.data['resourceType']; 

  if (!id) {
    router.navigate(['/']);
    return of(false);
  }

  return toObservable(authService.currentUser).pipe(
    filter((user) => user !== undefined),
    take(1),
    switchMap((user) => {
      if (!user) {
        router.navigate(['/login']);
        return of(false);
      }
      const fetchFunction = resourceType === 'cars' ? getCarById(id) : getQuestionById(id);

      return from(fetchFunction).pipe(
        map((item: any) => {
          if (item && item.ownerId === user.uid) {
            return true;
          }

          alert("You do not have permission to edit this item!");
          router.navigate([resourceType === 'cars' ? '/feed' : '/answers']);
          return false;
        })
      );
    })
  );
};