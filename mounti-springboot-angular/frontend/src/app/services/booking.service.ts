import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking, BookingRequest, BookingStatus } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly API_URL = 'http://localhost:8080/api/bookings';

  constructor(private http: HttpClient) {}

  createBooking(bookingData: BookingRequest): Observable<Booking> {
    return this.http.post<Booking>(this.API_URL, bookingData);
  }

  getMyBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.API_URL}/my`);
  }

  getTripBookings(tripId: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.API_URL}/trip/${tripId}`);
  }

  updateBookingStatus(bookingId: string, status: BookingStatus): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/${bookingId}/status`, { status });
  }

  getBookingById(id: string): Observable<Booking> {
    return this.http.get<Booking>(`${this.API_URL}/${id}`);
  }
}