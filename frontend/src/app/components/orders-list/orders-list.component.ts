import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PurchaseOrderService } from '../../services/purchase-order.service';
import { NotificationService } from '../../services/notification.service';
import { PurchaseOrder, OrderStatus, PaymentStatus } from '../../models/purchase-order.model';

@Component({
  selector: 'app-orders-list',
  template: `
    <div class="orders-container">
      <div class="page-header">
        <h1><i class="fas fa-clipboard-list"></i> Purchase Orders</h1>
        <div class="header-actions">
          <button class="btn btn-primary" (click)="navigateToProducts()">
            <i class="fas fa-plus"></i> New Order
          </button>
        </div>
      </div>

      <div class="filters card">
        <div class="filter-group">
          <label>Filter by Status:</label>
          <select [(ngModel)]="filterStatus" (change)="applyFilters()" class="form-control">
            <option value="">All Orders</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Payment Status:</label>
          <select [(ngModel)]="filterPayment" (change)="applyFilters()" class="form-control">
            <option value="">All Payments</option>
            <option value="PENDING">Payment Pending</option>
            <option value="PARTIAL">Partial Payment</option>
            <option value="PAID">Paid</option>
          </select>
        </div>
        <div class="filter-stats">
          <span class="stat">
            <i class="fas fa-file-invoice"></i> 
            Total: {{ filteredOrders.length }}
          </span>
          <span class="stat">
            <i class="fas fa-truck"></i> 
            Pending Delivery: {{ getPendingDeliveryCount() }}
          </span>
          <span class="stat">
            <i class="fas fa-exclamation-circle"></i> 
            Payment Due: {{ getPaymentDueCount() }}
          </span>
        </div>
      </div>

      <div class="orders-grid">
        <div class="order-card" *ngFor="let order of paginatedOrders" 
             [class.pending]="order.status === 'PENDING'"
             [class.delivered]="order.status === 'DELIVERED'"
             [class.cancelled]="order.status === 'CANCELLED'">
          
          <div class="order-header">
            <div class="order-number">
              <h3>{{ order.orderNumber }}</h3>
              <span class="order-date">{{ formatDate(order.orderDate) }}</span>
            </div>
            <div class="order-badges">
              <span class="status-badge" [class]="getStatusClass(order.status)">
                <i class="fas" [class]="getStatusIcon(order.status)"></i>
                {{ order.status }}
              </span>
              <span class="payment-badge" [class]="getPaymentClass(order.paymentStatus)">
                <i class="fas fa-credit-card"></i>
                {{ order.paymentStatus }}
              </span>
            </div>
          </div>

          <div class="order-body">
            <div class="order-detail">
              <i class="fas fa-box"></i>
              <div>
                <strong>{{ order.productName }}</strong>
                <span>{{ order.quantity }} units @ ₹{{ order.unitPrice }}</span>
              </div>
            </div>
            
            <div class="order-detail">
              <i class="fas fa-truck"></i>
              <div>
                <strong>{{ order.supplierName }}</strong>
                <span>Delivery: {{ formatDate(order.expectedDeliveryDate) }}</span>
              </div>
            </div>

            <div class="order-amount">
              <span class="label">Total Amount</span>
              <span class="value">₹{{ order.totalAmount | number:'1.2-2' }}</span>
            </div>
          </div>

          <div class="order-actions">
            <button class="btn btn-sm btn-info" (click)="viewOrder(order)">
              <i class="fas fa-eye"></i> View
            </button>
            <button class="btn btn-sm btn-primary" 
                    *ngIf="order.status !== 'DELIVERED' && order.status !== 'CANCELLED'"
                    (click)="openStatusModal(order)">
              <i class="fas fa-edit"></i> Update
            </button>
            <button class="btn btn-sm btn-success" 
                    *ngIf="order.paymentStatus !== 'PAID'"
                    (click)="openPaymentModal(order)">
              <i class="fas fa-money-bill"></i> Payment
            </button>
          </div>
        </div>
      </div>

      <div class="no-orders" *ngIf="filteredOrders.length === 0">
        <i class="fas fa-inbox"></i>
        <p>No orders found</p>
        <button class="btn btn-primary" (click)="navigateToProducts()">
          <i class="fas fa-plus"></i> Create First Order
        </button>
      </div>

      <!-- Pagination -->
      <div class="pagination" *ngIf="totalPages > 1">
        <button class="btn btn-sm" (click)="goToPage(currentPage - 1)" 
                [disabled]="currentPage === 1">
          <i class="fas fa-chevron-left"></i> Previous
        </button>
        <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
        <button class="btn btn-sm" (click)="goToPage(currentPage + 1)" 
                [disabled]="currentPage === totalPages">
          Next <i class="fas fa-chevron-right"></i>
        </button>
      </div>

      <!-- Status Update Modal -->
      <div class="modal-backdrop" *ngIf="showStatusModal" (click)="closeStatusModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2 class="modal-title">Update Order Status</h2>
            <button class="close-btn" (click)="closeStatusModal()">&times;</button>
          </div>
          <div class="modal-body" *ngIf="selectedOrder">
            <p class="order-info">Order: <strong>{{ selectedOrder.orderNumber }}</strong></p>
            <p class="order-info">Current Status: <strong>{{ selectedOrder.status }}</strong></p>
            
            <div class="form-group">
              <label>New Status</label>
              <select [(ngModel)]="newStatus" class="form-control">
                <option value="">Select status</option>
                <option value="CONFIRMED" *ngIf="selectedOrder.status === 'PENDING'">Confirmed</option>
                <option value="SHIPPED" *ngIf="selectedOrder.status === 'CONFIRMED'">Shipped</option>
                <option value="DELIVERED" *ngIf="selectedOrder.status === 'SHIPPED'">Delivered</option>
                <option value="CANCELLED" *ngIf="selectedOrder.status !== 'DELIVERED' && selectedOrder.status !== 'CANCELLED'">Cancelled</option>
              </select>
            </div>

            <div class="alert alert-info" *ngIf="newStatus === 'DELIVERED'">
              <i class="fas fa-info-circle"></i>
              <span>Marking as delivered will automatically update the product stock.</span>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="closeStatusModal()">Cancel</button>
            <button class="btn btn-primary" (click)="updateStatus()" [disabled]="!newStatus">
              Update Status
            </button>
          </div>
        </div>
      </div>

      <!-- Payment Update Modal -->
      <div class="modal-backdrop" *ngIf="showPaymentModal" (click)="closePaymentModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2 class="modal-title">Update Payment Status</h2>
            <button class="close-btn" (click)="closePaymentModal()">&times;</button>
          </div>
          <div class="modal-body" *ngIf="selectedOrder">
            <p class="order-info">Order: <strong>{{ selectedOrder.orderNumber }}</strong></p>
            <p class="order-info">Amount: <strong>₹{{ selectedOrder.totalAmount | number:'1.2-2' }}</strong></p>
            
            <div class="form-group">
              <label>Payment Status</label>
              <select [(ngModel)]="paymentStatus" class="form-control">
                <option value="">Select status</option>
                <option value="PAID">Paid</option>
                <option value="PARTIAL">Partial Payment</option>
                <option value="PENDING">Pending</option>
              </select>
            </div>

            <div class="form-group">
              <label>Payment Method</label>
              <select [(ngModel)]="paymentMethod" class="form-control">
                <option value="">Select method</option>
                <option value="CASH">Cash</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="CHEQUE">Cheque</option>
                <option value="CREDIT">Credit</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="closePaymentModal()">Cancel</button>
            <button class="btn btn-primary" (click)="updatePayment()" 
                    [disabled]="!paymentStatus || !paymentMethod">
              Update Payment
            </button>
          </div>
        </div>
      </div>

      <!-- Order Details Modal -->
      <div class="modal-backdrop" *ngIf="showViewModal" (click)="closeViewModal()">
        <div class="modal large" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2 class="modal-title">Order Details</h2>
            <button class="close-btn" (click)="closeViewModal()">&times;</button>
          </div>
          <div class="modal-body" *ngIf="selectedOrder">
            <div class="order-details-grid">
              <div class="detail-section">
                <h3><i class="fas fa-file-invoice"></i> Order Information</h3>
                <div class="detail-row">
                  <span class="label">Order Number:</span>
                  <span class="value">{{ selectedOrder.orderNumber }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Order Date:</span>
                  <span class="value">{{ formatDate(selectedOrder.orderDate) }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Status:</span>
                  <span class="value">
                    <span class="status-badge" [class]="getStatusClass(selectedOrder.status)">
                      {{ selectedOrder.status }}
                    </span>
                  </span>
                </div>
              </div>

              <div class="detail-section">
                <h3><i class="fas fa-box"></i> Product Details</h3>
                <div class="detail-row">
                  <span class="label">Product:</span>
                  <span class="value">{{ selectedOrder.productName }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Quantity:</span>
                  <span class="value">{{ selectedOrder.quantity }} units</span>
                </div>
                <div class="detail-row">
                  <span class="label">Unit Price:</span>
                  <span class="value">₹{{ selectedOrder.unitPrice }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Total Amount:</span>
                  <span class="value amount">₹{{ selectedOrder.totalAmount | number:'1.2-2' }}</span>
                </div>
              </div>

              <div class="detail-section">
                <h3><i class="fas fa-truck"></i> Supplier & Delivery</h3>
                <div class="detail-row">
                  <span class="label">Supplier:</span>
                  <span class="value">{{ selectedOrder.supplierName }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Expected Delivery:</span>
                  <span class="value">{{ formatDate(selectedOrder.expectedDeliveryDate) }}</span>
                </div>
              </div>

              <div class="detail-section">
                <h3><i class="fas fa-credit-card"></i> Payment Information</h3>
                <div class="detail-row">
                  <span class="label">Payment Status:</span>
                  <span class="value">
                    <span class="payment-badge" [class]="getPaymentClass(selectedOrder.paymentStatus)">
                      {{ selectedOrder.paymentStatus }}
                    </span>
                  </span>
                </div>
                <div class="detail-row" *ngIf="selectedOrder.paymentMethod">
                  <span class="label">Payment Method:</span>
                  <span class="value">{{ selectedOrder.paymentMethod }}</span>
                </div>
                <div class="detail-row" *ngIf="selectedOrder.paymentDate">
                  <span class="label">Payment Date:</span>
                  <span class="value">{{ formatDate(selectedOrder.paymentDate) }}</span>
                </div>
              </div>
            </div>

            <div class="notes-section" *ngIf="selectedOrder.notes">
              <h3><i class="fas fa-sticky-note"></i> Notes</h3>
              <p>{{ selectedOrder.notes }}</p>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="closeViewModal()">Close</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .orders-container {
      padding: 20px;
      max-width: 1400px;
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

    /* Filters */
    .filters {
      display: flex;
      gap: 20px;
      align-items: flex-end;
      padding: 20px;
      margin-bottom: 30px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .filter-group {
      flex: 1;
    }

    .filter-group label {
      display: block;
      margin-bottom: 8px;
      color: #555;
      font-weight: 500;
      font-size: 14px;
    }

    .form-control {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
    }

    .filter-stats {
      display: flex;
      gap: 20px;
      align-items: center;
    }

    .stat {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #666;
      font-size: 14px;
    }

    .stat i {
      color: #1976d2;
    }

    /* Orders Grid */
    .orders-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .order-card {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      padding: 20px;
      transition: all 0.3s;
      position: relative;
      overflow: hidden;
    }

    .order-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background: #1976d2;
    }

    .order-card.pending::before {
      background: #ff9800;
    }

    .order-card.delivered::before {
      background: #4caf50;
    }

    .order-card.cancelled::before {
      background: #f44336;
    }

    .order-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      transform: translateY(-2px);
    }

    /* Order Header */
    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #f0f0f0;
    }

    .order-number h3 {
      margin: 0;
      color: #333;
      font-size: 18px;
    }

    .order-date {
      color: #666;
      font-size: 13px;
      display: block;
      margin-top: 5px;
    }

    .order-badges {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .status-badge, .payment-badge {
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .status-badge {
      background: #e3f2fd;
      color: #1976d2;
    }

    .status-badge.pending {
      background: #fff3e0;
      color: #ff9800;
    }

    .status-badge.confirmed {
      background: #e8f5e9;
      color: #4caf50;
    }

    .status-badge.shipped {
      background: #e1f5fe;
      color: #03a9f4;
    }

    .status-badge.delivered {
      background: #e8f5e9;
      color: #4caf50;
    }

    .status-badge.cancelled {
      background: #ffebee;
      color: #f44336;
    }

    .payment-badge {
      background: #f3e5f5;
      color: #9c27b0;
    }

    .payment-badge.paid {
      background: #e8f5e9;
      color: #4caf50;
    }

    .payment-badge.pending {
      background: #ffebee;
      color: #f44336;
    }

    .payment-badge.partial {
      background: #fff3e0;
      color: #ff9800;
    }

    /* Order Body */
    .order-body {
      margin-bottom: 20px;
    }

    .order-detail {
      display: flex;
      gap: 15px;
      margin-bottom: 15px;
    }

    .order-detail i {
      color: #1976d2;
      font-size: 20px;
      margin-top: 3px;
    }

    .order-detail div {
      flex: 1;
    }

    .order-detail strong {
      display: block;
      color: #333;
      margin-bottom: 3px;
    }

    .order-detail span {
      color: #666;
      font-size: 14px;
    }

    .order-amount {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
      margin-top: 15px;
    }

    .order-amount .label {
      color: #666;
      font-size: 14px;
    }

    .order-amount .value {
      font-size: 20px;
      font-weight: 700;
      color: #1976d2;
    }

    /* Order Actions */
    .order-actions {
      display: flex;
      gap: 10px;
      padding-top: 15px;
      border-top: 1px solid #f0f0f0;
    }

    .order-actions .btn {
      flex: 1;
    }

    /* No Orders */
    .no-orders {
      text-align: center;
      padding: 80px 20px;
      background: #f8f9fa;
      border-radius: 12px;
    }

    .no-orders i {
      font-size: 64px;
      color: #ddd;
      display: block;
      margin-bottom: 20px;
    }

    .no-orders p {
      color: #666;
      font-size: 18px;
      margin-bottom: 20px;
    }

    /* Pagination */
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 20px;
      margin-top: 30px;
    }

    .page-info {
      font-weight: 500;
      color: #555;
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
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal.large {
      max-width: 800px;
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

    .order-info {
      margin-bottom: 15px;
      color: #666;
    }

    .order-info strong {
      color: #333;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      color: #555;
      font-weight: 500;
    }

    .alert {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      border-radius: 8px;
      margin-top: 20px;
    }

    .alert-info {
      background: #e3f2fd;
      color: #1976d2;
    }

    /* Order Details Modal */
    .order-details-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 30px;
    }

    .detail-section {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
    }

    .detail-section h3 {
      margin: 0 0 15px 0;
      font-size: 16px;
      color: #555;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .detail-section h3 i {
      color: #1976d2;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #e0e0e0;
    }

    .detail-row:last-child {
      border-bottom: none;
    }

    .detail-row .label {
      color: #666;
      font-size: 14px;
    }

    .detail-row .value {
      color: #333;
      font-weight: 500;
      font-size: 14px;
    }

    .detail-row .value.amount {
      font-size: 18px;
      color: #1976d2;
    }

    .notes-section {
      margin-top: 30px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .notes-section h3 {
      margin: 0 0 15px 0;
      font-size: 16px;
      color: #555;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .notes-section p {
      margin: 0;
      color: #666;
      line-height: 1.6;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .filters {
        flex-direction: column;
      }

      .filter-stats {
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid #eee;
      }

      .orders-grid {
        grid-template-columns: 1fr;
      }

      .order-details-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class OrdersListComponent implements OnInit {
  orders: PurchaseOrder[] = [];
  filteredOrders: PurchaseOrder[] = [];
  paginatedOrders: PurchaseOrder[] = [];
  
  filterStatus: string = '';
  filterPayment: string = '';
  
  currentPage = 1;
  itemsPerPage = 9;
  totalPages = 0;

  // Modal states
  showStatusModal = false;
  showPaymentModal = false;
  showViewModal = false;
  selectedOrder: PurchaseOrder | null = null;
  
  // Form data
  newStatus: string = '';
  paymentStatus: string = '';
  paymentMethod: string = '';

  constructor(
    private router: Router,
    private purchaseOrderService: PurchaseOrderService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.purchaseOrderService.getAllPurchaseOrders().subscribe({
      next: (orders) => {
        // Sort by order date descending (newest first)
        this.orders = orders.sort((a, b) => {
          const dateA = new Date(a.orderDate || 0).getTime();
          const dateB = new Date(b.orderDate || 0).getTime();
          return dateB - dateA;
        });
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.notificationService.showError('Failed to load orders');
      }
    });
  }

  applyFilters() {
    this.filteredOrders = this.orders;

    if (this.filterStatus) {
      this.filteredOrders = this.filteredOrders.filter(
        order => order.status === this.filterStatus
      );
    }

    if (this.filterPayment) {
      this.filteredOrders = this.filteredOrders.filter(
        order => order.paymentStatus === this.filterPayment
      );
    }

    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredOrders.length / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, Math.max(1, this.totalPages));
    
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedOrders = this.filteredOrders.slice(start, end);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  getPendingDeliveryCount(): number {
    return this.orders.filter(o => 
      o.status !== 'DELIVERED' && o.status !== 'CANCELLED'
    ).length;
  }

  getPaymentDueCount(): number {
    return this.orders.filter(o => 
      o.paymentStatus === 'PENDING' || o.paymentStatus === 'PARTIAL'
    ).length;
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

  getStatusClass(status: OrderStatus | undefined): string {
    if (!status) return '';
    return status.toLowerCase();
  }

  getStatusIcon(status: OrderStatus | undefined): string {
    switch (status) {
      case OrderStatus.PENDING: return 'fa-clock';
      case OrderStatus.CONFIRMED: return 'fa-check-circle';
      case OrderStatus.SHIPPED: return 'fa-shipping-fast';
      case OrderStatus.DELIVERED: return 'fa-check-double';
      case OrderStatus.CANCELLED: return 'fa-times-circle';
      default: return 'fa-question-circle';
    }
  }

  getPaymentClass(status: PaymentStatus | undefined): string {
    if (!status) return '';
    return status.toLowerCase();
  }

  viewOrder(order: PurchaseOrder) {
    this.selectedOrder = order;
    this.showViewModal = true;
  }

  closeViewModal() {
    this.showViewModal = false;
    this.selectedOrder = null;
  }

  openStatusModal(order: PurchaseOrder) {
    this.selectedOrder = order;
    this.showStatusModal = true;
    this.newStatus = '';
  }

  closeStatusModal() {
    this.showStatusModal = false;
    this.selectedOrder = null;
    this.newStatus = '';
  }

  updateStatus() {
    if (!this.selectedOrder || !this.newStatus) return;

    try {
      const status = OrderStatus[this.newStatus as keyof typeof OrderStatus];
      if (status) {
        this.selectedOrder.status = status;
        this.purchaseOrderService.updatePurchaseOrder(this.selectedOrder.id!, this.selectedOrder).subscribe({
          next: () => {
            this.notificationService.showSuccess('Order status updated successfully!');
            this.loadOrders();
            this.closeStatusModal();
          },
          error: (error) => {
            console.error('Error updating order:', error);
            this.notificationService.showError('Failed to update order status');
          }
        });
      }
    } catch (e) {
      this.notificationService.showError('Invalid status selected');
    }
  }

  openPaymentModal(order: PurchaseOrder) {
    this.selectedOrder = order;
    this.showPaymentModal = true;
    this.paymentStatus = '';
    this.paymentMethod = '';
  }

  closePaymentModal() {
    this.showPaymentModal = false;
    this.selectedOrder = null;
    this.paymentStatus = '';
    this.paymentMethod = '';
  }

  updatePayment() {
    if (!this.selectedOrder || !this.paymentStatus || !this.paymentMethod) return;

    this.purchaseOrderService.updatePaymentStatus(this.selectedOrder.id!, {
      status: this.paymentStatus,
      paymentMethod: this.paymentMethod
    }).subscribe({
      next: () => {
        this.notificationService.showSuccess('Payment status updated successfully!');
        this.loadOrders();
        this.closePaymentModal();
      },
      error: (error) => {
        console.error('Error updating payment:', error);
        this.notificationService.showError('Failed to update payment status');
      }
    });
  }

  navigateToProducts() {
    this.router.navigate(['/products']);
  }
}
