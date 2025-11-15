import { Injectable } from '@angular/core';

export interface BusSchedule {
  id: string;
  route: string;
  departureTime: string;
  arrivalTime: string;
  frequency: string;
  busType: string;
  operator?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BusTimetableService {
  private schedules: BusSchedule[] = [
    // Matara - Colombo (via Southern Expressway)
    { id: '1', route: 'Matara–Colombo', departureTime: '05:00', arrivalTime: '08:30', frequency: 'Daily', busType: 'AC Express', operator: 'SLTB' },
    { id: '2', route: 'Matara–Colombo', departureTime: '06:00', arrivalTime: '09:30', frequency: 'Daily', busType: 'AC Express', operator: 'Private' },
    { id: '3', route: 'Matara–Colombo', departureTime: '07:00', arrivalTime: '10:30', frequency: 'Daily', busType: 'Semi-Luxury', operator: 'SLTB' },
    { id: '4', route: 'Matara–Colombo', departureTime: '08:00', arrivalTime: '11:30', frequency: 'Daily', busType: 'AC Express', operator: 'Private' },
    { id: '5', route: 'Matara–Colombo', departureTime: '09:30', arrivalTime: '13:00', frequency: 'Daily', busType: 'AC Express', operator: 'SLTB' },
    { id: '6', route: 'Matara–Colombo', departureTime: '11:00', arrivalTime: '14:30', frequency: 'Daily', busType: 'Semi-Luxury', operator: 'Private' },
    { id: '7', route: 'Matara–Colombo', departureTime: '13:00', arrivalTime: '16:30', frequency: 'Daily', busType: 'AC Express', operator: 'SLTB' },
    { id: '8', route: 'Matara–Colombo', departureTime: '15:00', arrivalTime: '18:30', frequency: 'Daily', busType: 'AC Express', operator: 'Private' },
    { id: '9', route: 'Matara–Colombo', departureTime: '17:00', arrivalTime: '20:30', frequency: 'Daily', busType: 'Semi-Luxury', operator: 'SLTB' },
    { id: '10', route: 'Matara–Colombo', departureTime: '19:00', arrivalTime: '22:30', frequency: 'Daily', busType: 'AC Express', operator: 'Private' },
    
    // Matara - Galle
    { id: '11', route: 'Matara–Galle', departureTime: '05:30', arrivalTime: '06:30', frequency: 'Every 30 min', busType: 'Regular', operator: 'SLTB' },
    { id: '12', route: 'Matara–Galle', departureTime: '06:00', arrivalTime: '07:00', frequency: 'Every 30 min', busType: 'AC Express', operator: 'Private' },
    { id: '13', route: 'Matara–Galle', departureTime: '06:30', arrivalTime: '07:30', frequency: 'Every 30 min', busType: 'Regular', operator: 'SLTB' },
    { id: '14', route: 'Matara–Galle', departureTime: '07:00', arrivalTime: '08:00', frequency: 'Every 30 min', busType: 'AC Express', operator: 'Private' },
    { id: '15', route: 'Matara–Galle', departureTime: '07:30', arrivalTime: '08:30', frequency: 'Every 30 min', busType: 'Regular', operator: 'SLTB' },
    { id: '16', route: 'Matara–Galle', departureTime: '08:00', arrivalTime: '09:00', frequency: 'Every 30 min', busType: 'AC Express', operator: 'Private' },
    { id: '17', route: 'Matara–Galle', departureTime: '08:30', arrivalTime: '09:30', frequency: 'Every 30 min', busType: 'Regular', operator: 'SLTB' },
    { id: '18', route: 'Matara–Galle', departureTime: '09:00', arrivalTime: '10:00', frequency: 'Every 30 min', busType: 'AC Express', operator: 'Private' },
    { id: '19', route: 'Matara–Galle', departureTime: '09:30', arrivalTime: '10:30', frequency: 'Every 30 min', busType: 'Regular', operator: 'SLTB' },
    { id: '20', route: 'Matara–Galle', departureTime: '10:00', arrivalTime: '11:00', frequency: 'Every 30 min', busType: 'AC Express', operator: 'Private' },
    { id: '21', route: 'Matara–Galle', departureTime: '10:30', arrivalTime: '11:30', frequency: 'Every 30 min', busType: 'Regular', operator: 'SLTB' },
    { id: '22', route: 'Matara–Galle', departureTime: '11:00', arrivalTime: '12:00', frequency: 'Every 30 min', busType: 'AC Express', operator: 'Private' },
    { id: '23', route: 'Matara–Galle', departureTime: '11:30', arrivalTime: '12:30', frequency: 'Every 30 min', busType: 'Regular', operator: 'SLTB' },
    { id: '24', route: 'Matara–Galle', departureTime: '12:00', arrivalTime: '13:00', frequency: 'Every 30 min', busType: 'AC Express', operator: 'Private' },
    { id: '25', route: 'Matara–Galle', departureTime: '12:30', arrivalTime: '13:30', frequency: 'Every 30 min', busType: 'Regular', operator: 'SLTB' },
    { id: '26', route: 'Matara–Galle', departureTime: '13:00', arrivalTime: '14:00', frequency: 'Every 30 min', busType: 'AC Express', operator: 'Private' },
    { id: '27', route: 'Matara–Galle', departureTime: '13:30', arrivalTime: '14:30', frequency: 'Every 30 min', busType: 'Regular', operator: 'SLTB' },
    { id: '28', route: 'Matara–Galle', departureTime: '14:00', arrivalTime: '15:00', frequency: 'Every 30 min', busType: 'AC Express', operator: 'Private' },
    { id: '29', route: 'Matara–Galle', departureTime: '14:30', arrivalTime: '15:30', frequency: 'Every 30 min', busType: 'Regular', operator: 'SLTB' },
    { id: '30', route: 'Matara–Galle', departureTime: '15:00', arrivalTime: '16:00', frequency: 'Every 30 min', busType: 'AC Express', operator: 'Private' },
    { id: '31', route: 'Matara–Galle', departureTime: '15:30', arrivalTime: '16:30', frequency: 'Every 30 min', busType: 'Regular', operator: 'SLTB' },
    { id: '32', route: 'Matara–Galle', departureTime: '16:00', arrivalTime: '17:00', frequency: 'Every 30 min', busType: 'AC Express', operator: 'Private' },
    { id: '33', route: 'Matara–Galle', departureTime: '16:30', arrivalTime: '17:30', frequency: 'Every 30 min', busType: 'Regular', operator: 'SLTB' },
    { id: '34', route: 'Matara–Galle', departureTime: '17:00', arrivalTime: '18:00', frequency: 'Every 30 min', busType: 'AC Express', operator: 'Private' },
    { id: '35', route: 'Matara–Galle', departureTime: '17:30', arrivalTime: '18:30', frequency: 'Every 30 min', busType: 'Regular', operator: 'SLTB' },
    { id: '36', route: 'Matara–Galle', departureTime: '18:00', arrivalTime: '19:00', frequency: 'Every 30 min', busType: 'AC Express', operator: 'Private' },
    { id: '37', route: 'Matara–Galle', departureTime: '18:30', arrivalTime: '19:30', frequency: 'Every 30 min', busType: 'Regular', operator: 'SLTB' },
    { id: '38', route: 'Matara–Galle', departureTime: '19:00', arrivalTime: '20:00', frequency: 'Every 30 min', busType: 'AC Express', operator: 'Private' },
    { id: '39', route: 'Matara–Galle', departureTime: '19:30', arrivalTime: '20:30', frequency: 'Every 30 min', busType: 'Regular', operator: 'SLTB' },
    { id: '40', route: 'Matara–Galle', departureTime: '20:00', arrivalTime: '21:00', frequency: 'Every 30 min', busType: 'AC Express', operator: 'Private' },
    
    // Matara - Kandy
    { id: '41', route: 'Matara–Kandy', departureTime: '05:30', arrivalTime: '11:00', frequency: 'Daily', busType: 'AC Express', operator: 'SLTB' },
    { id: '42', route: 'Matara–Kandy', departureTime: '07:00', arrivalTime: '12:30', frequency: 'Daily', busType: 'AC Express', operator: 'Private' },
    { id: '43', route: 'Matara–Kandy', departureTime: '08:30', arrivalTime: '14:00', frequency: 'Daily', busType: 'Semi-Luxury', operator: 'SLTB' },
    { id: '44', route: 'Matara–Kandy', departureTime: '10:00', arrivalTime: '15:30', frequency: 'Daily', busType: 'AC Express', operator: 'Private' },
    { id: '45', route: 'Matara–Kandy', departureTime: '12:00', arrivalTime: '17:30', frequency: 'Daily', busType: 'AC Express', operator: 'SLTB' },
    { id: '46', route: 'Matara–Kandy', departureTime: '14:00', arrivalTime: '19:30', frequency: 'Daily', busType: 'Semi-Luxury', operator: 'Private' },
    { id: '47', route: 'Matara–Kandy', departureTime: '16:00', arrivalTime: '21:30', frequency: 'Daily', busType: 'AC Express', operator: 'SLTB' },
    
    // Matara - Kurunegala
    { id: '48', route: 'Matara–Kurunegala', departureTime: '06:00', arrivalTime: '11:30', frequency: 'Daily', busType: 'AC Express', operator: 'SLTB' },
    { id: '49', route: 'Matara–Kurunegala', departureTime: '08:00', arrivalTime: '13:30', frequency: 'Daily', busType: 'AC Express', operator: 'Private' },
    { id: '50', route: 'Matara–Kurunegala', departureTime: '10:00', arrivalTime: '15:30', frequency: 'Daily', busType: 'Semi-Luxury', operator: 'SLTB' },
    { id: '51', route: 'Matara–Kurunegala', departureTime: '12:00', arrivalTime: '17:30', frequency: 'Daily', busType: 'AC Express', operator: 'Private' },
    { id: '52', route: 'Matara–Kurunegala', departureTime: '14:00', arrivalTime: '19:30', frequency: 'Daily', busType: 'AC Express', operator: 'SLTB' },
    { id: '53', route: 'Matara–Kurunegala', departureTime: '16:00', arrivalTime: '21:30', frequency: 'Daily', busType: 'Semi-Luxury', operator: 'Private' },
  ];

  getSchedulesByDate(date: Date): BusSchedule[] {
    // For now, return all schedules (in a real app, this would filter by date)
    return this.schedules;
  }

  getSchedulesByRoute(route: string): BusSchedule[] {
    return this.schedules.filter(schedule => schedule.route === route);
  }

  getAllRoutes(): string[] {
    return Array.from(new Set(this.schedules.map(s => s.route)));
  }

  getAllSchedules(): BusSchedule[] {
    return this.schedules;
  }
}

