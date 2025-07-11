export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: Date;
}

export enum NotificationType {
  BOOKING_REQUEST = 'BOOKING_REQUEST',
  BOOKING_CONFIRMED = 'BOOKING_CONFIRMED',
  TRIP_REMINDER = 'TRIP_REMINDER',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  TRIP_AVAILABLE = 'TRIP_AVAILABLE'
}