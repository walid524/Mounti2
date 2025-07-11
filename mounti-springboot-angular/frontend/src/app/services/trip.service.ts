import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trip, TripCreateRequest, TripSearchParams } from '../models/trip.model';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private readonly API_URL = 'http://localhost:8080/api/trips';

  constructor(private http: HttpClient) {}

  getAllTrips(searchParams?: TripSearchParams): Observable<Trip[]> {
    let params = new HttpParams();
    
    if (searchParams) {
      if (searchParams.fromLocation) {
        params = params.set('fromLocation', searchParams.fromLocation);
      }
      if (searchParams.toLocation) {
        params = params.set('toLocation', searchParams.toLocation);
      }
      if (searchParams.departureDate) {
        params = params.set('departureDate', searchParams.departureDate);
      }
    }

    return this.http.get<Trip[]>(this.API_URL, { params });
  }

  getMyTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.API_URL}/my`);
  }

  getTripById(id: string): Observable<Trip> {
    return this.http.get<Trip>(`${this.API_URL}/${id}`);
  }

  createTrip(tripData: TripCreateRequest): Observable<Trip> {
    return this.http.post<Trip>(this.API_URL, tripData);
  }

  updateTrip(id: string, tripData: Partial<TripCreateRequest>): Observable<Trip> {
    return this.http.put<Trip>(`${this.API_URL}/${id}`, tripData);
  }

  deleteTrip(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}