import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  username = '';

  password = '';

  errorMessage = '';

  isLoading = false;

  rememberMe: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(): void {

    this.errorMessage = '';

    if (!this.username.trim() || !this.password.trim()) {

      this.errorMessage =
        'Username and password are required.';

      return;
    }

    this.isLoading = true;

    this.authService
      .login({
        username: this.username,
        password: this.password
      })
      .subscribe({

        next: (response) => {

          console.log(
            'Login successful:',
            response
          );

          console.log(
            'JWT Token:',
            response.token
          );

          this.isLoading = false;

          // Navigate to Dashboard
          this.router.navigate(['/']);

        },

        error: (err) => {

          console.error(
            'Login failed:',
            err
          );

          this.isLoading = false;

          if (
            err.status === 401 ||
            err.status === 403
          ) {

            this.errorMessage =
              'Invalid username or password.';

          } else {

            this.errorMessage =
              'Unable to login. Please try again.';

          }

        }

      });
  }
}