import { Routes } from '@angular/router';
import { Home } from './home/home.js';
import { Feed } from './feed/feed.js';
import { Login } from './login/login.js';
// import { Details } from './details/details.js';
import { Register } from './register/register.js';
import { Create } from './create/create.js';
import { NotFound } from './not-found/not-found.js';

// import { carResolver } from './guards/car.resolver.js';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'feed', component: Feed},
    {path: 'register', component: Register},
    {path: 'create', component: Create},
    //  {
    // path: 'feed/:id',
    // component: Details,
    // resolve: { car: carResolver },
    // },
    {path: 'login', component: Login},
    {path: '**', component: NotFound},
];
