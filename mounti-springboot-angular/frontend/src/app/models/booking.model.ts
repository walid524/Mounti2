export interface Booking {
  id: string;
  tripId: string;
  clientId: string;
  clientName: string;
  bookingType: BookingType;
  quantity: number;
  totalPrice: number;
  status: BookingStatus;
  createdAt: Date;
}

export interface BookingRequest {
  tripId: string;
  bookingType: BookingType;
  quantity: number;
}

export enum BookingType {
  SEAT = 'SEAT',
  PARCEL = 'PARCEL'
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED'
}