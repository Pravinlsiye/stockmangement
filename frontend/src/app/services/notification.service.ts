import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Notification {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  public notification$ = this.notificationSubject.asObservable();

  showSuccess(message: string, duration: number = 3000) {
    this.show({ type: 'success', message, duration });
  }

  showError(message: string, duration: number = 5000) {
    this.show({ type: 'error', message, duration });
  }

  showWarning(message: string, duration: number = 4000) {
    this.show({ type: 'warning', message, duration });
  }

  showInfo(message: string, duration: number = 3000) {
    this.show({ type: 'info', message, duration });
  }

  private show(notification: Notification) {
    this.notificationSubject.next(notification);
  }
}
