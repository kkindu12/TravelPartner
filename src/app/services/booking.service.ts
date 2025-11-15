import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { BusSchedule } from './bus-timetable.service';

export interface Booking {
  id?: number;
  booking_reference?: string;
  schedule_id?: string;
  route: string;
  departure_time: string;
  arrival_time: string;
  bus_type: string;
  operator?: string;
  passenger_name: string;
  passenger_email: string;
  passenger_phone: string;
  number_of_seats: number;
  travel_date: string;
  total_amount: number;
  status?: 'confirmed' | 'pending' | 'cancelled';
  booking_date?: string;
  created_at?: string;
  // Frontend compatibility fields
  schedule?: BusSchedule;
  passengerName?: string;
  passengerEmail?: string;
  passengerPhone?: string;
  numberOfSeats?: number;
  bookingDate?: string;
  travelDate?: string;
  totalAmount?: number;
  bookingReference?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:3000/api/bookings';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  private calculatePrice(schedule: BusSchedule, seats: number): number {
    let basePrice = 0;
    
    if (schedule.route === 'Matara–Colombo') {
      basePrice = schedule.busType === 'AC Express' ? 1200 : 800;
    } else if (schedule.route === 'Matara–Galle') {
      basePrice = schedule.busType === 'AC Express' ? 300 : 150;
    } else if (schedule.route === 'Matara–Kandy') {
      basePrice = schedule.busType === 'AC Express' ? 1500 : 1000;
    } else if (schedule.route === 'Matara–Kurunegala') {
      basePrice = schedule.busType === 'AC Express' ? 1400 : 900;
    } else {
      basePrice = 500;
    }
    
    return basePrice * seats;
  }

  createBooking(
    schedule: BusSchedule,
    passengerName: string,
    passengerEmail: string,
    passengerPhone: string,
    numberOfSeats: number,
    travelDate: string
  ): Observable<Booking> {
    const totalAmount = this.calculatePrice(schedule, numberOfSeats);
    
    const bookingData = {
      scheduleId: schedule.id,
      route: schedule.route,
      departureTime: schedule.departureTime,
      arrivalTime: schedule.arrivalTime,
      busType: schedule.busType,
      operator: schedule.operator || null,
      passengerName,
      passengerEmail,
      passengerPhone,
      numberOfSeats,
      travelDate,
      totalAmount
    };

    return this.http.post<ApiResponse<Booking>>(this.apiUrl, bookingData, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      )
      .pipe(
        // Transform response to include frontend-compatible fields
        (obs: Observable<ApiResponse<Booking>>) => {
          return new Observable<Booking>(observer => {
            obs.subscribe({
              next: (response) => {
                if (response.success && response.data) {
                  const booking = this.transformBooking(response.data);
                  observer.next(booking);
                  observer.complete();
                } else {
                  observer.error(new Error(response.message || 'Failed to create booking'));
                }
              },
              error: (err) => observer.error(err)
            });
          });
        }
      );
  }

  getAllBookings(): Observable<Booking[]> {
    return this.http.get<ApiResponse<Booking[]>>(this.apiUrl, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      )
      .pipe(
        (obs: Observable<ApiResponse<Booking[]>>) => {
          return new Observable<Booking[]>(observer => {
            obs.subscribe({
              next: (response) => {
                if (response.success && response.data) {
                  const bookings = response.data.map(b => this.transformBooking(b));
                  observer.next(bookings);
                  observer.complete();
                } else {
                  observer.error(new Error(response.message || 'Failed to fetch bookings'));
                }
              },
              error: (err) => observer.error(err)
            });
          });
        }
      );
  }

  getBookingById(id: number): Observable<Booking> {
    return this.http.get<ApiResponse<Booking>>(`${this.apiUrl}/${id}`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      )
      .pipe(
        (obs: Observable<ApiResponse<Booking>>) => {
          return new Observable<Booking>(observer => {
            obs.subscribe({
              next: (response) => {
                if (response.success && response.data) {
                  const booking = this.transformBooking(response.data);
                  observer.next(booking);
                  observer.complete();
                } else {
                  observer.error(new Error(response.message || 'Booking not found'));
                }
              },
              error: (err) => observer.error(err)
            });
          });
        }
      );
  }

  getBookingByReference(reference: string): Observable<Booking> {
    return this.http.get<ApiResponse<Booking>>(`${this.apiUrl}/reference/${reference}`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      )
      .pipe(
        (obs: Observable<ApiResponse<Booking>>) => {
          return new Observable<Booking>(observer => {
            obs.subscribe({
              next: (response) => {
                if (response.success && response.data) {
                  const booking = this.transformBooking(response.data);
                  observer.next(booking);
                  observer.complete();
                } else {
                  observer.error(new Error(response.message || 'Booking not found'));
                }
              },
              error: (err) => observer.error(err)
            });
          });
        }
      );
  }

  getBookingsByEmail(email: string): Observable<Booking[]> {
    return this.http.get<ApiResponse<Booking[]>>(`${this.apiUrl}/email/${email}`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      )
      .pipe(
        (obs: Observable<ApiResponse<Booking[]>>) => {
          return new Observable<Booking[]>(observer => {
            obs.subscribe({
              next: (response) => {
                if (response.success && response.data) {
                  const bookings = response.data.map(b => this.transformBooking(b));
                  observer.next(bookings);
                  observer.complete();
                } else {
                  observer.error(new Error(response.message || 'Failed to fetch bookings'));
                }
              },
              error: (err) => observer.error(err)
            });
          });
        }
      );
  }

  cancelBooking(id: number): Observable<Booking> {
    return this.http.patch<ApiResponse<Booking>>(`${this.apiUrl}/${id}/cancel`, {}, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      )
      .pipe(
        (obs: Observable<ApiResponse<Booking>>) => {
          return new Observable<Booking>(observer => {
            obs.subscribe({
              next: (response) => {
                if (response.success && response.data) {
                  const booking = this.transformBooking(response.data);
                  observer.next(booking);
                  observer.complete();
                } else {
                  observer.error(new Error(response.message || 'Failed to cancel booking'));
                }
              },
              error: (err) => observer.error(err)
            });
          });
        }
      );
  }

  // Transform database booking to frontend-compatible format
  private transformBooking(dbBooking: any): Booking {
    return {
      ...dbBooking,
      // Frontend compatibility
      id: dbBooking.id,
      bookingReference: dbBooking.booking_reference,
      passengerName: dbBooking.passenger_name,
      passengerEmail: dbBooking.passenger_email,
      passengerPhone: dbBooking.passenger_phone,
      numberOfSeats: dbBooking.number_of_seats,
      travelDate: dbBooking.travel_date,
      totalAmount: parseFloat(dbBooking.total_amount),
      bookingDate: dbBooking.booking_date || dbBooking.created_at,
      // Keep original schedule if available
      schedule: dbBooking.schedule
    };
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = error.error?.message || error.message || `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error('Booking Service Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}

