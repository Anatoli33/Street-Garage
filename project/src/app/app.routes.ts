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
// import { guestGuard } from './guards/auth.guard.js';
import { authGuard } from './guards/auth.guard.js';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'feed', component: Feed },
  { path: 'answers', component: Answers }, 

  
  { path: 'register', component: Register},
  { path: 'login', component: Login },

  
  { path: 'create', component: Create, canActivate: [authGuard] },
  { path: 'questions', component: Questions, canActivate: [authGuard] },

  { path: '**', component: NotFound },
];
