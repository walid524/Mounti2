export interface Trip {
  id: string;
  transporterId: string;
  transporterName: string;
  fromLocation: string;
  toLocation: string;
  departureDate: Date;
  availableSeats: number;
  availableWeightKg: number;
  pricePerSeat: number;
  pricePerKg: number;
  notes?: string;
  status: TripStatus;
  createdAt: Date;
}

export interface TripCreateRequest {
  fromLocation: string;
  toLocation: string;
  departureDate: Date;
  availableSeats: number;
  availableWeightKg: number;
  pricePerSeat: number;
  pricePerKg: number;
  notes?: string;
}

export interface TripSearchParams {
  fromLocation?: string;
  toLocation?: string;
  departureDate?: string;
}

export enum TripStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}