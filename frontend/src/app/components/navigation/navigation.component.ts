import { Component } from '@angular/core';

@Component({
  selector: 'app-navigation',
  template: `
    <nav class="navbar">
      <div class="nav-container">
        <a routerLink="/" class="nav-brand">
          <img src="assets/logo.svg" alt="StockPro Logo" class="nav-logo">
          StockPro - Inventory Manager
        </a>
        <ul class="nav-menu">
          <li><a routerLink="/dashboard" routerLinkActive="active"><i class="fas fa-tachometer-alt"></i> Dashboard</a></li>
          <li><a routerLink="/sales" routerLinkActive="active"><i class="fas fa-cash-register"></i> Sales</a></li>
          <li><a routerLink="/products" routerLinkActive="active"><i class="fas fa-box"></i> Products</a></li>
          <li><a routerLink="/categories" routerLinkActive="active"><i class="fas fa-tags"></i> Categories</a></li>
          <li><a routerLink="/suppliers" routerLinkActive="active"><i class="fas fa-truck"></i> Suppliers</a></li>
          <li><a routerLink="/transactions" routerLinkActive="active"><i class="fas fa-exchange-alt"></i> Transactions</a></li>
        </ul>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background-color: #1976D2;
      padding: 0;
      box-shadow: 0 2px 4px rgba(0,0,0,.1);
    }
    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 60px;
    }
    .nav-brand {
      color: white;
      text-decoration: none;
      font-size: 20px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .nav-logo {
      width: 40px;
      height: 40px;
      background: white;
      border-radius: 8px;
      padding: 4px;
    }
    .nav-menu {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      gap: 30px;
    }
    .nav-menu a {
      color: white;
      text-decoration: none;
      font-weight: 500;
      transition: opacity 0.3s;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .nav-menu i {
      font-size: 16px;
    }
    .nav-menu a:hover {
      opacity: 0.8;
    }
    .nav-menu a.active {
      border-bottom: 3px solid white;
      padding-bottom: 2px;
    }
  `]
})
export class NavigationComponent { }
