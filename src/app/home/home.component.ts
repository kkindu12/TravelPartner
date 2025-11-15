import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="hero-section text-center py-5 mb-5">
      <div class="container">
        <h1 class="display-4 fw-bold mb-3">Welcome to TravelPartner</h1>
        <p class="lead mb-4">Your perfect companion for planning amazing trips</p>
        <a routerLink="/bus-timetable" class="btn btn-primary btn-lg me-2">
          <i class="bi bi-bus-front me-2"></i>View Bus Timetable
        </a>
        <a routerLink="/login" class="btn btn-outline-primary btn-lg">Get Started</a>
      </div>
    </div>

    <div class="container">
      <div class="row g-4 mb-5 justify-content-center">
        <div class="col-md-6 col-lg-4">
          <div class="card h-100 shadow-sm border-primary">
            <div class="card-body text-center">
              <i class="bi bi-bus-front-fill display-4 text-primary mb-3"></i>
              <h5 class="card-title">Bus Timetable</h5>
              <p class="card-text">View all express highway bus services from Matara with real-time schedules.</p>
            </div>
          </div>
        </div>
        <div class="col-md-6 col-lg-4">
          <div class="card h-100 shadow-sm">
            <div class="card-body text-center">
              <i class="bi bi-star-fill display-4 text-primary mb-3"></i>
              <h5 class="card-title">Share Experiences</h5>
              <p class="card-text">Share your travel experiences, photos, and recommendations with the community.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-body p-4">
              <h3 class="card-title mb-3">Ready to Start Your Journey?</h3>
              <p class="card-text mb-3">Join thousands of travelers who are already using TravelPartner to plan their perfect trips.</p>
              <a routerLink="/login" class="btn btn-primary">Sign In Now</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hero-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 0 0 20px 20px;
    }
    .card {
      border: none;
      border-radius: 10px;
      transition: transform 0.3s ease;
    }
    .card:hover {
      transform: translateY(-5px);
    }
    .btn-primary {
      background-color: #0d6efd;
      border: none;
      padding: 12px 30px;
      font-weight: 500;
    }
    .btn-primary:hover {
      background-color: #0b5ed7;
    }
    .btn-outline-primary {
      border-color: white;
      color: white;
      padding: 12px 30px;
      font-weight: 500;
    }
    .btn-outline-primary:hover {
      background-color: white;
      color: #667eea;
    }
  `]
})
export class HomeComponent {
  exploreFeatures() {
    alert('Feature exploration coming soon!');
  }
}

