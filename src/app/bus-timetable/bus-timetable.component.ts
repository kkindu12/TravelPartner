import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BusTimetableService, BusSchedule } from '../services/bus-timetable.service';

@Component({
  selector: 'app-bus-timetable',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container py-4">
      <div class="row mb-4">
        <div class="col-12">
          <h1 class="display-5 fw-bold mb-3">
            <i class="bi bi-bus-front me-2"></i>Highway Bus Timetable
          </h1>
          <p class="lead text-muted">Express services departing from Matara</p>
        </div>
      </div>

      <!-- Date Picker and Filter Section -->
      <div class="card shadow-sm mb-4">
        <div class="card-body">
          <div class="row g-3 align-items-end">
            <div class="col-md-4">
              <label for="selectedDate" class="form-label fw-semibold">
                <i class="bi bi-calendar3 me-2"></i>Select Date
              </label>
              <input 
                type="date" 
                class="form-control form-control-lg" 
                id="selectedDate"
                [(ngModel)]="selectedDate"
                (ngModelChange)="onDateChange()"
                [min]="minDate"
                [max]="maxDate">
            </div>
            <div class="col-md-4">
              <label for="routeFilter" class="form-label fw-semibold">
                <i class="bi bi-funnel me-2"></i>Filter by Route
              </label>
              <select 
                class="form-select form-select-lg" 
                id="routeFilter"
                [(ngModel)]="selectedRoute"
                (ngModelChange)="filterSchedules()">
                <option value="">All Routes</option>
                <option *ngFor="let route of availableRoutes" [value]="route">{{ route }}</option>
              </select>
            </div>
            <div class="col-md-4">
              <button class="btn btn-outline-secondary btn-lg w-100" (click)="resetFilters()">
                <i class="bi bi-arrow-clockwise me-2"></i>Reset Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Schedule Summary -->
      <div class="alert alert-info d-flex align-items-center mb-4" *ngIf="filteredSchedules.length > 0">
        <i class="bi bi-info-circle me-2 fs-5"></i>
        <div>
          <strong>{{ filteredSchedules.length }}</strong> bus service(s) available 
          <span *ngIf="selectedRoute">on {{ selectedRoute }}</span>
          <span *ngIf="!selectedRoute">across all routes</span>
          for <strong>{{ formattedDate }}</strong>
        </div>
      </div>

      <!-- No Results Message -->
      <div class="alert alert-warning text-center" *ngIf="filteredSchedules.length === 0">
        <i class="bi bi-exclamation-triangle me-2"></i>
        No bus services found for the selected criteria.
      </div>

      <!-- Bus Schedule Table -->
      <div class="card shadow-sm" *ngIf="filteredSchedules.length > 0">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover table-striped mb-0">
              <thead class="table-primary">
                <tr>
                  <th scope="col" class="ps-4">
                    <i class="bi bi-route me-2"></i>Route
                  </th>
                  <th scope="col">
                    <i class="bi bi-clock me-2"></i>Departure
                  </th>
                  <th scope="col">
                    <i class="bi bi-clock-history me-2"></i>Arrival
                  </th>
                  <th scope="col">
                    <i class="bi bi-hourglass-split me-2"></i>Duration
                  </th>
                  <th scope="col">
                    <i class="bi bi-repeat me-2"></i>Frequency
                  </th>
                  <th scope="col">
                    <i class="bi bi-bus-front me-2"></i>Bus Type
                  </th>
                  <th scope="col">
                    <i class="bi bi-building me-2"></i>Operator
                  </th>
                  <th scope="col" class="pe-4 text-center">
                    <i class="bi bi-ticket-perforated me-2"></i>Action
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let schedule of filteredSchedules; trackBy: trackByScheduleId">
                  <td class="ps-4">
                    <strong class="text-primary">{{ schedule.route }}</strong>
                    <span *ngIf="schedule.route === 'Matara–Colombo'" class="badge bg-success ms-2">Expressway</span>
                  </td>
                  <td>
                    <span class="fw-semibold text-success">{{ schedule.departureTime }}</span>
                  </td>
                  <td>
                    <span class="fw-semibold text-danger">{{ schedule.arrivalTime }}</span>
                  </td>
                  <td>
                    <span class="badge bg-info">{{ calculateDuration(schedule.departureTime, schedule.arrivalTime) }}</span>
                  </td>
                  <td>
                    <span class="text-muted">{{ schedule.frequency }}</span>
                  </td>
                  <td>
                    <span class="badge" 
                          [ngClass]="{
                            'bg-primary': schedule.busType === 'AC Express',
                            'bg-secondary': schedule.busType === 'Semi-Luxury',
                            'bg-warning text-dark': schedule.busType === 'Regular'
                          }">
                      {{ schedule.busType }}
                    </span>
                  </td>
                  <td>
                    <span class="text-muted">{{ schedule.operator || 'N/A' }}</span>
                  </td>
                  <td class="pe-4 text-center">
                    <button class="btn btn-primary btn-sm" (click)="bookTicket(schedule)">
                      <i class="bi bi-ticket-perforated me-1"></i>Book
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Route Statistics -->
      <div class="row mt-4" *ngIf="filteredSchedules.length > 0">
        <div class="col-md-3" *ngFor="let route of availableRoutes">
          <div class="card text-center border-primary">
            <div class="card-body">
              <h6 class="card-title text-primary">{{ route }}</h6>
              <h3 class="text-primary">{{ getRouteCount(route) }}</h3>
              <small class="text-muted">services</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .table thead th {
      border-bottom: 2px solid #dee2e6;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.875rem;
      letter-spacing: 0.5px;
    }

    .table tbody tr {
      transition: background-color 0.2s ease;
    }

    .table tbody tr:hover {
      background-color: #f8f9fa;
    }

    .card {
      border: none;
      border-radius: 10px;
    }

    .form-control-lg, .form-select-lg {
      border-radius: 8px;
    }

    .badge {
      font-size: 0.75rem;
      padding: 0.35em 0.65em;
    }

    .alert {
      border-radius: 8px;
      border: none;
    }

    h1 {
      color: #0d6efd;
    }

    .table-responsive {
      border-radius: 10px;
      overflow: hidden;
    }
  `]
})
export class BusTimetableComponent implements OnInit {
  selectedDate: string = '';
  selectedRoute: string = '';
  allSchedules: BusSchedule[] = [];
  filteredSchedules: BusSchedule[] = [];
  availableRoutes: string[] = [];
  minDate: string = '';
  maxDate: string = '';

  constructor(
    private busService: BusTimetableService,
    private router: Router
  ) {
    const today = new Date();
    this.selectedDate = this.formatDateForInput(today);
    this.minDate = this.formatDateForInput(today);
    
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    this.maxDate = this.formatDateForInput(maxDate);
  }

  ngOnInit(): void {
    this.allSchedules = this.busService.getAllSchedules();
    this.availableRoutes = this.busService.getAllRoutes();
    this.filterSchedules();
  }

  formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  get formattedDate(): string {
    if (!this.selectedDate) return '';
    const date = new Date(this.selectedDate);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  onDateChange(): void {
    this.filterSchedules();
  }

  filterSchedules(): void {
    let filtered = [...this.allSchedules];

    if (this.selectedRoute) {
      filtered = filtered.filter(schedule => schedule.route === this.selectedRoute);
    }

    // Sort by departure time
    filtered.sort((a, b) => {
      const timeA = this.timeToMinutes(a.departureTime);
      const timeB = this.timeToMinutes(b.departureTime);
      return timeA - timeB;
    });

    this.filteredSchedules = filtered;
  }

  resetFilters(): void {
    const today = new Date();
    this.selectedDate = this.formatDateForInput(today);
    this.selectedRoute = '';
    this.filterSchedules();
  }

  calculateDuration(departure: string, arrival: string): string {
    const depMinutes = this.timeToMinutes(departure);
    const arrMinutes = this.timeToMinutes(arrival);
    const diff = arrMinutes - depMinutes;
    
    if (diff < 0) {
      // Handle next day arrival
      return `${24 * 60 + diff} min`;
    }
    
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  getRouteCount(route: string): number {
    if (this.selectedRoute && this.selectedRoute !== route) {
      return 0;
    }
    return this.filteredSchedules.filter(s => s.route === route).length;
  }

  trackByScheduleId(index: number, schedule: BusSchedule): string {
    return schedule.id;
  }

  bookTicket(schedule: BusSchedule): void {
    this.router.navigate(['/booking'], { queryParams: { scheduleId: schedule.id } });
  }
}

