import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  template: `
    <app-navigation *ngIf="showNavigation"></app-navigation>
    <div class="container" [class.full-height]="!showNavigation">
      <router-outlet></router-outlet>
    </div>
    <app-notification *ngIf="showNavigation"></app-notification>
  `,
  styles: [`
    .full-height {
      height: 100vh;
    }
  `]
})
export class AppComponent {
  title = 'StockPro - Inventory Manager';
  showNavigation = true;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Hide navigation on login page (even with query parameters)
      this.showNavigation = !event.url.startsWith('/login');
    });
  }
}
