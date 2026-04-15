import { Routes } from '@angular/router';
import { Home } from './home/home.js';
import { Feed } from './feed/feed.js';
import { Login } from './login/login.js';
// import { Details } from './details/details.js';
import { Register } from './register/register.js';
import { Create } from './create/create.js';
import { NotFound } from './not-found/not-found.js';
// import { carResolver } from './guards/car.resolver.js';
import { Questions } from './questions/questions';
import { Answers } from './answers/answers';
import { guestGuard } from './guards/auth.guard.js';
import { authGuard } from './guards/auth.guard.js';
import { EditCarComponent } from './edit/edit.js';
import { Profile } from './profile/profile';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'feed', component: Feed },
  { path: 'answers', component: Answers }, 
  {
  path: 'cars/:id',
  loadComponent: () => import('./details/details').then(m => m.CarDetails)
  },
  {
  path: 'questions/:id',
  loadComponent: () =>
    import('./details-answers/details-answers')
  .then(m => m.DetailsAnswersComponent)
  },

  
  { path: 'register', component: Register, canActivate: [guestGuard]},
  { path: 'login', component: Login, canActivate: [guestGuard] },

  
  { path: 'create', component: Create, canActivate: [authGuard] },
  { path: 'questions', component: Questions, canActivate: [authGuard] },
  { path: 'profile', component: Profile, canActivate: [authGuard] },
  {
  path: 'cars/:id/edit',
  component: EditCarComponent
  },

  { path: '**', component: NotFound },
];
