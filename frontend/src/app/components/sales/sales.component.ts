import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { TransactionService } from '../../services/transaction.service';
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
    '(document:click)': 'onDocumentClick($event)'
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
                  <th width="35%">Product</th>
                  <th width="15%">Code</th>
                  <th width="10%">Price</th>
                  <th width="15%">Quantity</th>
                  <th width="15%">Total</th>
                  <th width="5%"></th>
                </tr>
              </thead>
              <tbody>
                <!-- Existing Cart Items -->
                <tr *ngFor="let item of cart; let i = index" class="cart-row">
                  <td class="row-number">{{ i + 1 }}</td>
                  <td class="product-cell">
                    <div class="product-info">
                      <div class="product-name">{{ item.product.name }}</div>
                      <div class="stock-info" [class.low-stock]="item.product.currentStock < 10">
                        Stock: {{ item.product.currentStock }}
                      </div>
                    </div>
                  </td>
                  <td class="code-cell">{{ item.product.barcode }}</td>
                  <td class="price-cell">₹{{ item.product.sellingPrice }}</td>
                  <td class="quantity-cell">
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
                  <td class="total-cell">₹{{ item.totalPrice }}</td>
                  <td class="action-cell">
                    <button class="remove-btn" (click)="removeFromCart(i)">
                      <i class="fas fa-times"></i>
                    </button>
                  </td>
                </tr>
                
                <!-- Add New Product Row -->
                <tr class="add-product-row">
                  <td class="row-number">{{ cart.length + 1 }}</td>
                  <td colspan="5" class="search-cell">
                    <div class="inline-search-box">
                      <i class="fas fa-search search-icon"></i>
                      <input type="text" 
                             [(ngModel)]="searchQuery" 
                             (input)="onSearchInput()"
                             (keydown)="onKeyDown($event)"
                             (keyup.enter)="selectFirstSuggestion()"
                             placeholder="Search product by name or code..."
                             class="inline-search-input"
                             autocomplete="off"
                             #searchInput>
                      <button *ngIf="searchQuery" class="clear-btn" (click)="clearSearch()">
                        <i class="fas fa-times"></i>
                      </button>
                    </div>
                    
                    <!-- Inline Suggestions -->
                    <div class="inline-suggestions" *ngIf="showSuggestions && filteredSuggestions.length > 0">
                      <div class="suggestion-item" 
                           *ngFor="let suggestion of filteredSuggestions; let i = index"
                           [class.active]="i === selectedSuggestionIndex"
                           (click)="directAddToCart(suggestion.product)"
                           (mouseenter)="selectedSuggestionIndex = i">
                        <div class="suggestion-content">
                          <span class="product-name">{{ suggestion.product.name }}</span>
                          <span class="product-code">{{ suggestion.product.barcode }}</span>
                          <span class="product-price">₹{{ suggestion.product.sellingPrice }}</span>
                          <span class="product-stock" [class.low-stock]="suggestion.product.currentStock < 10">
                            Stock: {{ suggestion.product.currentStock }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="action-cell"></td>
                </tr>
              </tbody>
              
              <!-- Empty State -->
              <tbody *ngIf="cart.length === 0">
                <tr>
                  <td colspan="7" class="empty-message">
                    <div class="empty-cart-inline">
                      <i class="fas fa-shopping-basket"></i>
                      <p>Start typing in the search box above to add products</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
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
    }

    /* Cart Table Section */
    .cart-main-section {
      background: white;
      padding: 0;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .cart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 2px solid #f5f5f5;
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
      overflow-x: auto;
    }

    .cart-table {
      width: 100%;
      border-collapse: collapse;
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

    .cart-table tbody tr {
      border-bottom: 1px solid #f0f0f0;
    }

    .cart-table td {
      padding: 12px 15px;
      vertical-align: middle;
    }

    .cart-row:hover {
      background-color: #f8f9fa;
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
    }

    .quantity-cell .quantity-control {
      display: flex;
      align-items: center;
      gap: 5px;
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
    }

    .action-cell {
      text-align: center;
    }

    .remove-btn {
      width: 32px;
      height: 32px;
      border: none;
      background: #fee;
      color: #dc3545;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .remove-btn:hover {
      background: #dc3545;
      color: white;
    }

    /* Add Product Row */
    .add-product-row {
      background-color: #f8f9fa;
    }

    .search-cell {
      position: relative;
      padding: 0 !important;
    }

    .inline-search-box {
      position: relative;
      display: flex;
      align-items: center;
      padding: 12px 15px;
    }

    .inline-search-box .search-icon {
      position: absolute;
      left: 25px;
      color: #999;
      z-index: 1;
    }

    .inline-search-input {
      width: 100%;
      padding: 10px 40px;
      font-size: 15px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      transition: all 0.3s;
    }

    .inline-search-input:focus {
      outline: none;
      border-color: #1976D2;
      box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
    }

    .inline-search-box .clear-btn {
      position: absolute;
      right: 25px;
      background: none;
      border: none;
      padding: 8px;
      cursor: pointer;
      color: #999;
    }

    .inline-search-box .clear-btn:hover {
      color: #333;
    }

    /* Inline Suggestions */
    .inline-suggestions {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 0 0 8px 8px;
      max-height: 300px;
      overflow-y: auto;
      z-index: 1000;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }

    .inline-suggestions .suggestion-item {
      padding: 12px 15px;
      cursor: pointer;
      border-bottom: 1px solid #f5f5f5;
      transition: background-color 0.2s;
    }

    .inline-suggestions .suggestion-item:hover,
    .inline-suggestions .suggestion-item.active {
      background-color: #f8f9fa;
    }

    .inline-suggestions .suggestion-content {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .inline-suggestions .product-name {
      flex: 1;
      font-weight: 600;
      color: #333;
    }

    .inline-suggestions .product-code {
      color: #999;
      font-size: 13px;
    }

    .inline-suggestions .product-price {
      font-weight: 600;
      color: #28a745;
    }

    .inline-suggestions .product-stock {
      font-size: 12px;
      color: #666;
    }

    .inline-suggestions .product-stock.low-stock {
      color: #dc3545;
    }

    /* Empty State */
    .empty-message {
      text-align: center;
      padding: 60px 20px !important;
    }

    .empty-cart-inline {
      color: #999;
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
  `]
})
export class SalesComponent implements OnInit, AfterViewInit {
  @ViewChild('searchInput') searchInput!: ElementRef;
  
  products: Product[] = [];
  cart: CartItem[] = [];
  searchQuery: string = '';
  billNumber: string = '';
  
  // Search and suggestions
  showSuggestions: boolean = false;
  filteredSuggestions: ProductSuggestion[] = [];
  selectedSuggestionIndex: number = -1;

  constructor(
    private productService: ProductService,
    private transactionService: TransactionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.generateBillNumber();
  }

  ngAfterViewInit(): void {
    // Focus on search input when component loads
    setTimeout(() => {
      this.searchInput.nativeElement.focus();
    }, 100);
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe(products => {
      this.products = products.filter(p => p.currentStock > 0);
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
    } else {
      this.showSuggestions = false;
      this.filteredSuggestions = [];
    }
  }

  filterProducts(): void {
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredSuggestions = [];

    // Search by product name
    const nameMatches = this.products
      .filter(p => p.name.toLowerCase().includes(query) && p.currentStock > 0)
      .map(p => ({ product: p, matchType: 'name' as const }));

    // Search by barcode
    const codeMatches = this.products
      .filter(p => p.barcode.toLowerCase().includes(query) && p.currentStock > 0)
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

  calculateSubTotal(): number {
    return this.cart.reduce((sum, item) => sum + item.totalPrice, 0);
  }

  calculateCGST(): number {
    return Math.round(this.calculateSubTotal() * 0.09 * 100) / 100;
  }

  calculateSGST(): number {
    return Math.round(this.calculateSubTotal() * 0.09 * 100) / 100;
  }

  calculateGrandTotal(): number {
    return this.calculateSubTotal() + this.calculateCGST() + this.calculateSGST();
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
      subTotal: this.calculateSubTotal(),
      cgst: this.calculateCGST(),
      sgst: this.calculateSGST(),
      grandTotal: this.calculateGrandTotal()
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
      alert('Error processing sale. Please try again.');
    });
  }

  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.search-section')) {
      this.showSuggestions = false;
    }
  }
}
