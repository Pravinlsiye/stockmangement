import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { TransactionService } from '../../services/transaction.service';
import { NotificationService } from '../../services/notification.service';
import { Product } from '../../models/product.model';
import { Transaction, TransactionType } from '../../models/transaction.model';

interface CartItem {
  product: Product;
  quantity: number;
  totalPrice: number;
}

interface ProductSuggestion {
  product: Product;
  matchType: 'name' | 'code';
}

@Component({
  selector: 'app-sales',
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(window:scroll)': 'onWindowScroll()',
    '(window:resize)': 'onWindowResize()'
  },
  template: `
    <div class="sales-page">
      <div class="sales-header">
        <h1><i class="fas fa-cash-register"></i> Sales Terminal</h1>
        <div class="header-info">
          <span>Date: {{ getCurrentDate() }}</span>
          <span>Bill No: {{ billNumber }}</span>
        </div>
      </div>

      <div class="sales-container">
        <!-- Main Cart Table Section -->
        <div class="cart-main-section">
          <div class="cart-header">
            <h2><i class="fas fa-shopping-cart"></i> Shopping Cart</h2>
            <div class="header-actions">
              <button class="btn btn-sm btn-secondary" (click)="clearCart()" *ngIf="cart.length > 0">
                <i class="fas fa-trash"></i> Clear All
              </button>
            </div>
          </div>
          
          <div class="cart-table-container">
            <table class="cart-table">
              <thead>
                <tr>
                  <th width="5%">#</th>
                  <th width="32%">Product</th>
                  <th width="15%">Code</th>
                  <th width="10%" class="price-header">Price</th>
                  <th width="15%" class="quantity-header">Quantity</th>
                  <th width="15%" class="total-header">Total</th>
                  <th width="8%"></th>
                </tr>
              </thead>
            </table>
            
            <!-- Scrollable Cart Items -->
            <div class="cart-items-wrapper">
              <table class="cart-table">
                <tbody>
                  <!-- Existing Cart Items -->
                  <tr *ngFor="let item of cart; let i = index" class="cart-row">
                    <td class="row-number" width="5%">{{ i + 1 }}</td>
                    <td class="product-cell" width="32%">
                      <div class="product-info">
                        <div class="product-name">{{ item.product.name }}</div>
                        <div class="stock-info" [class.low-stock]="item.product.currentStock < 10">
                          Stock: {{ item.product.currentStock }}
                        </div>
                      </div>
                    </td>
                    <td class="code-cell" width="15%">{{ item.product.barcode }}</td>
                    <td class="price-cell" width="10%">₹{{ item.product.sellingPrice }}</td>
                    <td class="quantity-cell" width="15%">
                      <div class="quantity-control">
                        <button class="qty-btn" (click)="decreaseCartItemQuantity(i)">
                          <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" 
                               [(ngModel)]="item.quantity" 
                               (change)="updateItemQuantity(i)" 
                               min="1" 
                               class="qty-input">
                        <button class="qty-btn" (click)="increaseCartItemQuantity(i)">
                          <i class="fas fa-plus"></i>
                        </button>
                      </div>
                    </td>
                    <td class="total-cell" width="15%">₹{{ item.totalPrice }}</td>
                    <td class="action-cell" width="8%">
                      <button class="remove-btn" (click)="removeFromCart(i)">
                        <i class="fas fa-times"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <!-- Search Row (Always Visible) -->
            <div class="search-row-wrapper">
              <table class="cart-table">
                <tbody>
                  <tr class="add-product-row">
                    <td class="row-number" width="5%">{{ cart.length + 1 }}</td>
                    <td colspan="6" class="search-cell">
                      <div class="search-product-input">
                        <i class="fas fa-search search-icon"></i>
                        <input type="text" 
                               [(ngModel)]="searchQuery" 
                               (input)="onSearchInput()"
                               (keydown)="onKeyDown($event)"
                               (keyup.enter)="selectFirstSuggestion()"
                               placeholder="Search product by name or barcode..."
                               class="inline-search-input"
                               autocomplete="off"
                               #searchInput>
                        <button *ngIf="searchQuery" class="clear-btn" (click)="clearSearch()">
                          <i class="fas fa-times"></i>
                        </button>
                      </div>
                      
                      <!-- Inline Suggestions -->
                      <div class="inline-suggestions" 
                           *ngIf="showSuggestions && filteredSuggestions.length > 0"
                           [ngStyle]="dropdownStyle">
                        <div class="suggestion-item" 
                             *ngFor="let suggestion of filteredSuggestions; let i = index"
                             [class.active]="i === selectedSuggestionIndex"
                             [class.out-of-stock]="suggestion.product.currentStock === 0"
                             (click)="suggestion.product.currentStock > 0 ? directAddToCart(suggestion.product) : null; $event.stopPropagation()"
                             (mousedown)="$event.preventDefault()"
                             (mouseenter)="selectedSuggestionIndex = i">
                          <div class="suggestion-content">
                            <span class="product-name">{{ suggestion.product.name }}</span>
                            <span class="product-code">{{ suggestion.product.barcode }}</span>
                            <span class="product-price">₹{{ suggestion.product.sellingPrice }}</span>
                            <span class="product-stock" 
                                  [class.low-stock]="suggestion.product.currentStock < 10 && suggestion.product.currentStock > 0"
                                  [class.out-of-stock]="suggestion.product.currentStock === 0">
                              {{ suggestion.product.currentStock === 0 ? 'Out of Stock' : suggestion.product.currentStock }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="action-cell" width="8%"></td>
                  </tr>
                </table>
            </div>
            
            <!-- Empty State -->
            <div *ngIf="cart.length === 0" class="empty-cart-wrapper">
              <div class="empty-cart-inline">
                <i class="fas fa-shopping-basket"></i>
                <p>Start typing in the search box to add products</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Summary Section -->
        <div class="summary-section">
          <h3>Bill Summary</h3>
          <div class="summary-details">
            <div class="summary-row">
              <span>Sub Total:</span>
              <span>₹{{ calculateSubTotal() }}</span>
            </div>
            <div class="summary-row">
              <span>CGST (9%):</span>
              <span>₹{{ calculateCGST() }}</span>
            </div>
            <div class="summary-row">
              <span>SGST (9%):</span>
              <span>₹{{ calculateSGST() }}</span>
            </div>
            <div class="summary-row total">
              <span>Grand Total:</span>
              <span>₹{{ calculateGrandTotal() }}</span>
            </div>
          </div>
          <div class="action-buttons">
            <button class="btn btn-primary" (click)="generateBill()" 
                    [disabled]="cart.length === 0">
              <i class="fas fa-file-invoice"></i> Generate Bill
            </button>
            <button class="btn btn-secondary" (click)="clearCart()">
              <i class="fas fa-times"></i> Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Stock Error Modal -->
    <div class="stock-error-modal" *ngIf="showStockErrorModal">
      <div class="modal-backdrop" (click)="closeStockErrorModal()"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h3><i class="fas fa-exclamation-triangle"></i> Insufficient Stock</h3>
          <button class="close-btn" (click)="closeStockErrorModal()">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body" *ngIf="stockError">
          <div class="stock-error-info">
            <div class="error-icon">
              <i class="fas fa-box-open"></i>
            </div>
            <div class="error-details">
              <div class="product-name">{{ stockError.productName }}</div>
              <div class="stock-status">
                <div class="status-item">
                  <span class="label">Available Stock:</span>
                  <span class="value available">{{ stockError.availableStock }} units</span>
                </div>
                <div class="status-item">
                  <span class="label">Requested Quantity:</span>
                  <span class="value requested">{{ stockError.requestedQuantity }} units</span>
                </div>
                <div class="status-item shortage">
                  <span class="label">Shortage:</span>
                  <span class="value">{{ stockError.requestedQuantity - stockError.availableStock }} units</span>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-actions">
            <button class="btn btn-secondary" (click)="closeStockErrorModal()">
              <i class="fas fa-arrow-left"></i> Back to Cart
            </button>
            <button class="btn btn-primary" (click)="adjustQuantityAndRetry()">
              <i class="fas fa-edit"></i> Adjust Quantity
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sales-page {
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
      background-color: #f5f5f5;
      min-height: 100vh;
    }

    .sales-header {
      background: white;
      padding: 20px;
      border-radius: 12px;
      margin-bottom: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .sales-header h1 {
      margin: 0;
      color: #333;
      font-size: 24px;
    }

    .header-info {
      display: flex;
      gap: 30px;
      color: #666;
      font-size: 14px;
    }

    .sales-container {
      display: grid;
      grid-template-columns: 1fr 320px;
      gap: 20px;
      align-items: start;
      padding-bottom: 50px;
    }

    /* Cart Table Section */
    .cart-main-section {
      background: white;
      padding: 0;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      overflow: visible;
      position: relative;
      min-height: 500px;
      max-height: 70vh;
      display: flex;
      flex-direction: column;
    }

    .cart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 2px solid #f5f5f5;
      flex-shrink: 0;
    }

    .cart-header h2 {
      margin: 0;
      font-size: 20px;
      color: #333;
    }

    .header-actions {
      display: flex;
      gap: 10px;
    }

    .cart-table-container {
      position: relative;
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: visible;
      padding-right: 15px;
    }

    .cart-table {
      width: calc(100% - 10px);
      border-collapse: collapse;
      overflow: visible !important;
      table-layout: fixed;
      border-spacing: 0;
    }
    
    .cart-items-wrapper {
      flex: 1;
      overflow-y: auto;
      overflow-x: visible;
      max-height: 350px;
      border-bottom: 1px solid #e0e0e0;
      padding-right: 10px;
    }
    
    /* Custom scrollbar for cart items */
    .cart-items-wrapper::-webkit-scrollbar {
      width: 8px;
    }
    
    .cart-items-wrapper::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }
    
    .cart-items-wrapper::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 4px;
    }
    
    .cart-items-wrapper::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
    
    .search-row-wrapper {
      position: relative;
      overflow: visible;
      min-height: 60px;
      background-color: #f8f9fa;
      z-index: 100;
    }

    .cart-table thead {
      background-color: #f8f9fa;
    }

    .cart-table th {
      padding: 15px;
      text-align: left;
      font-weight: 600;
      color: #555;
      font-size: 14px;
      border-bottom: 2px solid #e0e0e0;
    }
    
    .cart-table th.price-header {
      text-align: right;
      padding-right: 25px;
    }
    
    .cart-table th.quantity-header {
      text-align: center;
    }
    
    .cart-table th.total-header {
      text-align: right;
      padding-right: 30px;
    }

    .cart-table tbody {
      overflow: visible;
    }

    .cart-table tbody tr {
      border-bottom: 1px solid #f5f5f5;
      position: relative;
    }

    .cart-table td {
      padding: 12px 15px;
      vertical-align: middle;
    }


    .row-number {
      font-weight: 600;
      color: #999;
    }

    .product-cell .product-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .product-cell .product-name {
      font-weight: 600;
      color: #333;
      font-size: 15px;
    }

    .stock-info {
      font-size: 12px;
      color: #666;
    }

    .stock-info.low-stock {
      color: #dc3545;
      font-weight: 600;
    }

    .code-cell {
      color: #666;
      font-size: 13px;
    }

    .price-cell {
      font-weight: 500;
      color: #28a745;
      text-align: right;
      padding-right: 25px !important;
    }

    .quantity-cell {
      text-align: center;
    }
    
    .quantity-cell .quantity-control {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      justify-content: center;
    }

    .qty-btn {
      width: 30px;
      height: 30px;
      border: 1px solid #ddd;
      background: white;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .qty-btn:hover {
      background-color: #f0f0f0;
      border-color: #999;
    }

    .qty-input {
      width: 50px;
      text-align: center;
      border: 1px solid #ddd;
      border-radius: 6px;
      padding: 5px;
      font-size: 15px;
      font-weight: 600;
    }

    .total-cell {
      font-weight: 600;
      color: #333;
      font-size: 16px;
      text-align: right;
      padding-right: 30px !important;
    }

    .action-cell {
      text-align: center;
      padding-right: 20px !important;
    }

    .remove-btn {
      width: 32px;
      height: 32px;
      border: none;
      background: #fee;
      color: #dc3545;
      border-radius: 6px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      margin: 0 auto;
    }

    .remove-btn:hover {
      background: #dc3545;
      color: white;
    }

    /* Add Product Row */
    .add-product-row {
      background-color: #fcfcfc;
      overflow: visible !important;
      position: static !important;
      border-bottom: none;
    }
    
    .add-product-row td {
      padding: 8px 15px;
      vertical-align: middle;
      font-size: 14px;
      color: #666;
    }
    
    .add-product-row .price-cell,
    .add-product-row .quantity-cell,
    .add-product-row .total-cell {
      font-style: italic;
      color: #999;
    }

    .search-cell {
      position: relative;
      padding: 0 !important;
    }
    
    .search-product-input {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      width: 100%;
      padding: 8px 15px;
    }


    .search-product-input .search-icon {
      position: absolute;
      left: 20px;
      color: #999;
      z-index: 1;
      font-size: 16px;
    }

    .inline-search-input {
      width: 100%;
      max-width: 800px;
      padding: 12px 40px;
      font-size: 16px;
      border: 1px solid #ddd;
      border-radius: 8px;
      transition: all 0.3s;
      background-color: #fafafa;
    }

    .inline-search-input:focus {
      outline: none;
      border-color: #1976D2;
      box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
      background-color: white;
    }

    .search-product-input .clear-btn {
      position: absolute;
      right: 15px;
      background: none;
      border: none;
      padding: 8px;
      cursor: pointer;
      color: #999;
      font-size: 14px;
    }

    .search-product-input .clear-btn:hover {
      color: #333;
    }

    /* Inline Suggestions */
    .inline-suggestions {
      position: fixed;
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      max-height: 350px;
      overflow-y: auto;
      z-index: 9999;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    }

    .inline-suggestions .suggestion-item {
      padding: 14px 20px;
      cursor: pointer;
      border-bottom: 1px solid #f5f5f5;
      transition: background-color 0.2s;
    }
    
    .inline-suggestions .suggestion-item:last-child {
      border-bottom: none;
    }
    
    .inline-suggestions .suggestion-item:first-child {
      border-top: none;
    }

    .inline-suggestions .suggestion-item:hover,
    .inline-suggestions .suggestion-item.active {
      background-color: #f8f9fa;
    }

    .inline-suggestions .suggestion-content {
      display: grid;
      grid-template-columns: 3fr 1.5fr 1fr 1fr;
      align-items: center;
      gap: 20px;
      width: 100%;
    }

    .inline-suggestions .product-name {
      font-weight: 600;
      color: #333;
      text-align: left;
      font-size: 15px;
    }

    .inline-suggestions .product-code {
      color: #666;
      font-size: 14px;
      text-align: left;
    }

    .inline-suggestions .product-price {
      font-weight: 600;
      color: #28a745;
      text-align: right;
    }

    .inline-suggestions .product-stock {
      font-size: 14px;
      color: #666;
      text-align: right;
    }

    .inline-suggestions .product-stock.low-stock {
      color: #dc3545;
    }
    
    .inline-suggestions .product-stock.out-of-stock {
      color: #dc3545;
      font-weight: 600;
    }
    
    .inline-suggestions .suggestion-item.out-of-stock {
      opacity: 0.6;
      cursor: not-allowed;
      background-color: #f8f8f8;
    }
    
    .inline-suggestions .suggestion-item.out-of-stock:hover {
      background-color: #f0f0f0;
    }

    /* Empty State */
    .empty-message {
      text-align: center;
      padding: 60px 20px !important;
    }
    
    .empty-cart-wrapper {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 200px;
      background: #fafafa;
    }

    .empty-cart-inline {
      color: #999;
      text-align: center;
    }

    .empty-cart-inline i {
      font-size: 48px;
      margin-bottom: 15px;
      display: block;
      color: #ddd;
    }

    .empty-cart-inline p {
      margin: 0;
      font-size: 16px;
      color: #666;
    }


    /* Summary Section */
    .summary-section {
      background: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      position: sticky;
      top: 20px;
      align-self: flex-start;
    }

    .summary-section h3 {
      margin: 0 0 20px 0;
      font-size: 18px;
      color: #333;
      padding-bottom: 15px;
      border-bottom: 2px solid #f5f5f5;
    }

    .summary-details {
      padding: 0;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      font-size: 14px;
      color: #666;
    }

    .summary-row.total {
      font-size: 20px;
      font-weight: bold;
      color: #333;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 2px solid #f5f5f5;
    }

    .action-buttons {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }

    .action-buttons button {
      flex: 1;
      padding: 12px;
      font-size: 16px;
      border-radius: 8px;
      font-weight: 500;
      transition: all 0.2s;
    }

    .btn-secondary {
      background-color: #f0f0f0;
      color: #666;
      border: 1px solid #e0e0e0;
    }

    .btn-secondary:hover {
      background-color: #e0e0e0;
    }

    @media (max-width: 1200px) {
      .sales-container {
        grid-template-columns: 1fr;
      }

      .cart-main-section {
        margin-bottom: 20px;
      }

      .summary-section {
        position: static;
      }
    }

    @media (max-width: 768px) {
      .cart-table {
        font-size: 13px;
      }

      .cart-table th,
      .cart-table td {
        padding: 8px;
      }

      .qty-btn {
        width: 25px;
        height: 25px;
      }

      .qty-input {
        width: 40px;
      }
    }
    
    /* Stock Error Modal */
    .stock-error-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.3s ease-out;
    }
    
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    
    .modal-backdrop {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(5px);
    }
    
    .modal-content {
      position: relative;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      width: 90%;
      max-width: 500px;
      animation: slideUp 0.3s ease-out;
    }
    
    @keyframes slideUp {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .modal-header h3 {
      margin: 0;
      font-size: 20px;
      color: #d32f2f;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .modal-header .close-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      color: #666;
      transition: all 0.2s;
      border-radius: 6px;
    }
    
    .modal-header .close-btn:hover {
      background: #f5f5f5;
      color: #333;
    }
    
    .modal-body {
      padding: 24px;
    }
    
    .stock-error-info {
      display: flex;
      gap: 20px;
      margin-bottom: 24px;
    }
    
    .error-icon {
      flex-shrink: 0;
      width: 64px;
      height: 64px;
      background: #fee;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #d32f2f;
      font-size: 28px;
    }
    
    .error-details {
      flex: 1;
    }
    
    .product-name {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin-bottom: 16px;
    }
    
    .stock-status {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .status-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
    }
    
    .status-item.shortage {
      border-top: 1px solid #e0e0e0;
      padding-top: 12px;
      margin-top: 4px;
    }
    
    .status-item .label {
      color: #666;
      font-size: 14px;
    }
    
    .status-item .value {
      font-weight: 600;
      font-size: 16px;
      color: #333;
    }
    
    .status-item .value.available {
      color: #388e3c;
    }
    
    .status-item .value.requested {
      color: #f57c00;
    }
    
    .status-item.shortage .value {
      color: #d32f2f;
    }
    
    .modal-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
    }
    
    .modal-actions button {
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
    }
    
    .modal-actions .btn-primary {
      background: #1976d2;
      color: white;
      border: none;
    }
    
    .modal-actions .btn-primary:hover {
      background: #1565c0;
    }
    
    @media (max-width: 480px) {
      .modal-content {
        width: 95%;
        margin: 10px;
      }
      
      .stock-error-info {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
      
      .modal-actions {
        flex-direction: column;
      }
      
      .modal-actions button {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class SalesComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @ViewChild('searchInput') searchInput!: ElementRef;
  
  products: Product[] = [];
  cart: CartItem[] = [];
  searchQuery: string = '';
  billNumber: string = '';
  
  // Search and suggestions
  showSuggestions: boolean = false;
  filteredSuggestions: ProductSuggestion[] = [];
  selectedSuggestionIndex: number = -1;
  private shouldFocusSearch: boolean = false;
  dropdownStyle: any = {};
  
  // Stock error display
  stockError: any = null;
  showStockErrorModal: boolean = false;

  constructor(
    private productService: ProductService,
    private transactionService: TransactionService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.generateBillNumber();
  }

  ngAfterViewInit(): void {
    // Focus on search input when component loads
    setTimeout(() => {
      if (this.searchInput && this.searchInput.nativeElement) {
        this.searchInput.nativeElement.focus();
      }
    }, 100);
  }

  ngAfterViewChecked(): void {
    if (this.shouldFocusSearch && this.searchInput && this.searchInput.nativeElement) {
      this.searchInput.nativeElement.focus();
      this.shouldFocusSearch = false;
    }
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe(products => {
      this.products = products;
    });
  }

  generateBillNumber(): void {
    this.billNumber = `INV-${new Date().getTime()}`;
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString('en-IN');
  }

  onSearchInput(): void {
    if (this.searchQuery.trim()) {
      this.filterProducts();
      this.showSuggestions = true;
      this.selectedSuggestionIndex = -1;
      this.updateDropdownPosition();
    } else {
      this.showSuggestions = false;
      this.filteredSuggestions = [];
    }
  }
  
  updateDropdownPosition(): void {
    setTimeout(() => {
      if (this.searchInput && this.searchInput.nativeElement) {
        const tableRow = this.searchInput.nativeElement.closest('tr');
        const table = this.searchInput.nativeElement.closest('table');
        
        if (tableRow && table) {
          const tableRect = table.getBoundingClientRect();
          const rowRect = tableRow.getBoundingClientRect();
          const spaceBelow = window.innerHeight - rowRect.bottom;
          const dropdownHeight = 350; // max-height of dropdown
          const dropdownWidth = tableRect.width - 30; // table width minus padding
          
          if (spaceBelow < dropdownHeight + 20) {
            // Show above the input
            this.dropdownStyle = {
              bottom: `${window.innerHeight - rowRect.top + 5}px`,
              top: 'auto',
              left: `${tableRect.left}px`,
              width: `${dropdownWidth}px`
            };
          } else {
            // Show below the input
            this.dropdownStyle = {
              top: `${rowRect.bottom + 2}px`,
              bottom: 'auto',
              left: `${tableRect.left}px`,
              width: `${dropdownWidth}px`
            };
          }
        }
      }
    }, 0);
  }

  filterProducts(): void {
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredSuggestions = [];

    // Search by product name
    const nameMatches = this.products
      .filter(p => p.name.toLowerCase().includes(query))
      .map(p => ({ product: p, matchType: 'name' as const }));

    // Search by barcode
    const codeMatches = this.products
      .filter(p => p.barcode.toLowerCase().includes(query))
      .map(p => ({ product: p, matchType: 'code' as const }));

    // Combine and remove duplicates
    const allMatches: ProductSuggestion[] = [...nameMatches];
    codeMatches.forEach(match => {
      if (!allMatches.some(m => m.product.id === match.product.id)) {
        allMatches.push(match);
      }
    });

    // Sort by relevance (exact matches first)
    this.filteredSuggestions = allMatches.sort((a, b) => {
      const aExact = a.product.name.toLowerCase() === query || a.product.barcode.toLowerCase() === query;
      const bExact = b.product.name.toLowerCase() === query || b.product.barcode.toLowerCase() === query;
      
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      
      return a.product.name.localeCompare(b.product.name);
    }).slice(0, 10); // Limit to 10 suggestions
  }

  onKeyDown(event: KeyboardEvent): void {
    if (!this.showSuggestions || this.filteredSuggestions.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.selectedSuggestionIndex = Math.min(
          this.selectedSuggestionIndex + 1,
          this.filteredSuggestions.length - 1
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.selectedSuggestionIndex = Math.max(this.selectedSuggestionIndex - 1, 0);
        break;
      case 'Escape':
        this.showSuggestions = false;
        break;
    }
  }

  selectFirstSuggestion(): void {
    if (this.filteredSuggestions.length > 0) {
      const index = this.selectedSuggestionIndex >= 0 ? this.selectedSuggestionIndex : 0;
      const product = this.filteredSuggestions[index].product;
      this.directAddToCart(product);
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.showSuggestions = false;
    this.filteredSuggestions = [];
    this.selectedSuggestionIndex = -1;
  }

  directAddToCart(product: Product): void {
    // Check stock
    const existingItem = this.cart.find(item => item.product.id === product.id);
    const currentInCart = existingItem ? existingItem.quantity : 0;
    
    if (currentInCart >= product.currentStock) {
      alert(`No more stock available! Currently ${currentInCart} in cart.`);
      return;
    }

    if (existingItem) {
      existingItem.quantity += 1;
      existingItem.totalPrice = existingItem.quantity * existingItem.product.sellingPrice;
    } else {
      this.cart.push({
        product: product,
        quantity: 1,
        totalPrice: product.sellingPrice
      });
    }

    // Clear search and reset
    this.searchQuery = '';
    this.showSuggestions = false;
    this.filteredSuggestions = [];
    this.selectedSuggestionIndex = -1;
    
    // Set flag to focus search input after view updates
    this.shouldFocusSearch = true;
    
    // Trigger change detection
    this.cdr.detectChanges();
    
    // Update scroll position in case the table grew
    setTimeout(() => {
      const wrapper = document.querySelector('.cart-items-wrapper');
      if (wrapper) {
        wrapper.scrollTop = wrapper.scrollHeight;
      }
    }, 100);
    
    // Optional: Show some feedback
    const audio = new Audio();
    audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzGH0fPTgjMGHmS46+OZURE';
    audio.play().catch(() => {}); // Beep sound
  }

  increaseCartItemQuantity(index: number): void {
    const item = this.cart[index];
    if (item.quantity < item.product.currentStock) {
      item.quantity++;
      item.totalPrice = item.quantity * item.product.sellingPrice;
    }
  }

  decreaseCartItemQuantity(index: number): void {
    const item = this.cart[index];
    if (item.quantity > 1) {
      item.quantity--;
      item.totalPrice = item.quantity * item.product.sellingPrice;
    }
  }

  updateItemQuantity(index: number): void {
    const item = this.cart[index];
    if (item.quantity < 1) {
      item.quantity = 1;
    }
    
    if (item.quantity > item.product.currentStock) {
      alert(`Insufficient stock! Only ${item.product.currentStock} available.`);
      item.quantity = item.product.currentStock;
    }
    
    item.totalPrice = item.quantity * item.product.sellingPrice;
  }

  removeFromCart(index: number): void {
    this.cart.splice(index, 1);
  }

  clearCart(): void {
    if (this.cart.length === 0) return;
    
    if (confirm('Are you sure you want to clear all items from the cart?')) {
      this.cart = [];
      this.searchQuery = '';
      this.showSuggestions = false;
      
      // Focus back on search input
      setTimeout(() => {
        this.searchInput.nativeElement.focus();
      }, 100);
    }
  }

  calculateSubTotal(): string {
    const total = this.cart.reduce((sum, item) => sum + item.totalPrice, 0);
    return total.toFixed(2);
  }

  calculateCGST(): string {
    const total = this.cart.reduce((sum, item) => sum + item.totalPrice, 0);
    return (total * 0.09).toFixed(2);
  }

  calculateSGST(): string {
    const total = this.cart.reduce((sum, item) => sum + item.totalPrice, 0);
    return (total * 0.09).toFixed(2);
  }

  calculateGrandTotal(): string {
    const subTotal = this.cart.reduce((sum, item) => sum + item.totalPrice, 0);
    const cgst = subTotal * 0.09;
    const sgst = subTotal * 0.09;
    const grandTotal = subTotal + cgst + sgst;
    return grandTotal.toFixed(2);
  }

  generateBill(): void {
    if (this.cart.length === 0) return;

    // Store cart data for bill generation
    const billData = {
      billNumber: this.billNumber,
      date: new Date(),
      items: this.cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        unitPrice: item.product.sellingPrice,
        totalPrice: item.totalPrice
      })),
      subTotal: parseFloat(this.calculateSubTotal()),
      cgst: parseFloat(this.calculateCGST()),
      sgst: parseFloat(this.calculateSGST()),
      grandTotal: parseFloat(this.calculateGrandTotal())
    };

    // Save to session storage
    sessionStorage.setItem('currentBill', JSON.stringify(billData));

    // Create transactions for each item
    const transactionPromises = this.cart.map(item => {
      const transaction: Transaction = {
        productId: item.product.id || '',
        type: TransactionType.SALE,
        quantity: item.quantity,
        unitPrice: item.product.sellingPrice,
        totalAmount: item.totalPrice,
        reference: this.billNumber,
        notes: `Sale - ${item.product.name}`
      };
      return this.transactionService.createTransaction(transaction).toPromise();
    });

    // Wait for all transactions to complete
    Promise.all(transactionPromises).then(() => {
      // Navigate to bill page
      this.router.navigate(['/sales-bill']);
    }).catch(error => {
      console.error('Error creating transactions:', error);
      
      // Check if it's an insufficient stock error
      if (error.error && error.error.error === 'INSUFFICIENT_STOCK') {
        const stockError = error.error;
        this.showStockError(stockError);
      } else if (error.message) {
        this.notificationService.showError(`Error: ${error.message}`);
      } else {
        this.notificationService.showError('Error processing sale. Please try again.');
      }
    });
  }

  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.search-cell') && !target.closest('.inline-suggestions')) {
      this.showSuggestions = false;
    }
  }
  
  onWindowScroll(): void {
    if (this.showSuggestions) {
      this.updateDropdownPosition();
    }
  }
  
  onWindowResize(): void {
    if (this.showSuggestions) {
      this.updateDropdownPosition();
    }
  }
  
  showStockError(error: any): void {
    this.stockError = error;
    this.showStockErrorModal = true;
  }
  
  closeStockErrorModal(): void {
    this.showStockErrorModal = false;
    this.stockError = null;
  }
  
  adjustQuantityAndRetry(): void {
    if (!this.stockError) return;
    
    // Find the product in cart
    const cartItem = this.cart.find(item => item.product.id === this.stockError.productId);
    if (cartItem && this.stockError.availableStock > 0) {
      // Adjust quantity to available stock
      cartItem.quantity = this.stockError.availableStock;
      this.updateItemQuantity(this.cart.indexOf(cartItem));
      
      // Show notification
      this.notificationService.showWarning(
        `Quantity adjusted to ${this.stockError.availableStock} (maximum available)`
      );
    } else if (cartItem && this.stockError.availableStock === 0) {
      // Remove item from cart if no stock
      const index = this.cart.indexOf(cartItem);
      this.removeFromCart(index);
      
      // Show notification
      this.notificationService.showWarning(
        `${this.stockError.productName} removed from cart (out of stock)`
      );
    }
    
    // Close modal
    this.closeStockErrorModal();
  }
}
