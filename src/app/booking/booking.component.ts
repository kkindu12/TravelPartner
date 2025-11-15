import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BusTimetableService, BusSchedule } from '../services/bus-timetable.service';
import { BookingService } from '../services/booking.service';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container py-4">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <h1 class="display-5 fw-bold mb-4 text-center">
            <i class="bi bi-ticket-perforated me-2"></i>Book Your Ticket
          </h1>

          <!-- Booking Summary Card -->
          <div class="card shadow-sm mb-4" *ngIf="selectedSchedule">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0"><i class="bi bi-info-circle me-2"></i>Booking Details</h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <strong>Route:</strong>
                  <p class="mb-0 text-primary fw-semibold">{{ selectedSchedule.route }}</p>
                </div>
                <div class="col-md-6 mb-3">
                  <strong>Departure Time:</strong>
                  <p class="mb-0 text-success fw-semibold">{{ selectedSchedule.departureTime }}</p>
                </div>
                <div class="col-md-6 mb-3">
                  <strong>Arrival Time:</strong>
                  <p class="mb-0 text-danger fw-semibold">{{ selectedSchedule.arrivalTime }}</p>
                </div>
                <div class="col-md-6 mb-3">
                  <strong>Bus Type:</strong>
                  <p class="mb-0">
                    <span class="badge" 
                          [ngClass]="{
                            'bg-primary': selectedSchedule.busType === 'AC Express',
                            'bg-secondary': selectedSchedule.busType === 'Semi-Luxury',
                            'bg-warning text-dark': selectedSchedule.busType === 'Regular'
                          }">
                      {{ selectedSchedule.busType }}
                    </span>
                  </p>
                </div>
                <div class="col-md-6 mb-3">
                  <strong>Operator:</strong>
                  <p class="mb-0 text-muted">{{ selectedSchedule.operator || 'N/A' }}</p>
                </div>
                <div class="col-md-6 mb-3">
                  <strong>Travel Date:</strong>
                  <p class="mb-0 text-muted">{{ formattedTravelDate }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Booking Form -->
          <div class="card shadow-sm" *ngIf="selectedSchedule && !bookingComplete">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0"><i class="bi bi-person-fill me-2"></i>Passenger Information</h5>
            </div>
            <div class="card-body">
              <form (ngSubmit)="onSubmit()" #bookingForm="ngForm">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="passengerName" class="form-label">Full Name <span class="text-danger">*</span></label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="passengerName"
                      [(ngModel)]="passengerName"
                      name="passengerName"
                      required
                      placeholder="Enter your full name">
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="passengerEmail" class="form-label">Email <span class="text-danger">*</span></label>
                    <input 
                      type="email" 
                      class="form-control" 
                      id="passengerEmail"
                      [(ngModel)]="passengerEmail"
                      name="passengerEmail"
                      required
                      placeholder="Enter your email">
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="passengerPhone" class="form-label">Phone Number <span class="text-danger">*</span></label>
                    <input 
                      type="tel" 
                      class="form-control" 
                      id="passengerPhone"
                      [(ngModel)]="passengerPhone"
                      name="passengerPhone"
                      required
                      placeholder="Enter your phone number">
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="numberOfSeats" class="form-label">Number of Seats <span class="text-danger">*</span></label>
                    <select 
                      class="form-select" 
                      id="numberOfSeats"
                      [(ngModel)]="numberOfSeats"
                      name="numberOfSeats"
                      required
                      (ngModelChange)="calculateTotal()">
                      <option value="">Select seats</option>
                      <option *ngFor="let num of [1,2,3,4,5,6,7,8,9,10]" [value]="num">{{ num }} {{ num === 1 ? 'seat' : 'seats' }}</option>
                    </select>
                  </div>
                </div>
                <div class="row">
                  <div class="col-12 mb-3">
                    <label for="travelDate" class="form-label">Travel Date <span class="text-danger">*</span></label>
                    <input 
                      type="date" 
                      class="form-control" 
                      id="travelDate"
                      [(ngModel)]="travelDate"
                      name="travelDate"
                      required
                      [min]="minDate"
                      [max]="maxDate">
                  </div>
                </div>

                <!-- Price Summary -->
                <div class="alert alert-info" *ngIf="numberOfSeats > 0">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>Total Amount:</strong>
                      <h4 class="mb-0 text-primary">Rs. {{ totalAmount.toLocaleString() }}</h4>
                      <small class="text-muted">{{ numberOfSeats }} {{ numberOfSeats === 1 ? 'seat' : 'seats' }} × Rs. {{ pricePerSeat.toLocaleString() }}</small>
                    </div>
                  </div>
                </div>

                <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                  <a routerLink="/bus-timetable" class="btn btn-outline-secondary me-md-2">
                    <i class="bi bi-arrow-left me-2"></i>Back to Timetable
                  </a>
                  <button type="submit" class="btn btn-primary" [disabled]="!bookingForm.valid || numberOfSeats === 0">
                    <i class="bi bi-check-circle me-2"></i>Confirm Booking
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Booking Confirmation -->
          <div class="card shadow-sm border-success" *ngIf="bookingComplete && booking">
            <div class="card-header bg-success text-white">
              <h5 class="mb-0"><i class="bi bi-check-circle me-2"></i>Booking Confirmed!</h5>
            </div>
            <div class="card-body text-center">
              <div class="mb-4">
                <i class="bi bi-check-circle-fill text-success" style="font-size: 4rem;"></i>
              </div>
              <h3 class="text-success mb-3">Your booking has been confirmed!</h3>
              <div class="alert alert-light">
                <p class="mb-2"><strong>Booking Reference:</strong></p>
                <h2 class="text-primary mb-3">{{ booking.bookingReference || booking.booking_reference }}</h2>
                <p class="mb-1"><strong>Passenger:</strong> {{ booking.passengerName || booking.passenger_name }}</p>
                <p class="mb-1"><strong>Route:</strong> {{ booking.schedule?.route || booking.route }}</p>
                <p class="mb-1"><strong>Travel Date:</strong> {{ formattedBookingDate }}</p>
                <p class="mb-1"><strong>Seats:</strong> {{ booking.numberOfSeats || booking.number_of_seats }}</p>
                <p class="mb-0"><strong>Total Amount:</strong> Rs. {{ (booking.totalAmount || booking.total_amount || 0).toLocaleString() }}</p>
              </div>
              <p class="text-muted mb-4">A confirmation email has been sent to {{ booking.passengerEmail || booking.passenger_email }}</p>
              <div class="d-grid gap-2 d-md-flex justify-content-md-center">
                <button class="btn btn-primary" (click)="printBooking()">
                  <i class="bi bi-printer me-2"></i>Print Ticket
                </button>
                <a routerLink="/bus-timetable" class="btn btn-outline-primary">
                  <i class="bi bi-bus-front me-2"></i>Book Another Ticket
                </a>
              </div>
            </div>
          </div>

          <!-- Error Message -->
          <div class="alert alert-danger" *ngIf="!selectedSchedule && !bookingComplete">
            <i class="bi bi-exclamation-triangle me-2"></i>
            No schedule selected. Please select a bus from the timetable.
            <a routerLink="/bus-timetable" class="alert-link ms-2">Go to Timetable</a>
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
    .card-header {
      border-radius: 10px 10px 0 0;
    }
    .form-control, .form-select {
      border-radius: 8px;
    }
    .btn {
      border-radius: 8px;
    }
    h1 {
      color: #0d6efd;
    }
  `]
})
export class BookingComponent implements OnInit {
  selectedSchedule: BusSchedule | null = null;
  passengerName = '';
  passengerEmail = '';
  passengerPhone = '';
  numberOfSeats = 0;
  travelDate = '';
  totalAmount = 0;
  pricePerSeat = 0;
  bookingComplete = false;
  booking: any = null;
  minDate = '';
  maxDate = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private busService: BusTimetableService,
    private bookingService: BookingService
  ) {
    const today = new Date();
    this.minDate = this.formatDateForInput(today);
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    this.maxDate = this.formatDateForInput(maxDate);
  }

  ngOnInit(): void {
    const scheduleId = this.route.snapshot.queryParams['scheduleId'];
    if (scheduleId) {
      const schedules = this.busService.getAllSchedules();
      this.selectedSchedule = schedules.find(s => s.id === scheduleId) || null;
      if (this.selectedSchedule) {
        this.calculatePricePerSeat();
        const today = new Date();
        this.travelDate = this.formatDateForInput(today);
      }
    }
  }

  formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  get formattedTravelDate(): string {
    if (!this.travelDate) return '';
    const date = new Date(this.travelDate);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  get formattedBookingDate(): string {
    if (!this.booking) return '';
    const date = new Date(this.booking.travelDate || this.booking.travel_date);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  calculatePricePerSeat(): void {
    if (!this.selectedSchedule) return;
    
    if (this.selectedSchedule.route === 'Matara–Colombo') {
      this.pricePerSeat = this.selectedSchedule.busType === 'AC Express' ? 1200 : 800;
    } else if (this.selectedSchedule.route === 'Matara–Galle') {
      this.pricePerSeat = this.selectedSchedule.busType === 'AC Express' ? 300 : 150;
    } else if (this.selectedSchedule.route === 'Matara–Kandy') {
      this.pricePerSeat = this.selectedSchedule.busType === 'AC Express' ? 1500 : 1000;
    } else if (this.selectedSchedule.route === 'Matara–Kurunegala') {
      this.pricePerSeat = this.selectedSchedule.busType === 'AC Express' ? 1400 : 900;
    } else {
      this.pricePerSeat = 500;
    }
  }

  calculateTotal(): void {
    this.totalAmount = this.pricePerSeat * this.numberOfSeats;
  }

  onSubmit(): void {
    if (!this.selectedSchedule) return;

    this.bookingService.createBooking(
      this.selectedSchedule,
      this.passengerName,
      this.passengerEmail,
      this.passengerPhone,
      this.numberOfSeats,
      this.travelDate
    ).subscribe({
      next: (booking) => {
        this.booking = booking;
        this.bookingComplete = true;
      },
      error: (error) => {
        console.error('Booking error:', error);
        alert('Failed to create booking. Please try again.\n' + error.message);
      }
    });
  }

  printBooking(): void {
    window.print();
  }
}

