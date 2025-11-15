import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { BusTimetableComponent } from './bus-timetable/bus-timetable.component';
import { BookingComponent } from './booking/booking.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'bus-timetable', component: BusTimetableComponent },
  { path: 'booking', component: BookingComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];
