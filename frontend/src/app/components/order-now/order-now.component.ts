import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ProductSupplierService } from '../../services/product-supplier.service';
import { PurchaseOrderService } from '../../services/purchase-order.service';
import { NotificationService } from '../../services/notification.service';
import { Product } from '../../models/product.model';
import { ProductSupplierDetails } from '../../models/product-supplier.model';
import { PurchaseOrder } from '../../models/purchase-order.model';

@Component({
  selector: 'app-order-now',
  template: `
    <div class="order-container">
      <div class="page-header">
        <h1><i class="fas fa-shopping-basket"></i> Order Product</h1>
        <button class="btn btn-secondary" (click)="goBack()">
          <i class="fas fa-arrow-left"></i> Back
        </button>
      </div>

      <div class="product-info card" *ngIf="product">
        <div class="product-header">
          <div>
            <h2>{{ product.name }}</h2>
            <p class="product-desc">{{ product.description }}</p>
            <p class="barcode"><i class="fas fa-barcode"></i> {{ product.barcode }}</p>
          </div>
          <div class="stock-info">
            <div class="stock-status" [class.low-stock]="product.currentStock < product.minStockLevel">
              <h3>Current Stock</h3>
              <p class="stock-value">{{ product.currentStock }} {{ product.unit }}</p>
            </div>
            <div class="min-stock">
              <h3>Min. Stock Level</h3>
              <p class="stock-value">{{ product.minStockLevel }} {{ product.unit }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="suppliers-section">
        <h2><i class="fas fa-truck"></i> Available Suppliers</h2>
        
        <div class="loading" *ngIf="loading">
          <i class="fas fa-spinner fa-spin"></i> Loading suppliers...
        </div>

        <div class="no-suppliers" *ngIf="!loading && suppliers.length === 0">
          <i class="fas fa-exclamation-circle"></i>
          <p>No suppliers available for this product.</p>
          <p>Please contact procurement team to add suppliers.</p>
        </div>

        <div class="suppliers-grid" *ngIf="!loading && suppliers.length > 0">
          <div class="supplier-card" *ngFor="let supplier of suppliers" 
               [class.preferred]="supplier.isPreferred">
            <div class="supplier-header">
              <h3>{{ supplier.supplierName }}</h3>
              <span class="preferred-badge" *ngIf="supplier.isPreferred">
                <i class="fas fa-star"></i> Preferred
              </span>
            </div>
            
            <div class="supplier-details">
              <div class="detail-row">
                <span class="label">Cost per unit:</span>
                <span class="value price">₹{{ supplier.costPerUnit }}</span>
              </div>
              
              <div class="detail-row">
                <span class="label">Delivery time:</span>
                <span class="value">
                  <i class="fas fa-clock"></i> {{ supplier.deliveryDays }} 
                  {{ supplier.deliveryDays === 1 ? 'day' : 'days' }}
                </span>
              </div>
              
              <div class="detail-row">
                <span class="label">Min. order quantity:</span>
                <span class="value">{{ supplier.minimumOrderQuantity }} {{ product?.unit }}</span>
              </div>
              
              <div class="detail-row">
                <span class="label">Total for min. order:</span>
                <span class="value total-price">₹{{ supplier.totalCostForMinOrder }}</span>
              </div>
              
              <div class="contact-section">
                <h4><i class="fas fa-address-book"></i> Contact Details</h4>
                <div class="contact-info">
                  <p><i class="fas fa-user"></i> {{ supplier.contactPerson }}</p>
                  <p><i class="fas fa-phone"></i> {{ supplier.phone }}</p>
                  <p><i class="fas fa-envelope"></i> {{ supplier.email }}</p>
                  <p><i class="fas fa-map-marker-alt"></i> {{ supplier.address }}</p>
                </div>
              </div>
              
              <div class="supplier-notes" *ngIf="supplier.notes">
                <i class="fas fa-info-circle"></i> {{ supplier.notes }}
              </div>
              
              <div class="action-buttons">
                <button class="btn btn-primary" (click)="createOrder(supplier)">
                  <i class="fas fa-cart-plus"></i> Create Order
                </button>
                <button class="btn btn-secondary" (click)="contactSupplier(supplier)">
                  <i class="fas fa-phone"></i> Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Summary Comparison -->
      <div class="comparison-section" *ngIf="suppliers.length > 1">
        <h3><i class="fas fa-balance-scale"></i> Quick Comparison</h3>
        <table class="comparison-table">
          <thead>
            <tr>
              <th>Supplier</th>
              <th>Unit Cost</th>
              <th>Delivery</th>
              <th>Min. Order</th>
              <th>Total Cost</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let supplier of suppliers" [class.preferred]="supplier.isPreferred">
              <td>
                {{ supplier.supplierName }}
                <span class="preferred-star" *ngIf="supplier.isPreferred">⭐</span>
              </td>
              <td class="price">₹{{ supplier.costPerUnit }}</td>
              <td>{{ supplier.deliveryDays }} days</td>
              <td>{{ supplier.minimumOrderQuantity }} units</td>
              <td class="total-price">₹{{ supplier.totalCostForMinOrder }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .order-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .page-header h1 {
      margin: 0;
      color: #333;
      font-size: 28px;
    }

    /* Product Info Card */
    .product-info {
      margin-bottom: 30px;
    }

    .product-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 30px;
    }

    .product-header h2 {
      margin: 0 0 10px 0;
      color: #333;
    }

    .product-desc {
      color: #666;
      margin: 5px 0;
    }

    .barcode {
      color: #999;
      font-size: 14px;
      margin: 10px 0;
    }

    .stock-info {
      display: flex;
      gap: 30px;
    }

    .stock-status, .min-stock {
      text-align: center;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .stock-status h3, .min-stock h3 {
      margin: 0;
      font-size: 14px;
      color: #666;
      font-weight: 500;
    }

    .stock-value {
      margin: 10px 0 0;
      font-size: 24px;
      font-weight: 700;
      color: #333;
    }

    .stock-status.low-stock {
      background: #fee;
      border: 1px solid #fcc;
    }

    .stock-status.low-stock .stock-value {
      color: #dc3545;
    }

    /* Suppliers Section */
    .suppliers-section {
      margin-bottom: 30px;
    }

    .suppliers-section h2 {
      margin: 0 0 20px 0;
      color: #333;
      font-size: 24px;
    }

    .loading {
      text-align: center;
      padding: 40px;
      color: #666;
      font-size: 18px;
    }

    .loading i {
      margin-right: 10px;
    }

    .no-suppliers {
      text-align: center;
      padding: 60px;
      background: #f8f9fa;
      border-radius: 12px;
      color: #666;
    }

    .no-suppliers i {
      font-size: 48px;
      color: #ddd;
      display: block;
      margin-bottom: 20px;
    }

    .no-suppliers p {
      margin: 10px 0;
      font-size: 16px;
    }

    /* Suppliers Grid */
    .suppliers-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
      gap: 20px;
    }

    .supplier-card {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      padding: 20px;
      transition: all 0.3s;
    }

    .supplier-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      transform: translateY(-2px);
    }

    .supplier-card.preferred {
      border: 2px solid #ffc107;
      background: #fffef5;
    }

    .supplier-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #eee;
    }

    .supplier-header h3 {
      margin: 0;
      color: #333;
      font-size: 20px;
    }

    .preferred-badge {
      background: #ffc107;
      color: #000;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    /* Supplier Details */
    .supplier-details {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #f5f5f5;
    }

    .detail-row:last-of-type {
      border-bottom: none;
    }

    .label {
      color: #666;
      font-size: 14px;
    }

    .value {
      font-weight: 600;
      color: #333;
      font-size: 15px;
    }

    .price {
      color: #28a745;
      font-size: 18px;
    }

    .total-price {
      color: #1976d2;
      font-size: 20px;
    }

    /* Contact Section */
    .contact-section {
      margin-top: 20px;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .contact-section h4 {
      margin: 0 0 15px 0;
      font-size: 16px;
      color: #333;
    }

    .contact-info p {
      margin: 8px 0;
      font-size: 14px;
      color: #555;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .contact-info i {
      color: #999;
      width: 16px;
    }

    .supplier-notes {
      margin-top: 15px;
      padding: 10px;
      background: #e3f2fd;
      border-radius: 6px;
      font-size: 14px;
      color: #1976d2;
    }

    /* Action Buttons */
    .action-buttons {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }

    .action-buttons .btn {
      flex: 1;
    }

    /* Comparison Section */
    .comparison-section {
      background: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      margin-top: 30px;
    }

    .comparison-section h3 {
      margin: 0 0 20px 0;
      color: #333;
      font-size: 20px;
    }

    .comparison-table {
      width: 100%;
      border-collapse: collapse;
    }

    .comparison-table th {
      background: #f8f9fa;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      color: #555;
      border-bottom: 2px solid #dee2e6;
    }

    .comparison-table td {
      padding: 12px;
      border-bottom: 1px solid #f0f0f0;
    }

    .comparison-table tr.preferred {
      background: #fffef5;
    }

    .preferred-star {
      color: #ffc107;
      margin-left: 5px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .suppliers-grid {
        grid-template-columns: 1fr;
      }

      .product-header {
        flex-direction: column;
      }

      .stock-info {
        justify-content: center;
        margin-top: 20px;
      }

      .comparison-table {
        font-size: 14px;
      }

      .comparison-table th,
      .comparison-table td {
        padding: 8px;
      }
    }
  `]
})
export class OrderNowComponent implements OnInit {
  productId: string = '';
  product: Product | null = null;
  suppliers: ProductSupplierDetails[] = [];
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private productSupplierService: ProductSupplierService,
    private purchaseOrderService: PurchaseOrderService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id') || '';
    if (this.productId) {
      this.loadProductDetails();
      this.loadSuppliers();
    }
  }

  loadProductDetails() {
    this.productService.getProductById(this.productId).subscribe({
      next: (product) => {
        this.product = product;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.notificationService.showError('Failed to load product details');
      }
    });
  }

  loadSuppliers() {
    this.productSupplierService.getSupplierDetailsForProduct(this.productId).subscribe({
      next: (suppliers) => {
        this.suppliers = suppliers;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading suppliers:', error);
        this.notificationService.showError('Failed to load supplier information');
        this.loading = false;
      }
    });
  }

  createOrder(supplier: ProductSupplierDetails) {
    if (!this.product) return;

    // Calculate expected delivery date
    const expectedDeliveryDate = new Date();
    expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + supplier.deliveryDays);

    const order: PurchaseOrder = {
      productId: this.product.id!,
      productName: this.product.name,
      supplierId: supplier.supplierId,
      supplierName: supplier.supplierName,
      quantity: supplier.minimumOrderQuantity,
      unitPrice: supplier.costPerUnit,
      totalAmount: supplier.totalCostForMinOrder,
      expectedDeliveryDate: expectedDeliveryDate,
      notes: supplier.notes || ''
    };

    // Navigate to order confirmation page with order details
    this.router.navigate(['/create-order'], { 
      state: { 
        order: order,
        product: this.product,
        supplier: supplier
      }
    });
  }

  contactSupplier(supplier: ProductSupplierDetails) {
    // Open phone dialer or email client
    if (supplier.phone) {
      window.open(`tel:${supplier.phone}`, '_blank');
      this.notificationService.showInfo(`Contacting ${supplier.supplierName}...`);
    }
  }

  goBack() {
    this.router.navigate(['/products']);
  }
}