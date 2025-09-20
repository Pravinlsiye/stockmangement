import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { SupplierService } from '../../services/supplier.service';
import { TransactionService } from '../../services/transaction.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard">
      <h1>Inventory Dashboard</h1>
      
      <div class="grid grid-3 mb-20">
        <div class="stat-card">
          <i class="fas fa-box stat-icon"></i>
          <h3>{{ totalProducts }}</h3>
          <p>Total Products</p>
        </div>
        <div class="stat-card" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
          <i class="fas fa-tags stat-icon"></i>
          <h3>{{ totalCategories }}</h3>
          <p>Categories</p>
        </div>
        <div class="stat-card" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
          <i class="fas fa-truck stat-icon"></i>
          <h3>{{ totalSuppliers }}</h3>
          <p>Suppliers</p>
        </div>
      </div>

      <div class="card">
        <h2><i class="fas fa-exclamation-triangle"></i> Low Stock Alert</h2>
        <div *ngIf="lowStockProducts.length === 0" class="text-center">
          <p>All products are well stocked!</p>
        </div>
        <table *ngIf="lowStockProducts.length > 0">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Current Stock</th>
              <th>Min Level</th>
              <th>Unit</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let product of lowStockProducts">
              <td>{{ product.name }}</td>
              <td>
                <span class="badge badge-danger">{{ product.currentStock }}</span>
              </td>
              <td>{{ product.minStockLevel }}</td>
              <td>{{ product.unit }}</td>
              <td>
                <button class="btn btn-primary btn-sm" (click)="orderProduct(product)">
                  Order Now
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .dashboard h1 {
      margin-bottom: 30px;
      color: #333;
    }
    .stat-icon {
      font-size: 48px;
      opacity: 0.3;
      position: absolute;
      right: 20px;
      top: 20px;
    }
    .stat-card {
      position: relative;
      overflow: hidden;
    }
    .stat-card h3 {
      position: relative;
      z-index: 1;
    }
    .stat-card p {
      position: relative;
      z-index: 1;
    }
  `]
})
export class DashboardComponent implements OnInit {
  totalProducts = 0;
  totalCategories = 0;
  totalSuppliers = 0;
  lowStockProducts: Product[] = [];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private supplierService: SupplierService,
    private transactionService: TransactionService
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.productService.getAllProducts().subscribe(products => {
      this.totalProducts = products.length;
    });

    this.categoryService.getAllCategories().subscribe(categories => {
      this.totalCategories = categories.length;
    });

    this.supplierService.getAllSuppliers().subscribe(suppliers => {
      this.totalSuppliers = suppliers.length;
    });

    this.productService.getLowStockProducts().subscribe(products => {
      this.lowStockProducts = products;
    });
  }

  orderProduct(product: Product): void {
    // In a real app, this would open a modal or navigate to order page
    alert(`Order product: ${product.name}`);
  }
}
