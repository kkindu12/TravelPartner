import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-4">
          <div class="card shadow">
            <div class="card-body p-4">
              <h2 class="card-title text-center mb-4">Login</h2>
              <form (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input 
                    type="email" 
                    class="form-control" 
                    id="email" 
                    [(ngModel)]="email"
                    name="email"
                    required
                    placeholder="Enter your email">
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input 
                    type="password" 
                    class="form-control" 
                    id="password" 
                    [(ngModel)]="password"
                    name="password"
                    required
                    placeholder="Enter your password">
                </div>
                <button type="submit" class="btn btn-primary w-100 mb-3">Login</button>
                <div class="text-center">
                  <a routerLink="/home" class="text-decoration-none">Back to Home</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border: none;
      border-radius: 10px;
    }
    .card-title {
      color: #0d6efd;
    }
    .btn-primary {
      background-color: #0d6efd;
      border: none;
      padding: 10px;
      font-weight: 500;
    }
    .btn-primary:hover {
      background-color: #0b5ed7;
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';

  onSubmit() {
    if (this.email && this.password) {
      console.log('Login attempt:', { email: this.email });
      // Add your login logic here
      alert('Login functionality to be implemented');
    }
  }
}

