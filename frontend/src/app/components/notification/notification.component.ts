import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService, Notification } from '../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification',
  template: `
    <div class="notification-container">
      <div *ngFor="let notification of notifications; let i = index"
           class="notification"
           [class.success]="notification.type === 'success'"
           [class.error]="notification.type === 'error'"
           [class.warning]="notification.type === 'warning'"
           [class.info]="notification.type === 'info'"
           [@slideIn]>
        <div class="notification-content">
          <i class="fas" 
             [class.fa-check-circle]="notification.type === 'success'"
             [class.fa-exclamation-circle]="notification.type === 'error'"
             [class.fa-exclamation-triangle]="notification.type === 'warning'"
             [class.fa-info-circle]="notification.type === 'info'"></i>
          <span>{{ notification.message }}</span>
        </div>
        <button class="close-btn" (click)="removeNotification(i)">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed;
      top: 80px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 400px;
    }

    .notification {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      background: white;
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .notification-content {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
    }

    .notification-content i {
      font-size: 20px;
    }

    .notification-content span {
      font-size: 14px;
      font-weight: 500;
      line-height: 1.4;
    }

    .notification.success {
      border-left: 4px solid #4caf50;
    }

    .notification.success i {
      color: #4caf50;
    }

    .notification.error {
      border-left: 4px solid #f44336;
    }

    .notification.error i {
      color: #f44336;
    }

    .notification.warning {
      border-left: 4px solid #ff9800;
    }

    .notification.warning i {
      color: #ff9800;
    }

    .notification.info {
      border-left: 4px solid #2196f3;
    }

    .notification.info i {
      color: #2196f3;
    }

    .close-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      color: #999;
      transition: color 0.3s;
    }

    .close-btn:hover {
      color: #333;
    }

    @media (max-width: 480px) {
      .notification-container {
        left: 10px;
        right: 10px;
        max-width: none;
      }
    }
  `]
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private subscription?: Subscription;
  private timers: any[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.subscription = this.notificationService.notification$.subscribe(
      notification => this.addNotification(notification)
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.timers.forEach(timer => clearTimeout(timer));
  }

  addNotification(notification: Notification) {
    this.notifications.push(notification);
    const index = this.notifications.length - 1;

    if (notification.duration) {
      const timer = setTimeout(() => {
        this.removeNotification(index);
      }, notification.duration);
      this.timers.push(timer);
    }
  }

  removeNotification(index: number) {
    this.notifications.splice(index, 1);
  }
}
