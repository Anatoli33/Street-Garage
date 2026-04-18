import { Component, signal } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { Auth } from '../services/auth';
import { signInWithEmailAndPassword } from 'firebase/auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  errorMessage = signal<string | null>(null);
  isLoading = signal(false);

  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

async onLogin() {
  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  const { email, password } = this.loginForm.value;

  this.isLoading.set(true);
  this.errorMessage.set(null);

try {
  await signInWithEmailAndPassword(Auth, email, password);
  this.router.navigate(['/']); 
} catch (err: unknown) {
  const errorCode = (err as { code?: string }).code;

  console.error('Login error code:', errorCode);

  switch (errorCode) {
    case 'auth/invalid-credential':
      this.errorMessage.set('Invalid email or password. Please try again.');
      break;
    case 'auth/too-many-requests':
      this.errorMessage.set('Access to this account has been temporarily disabled due to many failed login attempts.');
      break;
    case 'auth/network-request-failed':
      this.errorMessage.set('Network error. Please check your internet connection.');
      break;
    default:
      this.errorMessage.set('An unexpected error occurred. Please try again.');
      break;
  }
} finally {
  this.isLoading.set(false);
}
}
}