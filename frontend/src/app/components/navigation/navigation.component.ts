import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navigation',
  template: `
    <nav class="navbar">
      <div class="nav-container">
        <a routerLink="/dashboard" class="nav-brand">
          <div class="logo-wrapper">
            <img src="assets/logo.svg" alt="StockPro Logo" class="nav-logo">
          </div>
          <div class="brand-text">
            <span class="brand-name">StockPro</span>
            <span class="brand-tagline">Inventory Manager</span>
          </div>
        </a>
        
        <div class="nav-menu-wrapper">
          <ul class="nav-menu">
            <li class="nav-item">
              <a routerLink="/dashboard" routerLinkActive="active">
                <i class="fas fa-tachometer-alt"></i>
                <span>Dashboard</span>
              </a>
            </li>
            
            <li class="nav-item highlighted">
              <a routerLink="/sales" routerLinkActive="active">
                <i class="fas fa-cash-register"></i>
                <span>Sales</span>
              </a>
            </li>
            
            <li class="nav-item">
              <a routerLink="/bills" routerLinkActive="active">
                <i class="fas fa-file-invoice-dollar"></i>
                <span>Customer Bills</span>
              </a>
            </li>
            
            <li class="nav-divider"></li>
            
            <li class="nav-item dropdown">
              <a class="dropdown-toggle" (click)="toggleDropdown($event)">
                <i class="fas fa-cube"></i>
                <span>Inventory</span>
                <i class="fas fa-chevron-down dropdown-icon"></i>
              </a>
              <ul class="dropdown-menu" [class.show]="showInventoryDropdown">
                <li><a routerLink="/products" routerLinkActive="active"><i class="fas fa-box"></i> Products</a></li>
                <li><a routerLink="/categories" routerLinkActive="active"><i class="fas fa-tags"></i> Categories</a></li>
                <li><a routerLink="/suppliers" routerLinkActive="active"><i class="fas fa-truck"></i> Suppliers</a></li>
              </ul>
            </li>
            
            <li class="nav-item">
              <a routerLink="/transactions" routerLinkActive="active">
                <i class="fas fa-exchange-alt"></i>
                <span>Transactions</span>
              </a>
            </li>
            
            <li class="nav-item">
              <a routerLink="/orders" routerLinkActive="active">
                <i class="fas fa-clipboard-list"></i>
                <span>Orders</span>
              </a>
            </li>
            
            <li class="nav-item">
              <a routerLink="/reports" routerLinkActive="active">
                <i class="fas fa-chart-line"></i>
                <span>Reports</span>
              </a>
            </li>
            
            <li class="nav-divider"></li>
            
            <li class="nav-item user-menu">
              <a class="dropdown-toggle" (click)="toggleUserDropdown($event)">
                <i class="fas fa-user-circle"></i>
                <span class="user-name">{{ currentUser?.username || 'User' }}</span>
                <i class="fas fa-chevron-down dropdown-icon" [class.rotated]="showUserDropdown"></i>
              </a>
              <ul class="dropdown-menu user-dropdown" [class.show]="showUserDropdown">
                <li class="user-info">
                  <div class="user-avatar">
                    <i class="fas fa-user-circle"></i>
                  </div>
                  <div class="user-details">
                    <div class="user-name-text">{{ currentUser?.username || 'User' }}</div>
                    <div class="user-email-text" *ngIf="currentUser?.email">{{ currentUser?.email }}</div>
                  </div>
                </li>
                <li class="dropdown-divider"></li>
                <li><a (click)="logout()" class="logout-link"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: linear-gradient(135deg, #1565C0 0%, #1976D2 100%);
      padding: 0;
      box-shadow: 0 4px 12px rgba(0,0,0,.15);
      position: relative;
    }
    
    .nav-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 72px;
    }
    
    /* Brand Styling */
    .nav-brand {
      color: white;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 15px;
      transition: transform 0.3s ease;
    }
    
    .nav-brand:hover {
      transform: translateX(5px);
    }
    
    .logo-wrapper {
      width: 48px;
      height: 48px;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .nav-logo {
      width: 36px;
      height: 36px;
    }
    
    .brand-text {
      display: flex;
      flex-direction: column;
    }
    
    .brand-name {
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    
    .brand-tagline {
      font-size: 12px;
      opacity: 0.9;
      margin-top: -2px;
    }
    
    /* Menu Styling */
    .nav-menu-wrapper {
      display: flex;
      align-items: center;
    }
    
    .nav-menu {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    
    .nav-item {
      position: relative;
    }
    
    .nav-item > a,
    .dropdown-toggle {
      color: white;
      text-decoration: none;
      font-weight: 500;
      padding: 10px 20px;
      border-radius: 8px;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      background: transparent;
      border: none;
      font-size: 15px;
    }
    
    .nav-item > a:hover,
    .dropdown-toggle:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: translateY(-1px);
    }
    
    .nav-item > a.active {
      background: rgba(255, 255, 255, 0.2);
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .nav-item.highlighted > a {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }
    
    .nav-item.highlighted > a:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.5);
    }
    
    .nav-item i {
      font-size: 18px;
    }
    
    .dropdown-icon {
      font-size: 12px !important;
      margin-left: 5px;
      transition: transform 0.3s ease;
    }

    .dropdown-icon.rotated {
      transform: rotate(180deg);
    }
    
    .dropdown-toggle:hover .dropdown-icon:not(.rotated) {
      transform: translateY(2px);
    }

    .user-name {
      max-width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    /* Divider */
    .nav-divider {
      width: 1px;
      height: 30px;
      background: rgba(255, 255, 255, 0.3);
      margin: 0 10px;
    }
    
    /* Dropdown Menu */
    .dropdown {
      position: relative;
    }
    
    .dropdown-menu {
      position: absolute;
      top: 100%;
      left: 0;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      padding: 10px 0;
      margin-top: 10px;
      min-width: 200px;
      list-style: none;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.3s ease;
      z-index: 1000;
    }
    
    .dropdown-menu.show {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    
    .dropdown-menu li {
      padding: 0;
    }
    
    .dropdown-menu a {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 20px;
      color: #333;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.2s;
      font-size: 14px;
    }
    
    .dropdown-menu a:hover {
      background: #f5f5f5;
      color: #1976D2;
      padding-left: 25px;
    }
    
    .dropdown-menu a.active {
      background: #e3f2fd;
      color: #1976D2;
    }
    
    .dropdown-menu i {
      font-size: 16px;
      color: #666;
    }
    
    .dropdown-menu a:hover i {
      color: #1976D2;
    }
    
    .user-menu .dropdown-toggle {
      background: rgba(255, 255, 255, 0.1);
    }
    
    .user-menu .dropdown-toggle:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .user-menu .dropdown-menu {
      right: 0;
      left: auto;
      min-width: 220px;
    }

    .user-dropdown .user-info {
      padding: 15px 20px;
      display: flex;
      align-items: center;
      gap: 12px;
      background: #f8f9fa;
      border-radius: 12px 12px 0 0;
    }

    .user-avatar {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 24px;
      flex-shrink: 0;
    }

    .user-details {
      flex: 1;
      min-width: 0;
    }

    .user-name-text {
      font-weight: 600;
      color: #333;
      font-size: 15px;
      margin-bottom: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .user-email-text {
      font-size: 13px;
      color: #666;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .dropdown-divider {
      height: 1px;
      background: #e0e0e0;
      margin: 8px 0;
    }

    .logout-link {
      color: #e74c3c !important;
    }

    .logout-link:hover {
      background: #fee !important;
      color: #c33 !important;
    }

    .logout-link i {
      color: #e74c3c;
    }

    .logout-link:hover i {
      color: #c33;
    }
    
    /* Responsive Design */
    @media (max-width: 1024px) {
      .nav-container {
        padding: 0 20px;
      }

      .nav-item > a span,
      .dropdown-toggle span {
        font-size: 14px;
      }
    }

    @media (max-width: 768px) {
      .nav-container {
        height: 60px;
        padding: 0 15px;
        flex-wrap: wrap;
      }
      
      .nav-brand {
        gap: 10px;
      }

      .logo-wrapper {
        width: 40px;
        height: 40px;
      }

      .nav-logo {
        width: 30px;
        height: 30px;
      }

      .brand-name {
        font-size: 18px;
      }
      
      .brand-tagline {
        display: none;
      }

      .nav-menu-wrapper {
        width: 100%;
        order: 3;
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid rgba(255, 255, 255, 0.2);
      }

      .nav-menu {
        flex-wrap: wrap;
        gap: 5px;
        justify-content: center;
      }
      
      .nav-item > a span,
      .dropdown-toggle span {
        display: none;
      }
      
      .nav-item > a,
      .dropdown-toggle {
        padding: 8px 10px;
        font-size: 14px;
        min-width: 44px; /* Better touch target */
        justify-content: center;
      }

      .nav-item i {
        font-size: 16px;
      }
      
      .nav-divider {
        display: none;
      }

      .user-menu {
        margin-left: auto;
        order: 2;
      }

      .user-menu .dropdown-toggle {
        padding: 8px 12px;
      }

      .user-menu .dropdown-menu {
        right: 0;
        left: auto;
        min-width: 200px;
        margin-top: 8px;
      }

      .user-dropdown .user-info {
        padding: 12px 15px;
        gap: 10px;
      }

      .user-avatar {
        width: 40px;
        height: 40px;
        font-size: 20px;
      }

      .user-name-text {
        font-size: 14px;
      }

      .user-email-text {
        font-size: 12px;
      }

      .dropdown-menu a {
        padding: 14px 18px;
        font-size: 14px;
        min-height: 44px; /* Better touch target */
      }
    }

    @media (max-width: 480px) {
      .nav-container {
        height: 56px;
        padding: 0 10px;
      }

      .logo-wrapper {
        width: 36px;
        height: 36px;
      }

      .nav-logo {
        width: 28px;
        height: 28px;
      }

      .brand-name {
        font-size: 16px;
      }

      .nav-menu-wrapper {
        margin-top: 8px;
        padding-top: 8px;
      }

      .nav-item > a,
      .dropdown-toggle {
        padding: 6px 8px;
        font-size: 13px;
      }

      .nav-item i {
        font-size: 15px;
      }

      .user-menu .dropdown-menu {
        min-width: 180px;
      }

      .user-dropdown .user-info {
        padding: 10px 12px;
        gap: 8px;
      }

      .user-avatar {
        width: 36px;
        height: 36px;
        font-size: 18px;
      }

      .user-name-text {
        font-size: 13px;
      }

      .user-email-text {
        font-size: 11px;
      }
    }

    /* Landscape orientation on mobile */
    @media (max-width: 768px) and (orientation: landscape) {
      .nav-container {
        height: 56px;
      }

      .nav-menu-wrapper {
        margin-top: 5px;
        padding-top: 5px;
      }
    }
  `]
})
export class NavigationComponent implements OnInit {
  showInventoryDropdown = false;
  showUserDropdown = false;
  currentUser: any = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Subscribe to current user
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
      this.showInventoryDropdown = false;
      this.showUserDropdown = false;
    });
  }

  toggleDropdown(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.showInventoryDropdown = !this.showInventoryDropdown;
    this.showUserDropdown = false;
  }

  toggleUserDropdown(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.showUserDropdown = !this.showUserDropdown;
    this.showInventoryDropdown = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
