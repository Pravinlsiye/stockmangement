import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PurchaseOrderService } from '../../services/purchase-order.service';
import { NotificationService } from '../../services/notification.service';
import { PurchaseOrder, PaymentStatus } from '../../models/purchase-order.model';
import { Product } from '../../models/product.model';
import { ProductSupplierDetails } from '../../models/product-supplier.model';

@Component({
  selector: 'app-create-order',
  template: `
    <div class="create-order-container">
      <div class="page-header">
        <h1><i class="fas fa-file-invoice"></i> Create Purchase Order</h1>
        <button class="btn btn-secondary" (click)="showCancelModal = true">
          <i class="fas fa-times"></i> Cancel
        </button>
      </div>

      <div class="order-form-container" *ngIf="order">
        <div class="order-preview card">
          <h2>Order Details</h2>
          
          <div class="detail-section">
            <h3><i class="fas fa-box"></i> Product Information</h3>
            <div class="detail-grid">
              <div class="detail-item">
                <span class="label">Product:</span>
                <span class="value">{{ order.productName }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Unit Price:</span>
                <span class="value">₹{{ order.unitPrice }}</span>
              </div>
            </div>
          </div>

          <div class="detail-section">
            <h3><i class="fas fa-truck"></i> Supplier Information</h3>
            <div class="detail-grid">
              <div class="detail-item">
                <span class="label">Supplier:</span>
                <span class="value">{{ order.supplierName }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Expected Delivery:</span>
                <span class="value">{{ formatDate(order.expectedDeliveryDate) }}</span>
              </div>
            </div>
          </div>

          <form (ngSubmit)="submitOrder()">
            <div class="form-section">
              <h3><i class="fas fa-shopping-cart"></i> Order Quantity</h3>
              <div class="form-grid">
                <div class="form-group">
                  <label>Quantity <span class="required">*</span></label>
                  <input type="number" 
                         [(ngModel)]="order.quantity" 
                         name="quantity"
                         (input)="updateTotal()"
                         class="form-control" 
                         min="1" 
                         required>
                  <small class="form-text">Minimum order: {{ minOrderQty }} units</small>
                </div>
                <div class="form-group">
                  <label>Total Amount</label>
                  <div class="total-amount">₹{{ order.totalAmount || 0 | number:'1.2-2' }}</div>
                </div>
              </div>
            </div>

            <div class="form-section">
              <h3><i class="fas fa-credit-card"></i> Payment Details</h3>
              <div class="form-grid">
                <div class="form-group">
                  <label>Payment Method</label>
                  <select [(ngModel)]="paymentMethod" name="paymentMethod" class="form-control">
                    <option value="">Select payment method</option>
                    <option value="CASH">Cash</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="CHEQUE">Cheque</option>
                    <option value="CREDIT">Credit (Pay Later)</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Payment Status</label>
                  <select [(ngModel)]="order.paymentStatus" name="paymentStatus" class="form-control">
                    <option value="PENDING">Pending</option>
                    <option value="PARTIAL">Partial Payment</option>
                    <option value="PAID">Paid</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="form-section">
              <h3><i class="fas fa-calendar-alt"></i> Delivery Information</h3>
              <div class="form-group">
                <label>Expected Delivery Date</label>
                <input type="date" 
                       [(ngModel)]="deliveryDateStr" 
                       name="deliveryDate"
                       class="form-control">
                <small class="form-text">
                  Supplier's standard delivery: {{ supplierDeliveryDays }} days
                </small>
              </div>
            </div>

            <div class="form-section">
              <h3><i class="fas fa-sticky-note"></i> Additional Notes</h3>
              <div class="form-group">
                <textarea [(ngModel)]="order.notes" 
                          name="notes"
                          class="form-control" 
                          rows="3"
                          placeholder="Add any special instructions or notes..."></textarea>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-secondary" (click)="showCancelModal = true">
                <i class="fas fa-times"></i> Cancel
              </button>
              <button type="submit" class="btn btn-primary" [disabled]="!isValid()">
                <i class="fas fa-check"></i> Create Order
              </button>
            </div>
          </form>
        </div>

        <div class="order-summary card">
          <h3>Order Summary</h3>
          <div class="summary-item">
            <span>Product:</span>
            <strong>{{ order.productName }}</strong>
          </div>
          <div class="summary-item">
            <span>Quantity:</span>
            <strong>{{ order.quantity }} units</strong>
          </div>
          <div class="summary-item">
            <span>Unit Price:</span>
            <strong>₹{{ order.unitPrice }}</strong>
          </div>
          <div class="summary-divider"></div>
          <div class="summary-item total">
            <span>Total Amount:</span>
            <strong>₹{{ order.totalAmount || 0 | number:'1.2-2' }}</strong>
          </div>
          <div class="summary-divider"></div>
          <div class="summary-item">
            <span>Supplier:</span>
            <strong>{{ order.supplierName }}</strong>
          </div>
          <div class="summary-item">
            <span>Expected Delivery:</span>
            <strong>{{ formatDate(order.expectedDeliveryDate) }}</strong>
          </div>
        </div>
      </div>

      <div class="no-data" *ngIf="!order">
        <i class="fas fa-exclamation-circle"></i>
        <p>No order data found. Please go back and select a supplier.</p>
        <button class="btn btn-primary" (click)="goBack()">
          <i class="fas fa-arrow-left"></i> Go Back
        </button>
      </div>

      <!-- Cancel Confirmation Modal -->
      <div class="modal-backdrop" *ngIf="showCancelModal" (click)="closeCancelModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2 class="modal-title">Cancel Order Creation</h2>
            <button class="close-btn" (click)="closeCancelModal()">&times;</button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to cancel creating this order? All entered data will be lost.</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="closeCancelModal()">Continue Editing</button>
            <button class="btn btn-danger" (click)="confirmCancel()">
              <i class="fas fa-times"></i> Cancel Order
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .create-order-container {
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

    .order-form-container {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: 30px;
    }

    .order-preview {
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .order-preview h2 {
      margin: 0 0 30px 0;
      color: #333;
      font-size: 24px;
    }

    .detail-section {
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid #eee;
    }

    .detail-section:last-of-type {
      border-bottom: none;
    }

    .detail-section h3 {
      margin: 0 0 15px 0;
      color: #555;
      font-size: 18px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .detail-section h3 i {
      color: #1976d2;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .detail-item .label {
      color: #666;
      font-size: 14px;
    }

    .detail-item .value {
      color: #333;
      font-size: 16px;
      font-weight: 600;
    }

    .form-section {
      margin-bottom: 30px;
    }

    .form-section h3 {
      margin: 0 0 20px 0;
      color: #555;
      font-size: 18px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .form-section h3 i {
      color: #1976d2;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    .form-group {
      margin-bottom: 0;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      color: #555;
      font-weight: 500;
    }

    .required {
      color: #dc3545;
    }

    .form-control {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 15px;
      transition: border-color 0.3s;
    }

    .form-control:focus {
      outline: none;
      border-color: #1976d2;
      box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
    }

    .form-text {
      display: block;
      margin-top: 5px;
      color: #666;
      font-size: 13px;
    }

    .total-amount {
      font-size: 24px;
      font-weight: 700;
      color: #1976d2;
      padding: 10px 0;
    }

    textarea.form-control {
      resize: vertical;
      min-height: 80px;
    }

    .form-actions {
      display: flex;
      gap: 15px;
      justify-content: flex-end;
      margin-top: 30px;
      padding-top: 30px;
      border-top: 1px solid #eee;
    }

    /* Order Summary Sidebar */
    .order-summary {
      background: white;
      padding: 25px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      position: sticky;
      top: 20px;
      height: fit-content;
    }

    .order-summary h3 {
      margin: 0 0 20px 0;
      color: #333;
      font-size: 20px;
    }

    .summary-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      font-size: 15px;
    }

    .summary-item span {
      color: #666;
    }

    .summary-item strong {
      color: #333;
    }

    .summary-item.total {
      font-size: 18px;
    }

    .summary-item.total strong {
      color: #1976d2;
    }

    .summary-divider {
      height: 1px;
      background: #eee;
      margin: 15px 0;
    }

    /* No Data */
    .no-data {
      text-align: center;
      padding: 60px;
      background: #f8f9fa;
      border-radius: 12px;
    }

    .no-data i {
      font-size: 48px;
      color: #ddd;
      display: block;
      margin-bottom: 20px;
    }

    .no-data p {
      color: #666;
      font-size: 16px;
      margin-bottom: 20px;
    }

    /* Modal Styles */
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      max-width: 500px;
      width: 90%;
    }

    .modal-header {
      padding: 20px;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-title {
      margin: 0;
      font-size: 20px;
      color: #333;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 24px;
      color: #999;
      cursor: pointer;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: all 0.3s;
    }

    .close-btn:hover {
      background: #f5f5f5;
      color: #333;
    }

    .modal-body {
      padding: 20px;
    }

    .modal-footer {
      padding: 20px;
      border-top: 1px solid #eee;
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .order-form-container {
        grid-template-columns: 1fr;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .detail-grid {
        grid-template-columns: 1fr;
      }

      .order-summary {
        position: static;
      }
    }
  `]
})
export class CreateOrderComponent implements OnInit {
  order: PurchaseOrder | null = null;
  product: Product | null = null;
  supplier: ProductSupplierDetails | null = null;
  
