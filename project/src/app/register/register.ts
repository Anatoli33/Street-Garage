import { Component, signal } from '@angular/core';
import { FormBuilder, Validators, AbstractControl, ValidationErrors, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../services/auth';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';


@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  errorMessage = signal<string | null>(null);
  isLoading = signal(false);

  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rePassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const rePassword = control.get('rePassword')?.value;

    return password === rePassword ? null : { mismatch: true };
  }

async onRegister() {
  if (this.registerForm.invalid) {
    this.registerForm.markAllAsTouched();
    return;
  }

  const { username, email, password } = this.registerForm.value;

  this.isLoading.set(true);
  this.errorMessage.set(null);

  try {
    const userCredential = await createUserWithEmailAndPassword(Auth, email, password);
    await updateProfile(userCredential.user, { displayName: username });
    this.router.navigate(['/']);
  } catch (err: any) {
    console.error(err.code); 

switch (err.code) {
  case 'auth/email-already-in-use':
    this.errorMessage.set('This email address is already in use.');
    break;
  case 'auth/invalid-email':
    this.errorMessage.set('The email address is badly formatted.');
    break;
  case 'auth/operation-not-allowed':
    this.errorMessage.set('Email/password accounts are not enabled. Please contact support.');
    break;
  case 'auth/network-request-failed':
    this.errorMessage.set('Network error. Please check your internet connection.');
    break;
  case 'auth/too-many-requests':
    this.errorMessage.set('Too many attempts. Please try again later.');
    break;
  case 'auth/internal-error':
    this.errorMessage.set('An internal server error occurred. Please try again.');
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