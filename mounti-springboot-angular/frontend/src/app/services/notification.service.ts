import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Notification } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly API_URL = 'http://localhost:8080/api/notifications';
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.API_URL)
      .pipe(
        tap(notifications => this.notificationsSubject.next(notifications))
      );
  }

  markAsRead(notificationId: string): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/${notificationId}/read`, {})
      .pipe(
        tap(() => {
          const notifications = this.notificationsSubject.value;
          const updatedNotifications = notifications.map(n => 
            n.id === notificationId ? { ...n, isRead: true } : n
          );
          this.notificationsSubject.next(updatedNotifications);
        })
      );
  }

  getUnreadCount(): number {
    return this.notificationsSubject.value.filter(n => !n.isRead).length;
  }

  refreshNotifications(): void {
    this.getNotifications().subscribe();
  }
}