  minOrderQty: number = 0;
  supplierDeliveryDays: number = 0;
  deliveryDateStr: string = '';
  paymentMethod: string = '';
  
  showCancelModal = false;

  constructor(
    private router: Router,
    private purchaseOrderService: PurchaseOrderService,
    private notificationService: NotificationService
  ) {
    // Get navigation state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.order = navigation.extras.state['order'];
      this.product = navigation.extras.state['product'];
      this.supplier = navigation.extras.state['supplier'];
      
      if (this.supplier) {
        this.minOrderQty = this.supplier.minimumOrderQuantity;
        this.supplierDeliveryDays = this.supplier.deliveryDays;
      }
    }
  }

  ngOnInit() {
    if (this.order) {
      // Convert date to string for input
      if (this.order.expectedDeliveryDate) {
        const date = new Date(this.order.expectedDeliveryDate);
        this.deliveryDateStr = date.toISOString().split('T')[0];
      }
      
      // Set default payment status
      if (!this.order.paymentStatus) {
        this.order.paymentStatus = PaymentStatus.PENDING;
      }
    }
  }

  updateTotal() {
    if (this.order && this.order.quantity && this.order.unitPrice) {
      this.order.totalAmount = this.order.quantity * this.order.unitPrice;
    }
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  isValid(): boolean {
    return !!(this.order && 
             this.order.quantity && 
             this.order.quantity >= this.minOrderQty &&
             this.deliveryDateStr);
  }

  submitOrder() {
    if (!this.order || !this.isValid()) return;

    // Update delivery date from string
    this.order.expectedDeliveryDate = new Date(this.deliveryDateStr);
    
    // Set payment method
    if (this.paymentMethod) {
      this.order.paymentMethod = this.paymentMethod;
    }

    // Create the order
    this.purchaseOrderService.createPurchaseOrder(this.order).subscribe({
      next: (createdOrder) => {
        this.notificationService.showSuccess(`Order ${createdOrder.orderNumber} created successfully!`);
        this.router.navigate(['/orders']);
      },
      error: (error) => {
        console.error('Error creating order:', error);
        this.notificationService.showError('Failed to create order. Please try again.');
      }
    });
  }

  closeCancelModal() {
    this.showCancelModal = false;
  }

  confirmCancel() {
    this.goBack();
  }

  goBack() {
    this.router.navigate(['/order-now', this.product?.id || '']);
  }
}
