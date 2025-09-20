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
        <!-- Search Section -->
        <div class="search-section-main">
          <div class="search-header">
            <h2><i class="fas fa-search"></i> Search Products</h2>
            <span class="search-hint">Click any product to add to cart</span>
          </div>
          
          <div class="search-box-container">
            <div class="search-box">
              <i class="fas fa-barcode search-icon"></i>
              <input type="text" 
                     [(ngModel)]="searchQuery" 
                     (input)="onSearchInput()"
                     (keydown)="onKeyDown($event)"
                     (keyup.enter)="selectFirstSuggestion()"
                     placeholder="Type product name or scan barcode..."
                     class="search-input"
                     autocomplete="off"
                     #searchInput>
              <button *ngIf="searchQuery" class="clear-btn" (click)="clearSearch()">
                <i class="fas fa-times"></i>
              </button>
            </div>
            
            <!-- Suggestions Dropdown -->
            <div class="suggestions-dropdown" *ngIf="showSuggestions && filteredSuggestions.length > 0">
              <div class="suggestion-item" 
                   *ngFor="let suggestion of filteredSuggestions; let i = index"
                   [class.active]="i === selectedSuggestionIndex"
                   (click)="directAddToCart(suggestion.product)"
                   (mouseenter)="selectedSuggestionIndex = i">
                <div class="suggestion-content">
                  <div class="suggestion-left">
                    <i class="fas fa-box product-icon"></i>
                    <div class="suggestion-info">
                      <div class="product-name">{{ suggestion.product.name }}</div>
                      <div class="product-details">
                        <span class="product-code">{{ suggestion.product.barcode }}</span>
                        <span class="separator">•</span>
                        <span class="product-stock" [class.low-stock]="suggestion.product.currentStock < 10">
                          Stock: {{ suggestion.product.currentStock }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="suggestion-right">
                    <span class="product-price">₹{{ suggestion.product.sellingPrice }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="no-results" *ngIf="showSuggestions && searchQuery && filteredSuggestions.length === 0">
              <i class="fas fa-exclamation-circle"></i>
              <span>No products found for "{{ searchQuery }}"</span>
            </div>
          </div>
        </div>

        <!-- Cart Section -->
        <div class="cart-section">
          <div class="cart-header">
            <h2><i class="fas fa-shopping-cart"></i> Shopping Cart</h2>
            <span class="cart-count" *ngIf="cart.length > 0">{{ cart.length }} items</span>
          </div>
          
          <div class="cart-items" *ngIf="cart.length > 0">
            <div class="cart-item" *ngFor="let item of cart; let i = index">
              <div class="item-info">
                <div class="item-name">{{ item.product.name }}</div>
                <div class="item-code">{{ item.product.barcode }}</div>
              </div>
              
              <div class="item-controls">
                <div class="price-info">
                  <span class="unit-price">₹{{ item.product.sellingPrice }} × </span>
                </div>
                
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
                
                <div class="item-total">
                  <span class="total-price">₹{{ item.totalPrice }}</span>
                </div>
                
                <button class="remove-btn" (click)="removeFromCart(i)">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>
          
          <div class="empty-cart" *ngIf="cart.length === 0">
            <i class="fas fa-shopping-basket"></i>
            <h3>Your cart is empty</h3>
            <p>Start adding products to create a sale</p>
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
      grid-template-columns: 500px 1fr 350px;
      gap: 20px;
      align-items: start;
    }

    /* Search Section */
    .search-section-main {
      background: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      position: sticky;
      top: 20px;
    }

    .search-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .search-header h2 {
      margin: 0;
      font-size: 18px;
      color: #333;
    }

    .search-hint {
      font-size: 12px;
      color: #999;
    }

    .search-box-container {
      position: relative;
    }

    .search-box {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-icon {
      position: absolute;
      left: 15px;
      color: #999;
      z-index: 1;
      font-size: 18px;
    }

    .search-input {
      width: 100%;
      padding: 15px 45px;
      font-size: 16px;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      transition: all 0.3s;
    }

    .search-input:focus {
      outline: none;
      border-color: #1976D2;
      box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
    }

    .clear-btn {
      position: absolute;
      right: 15px;
      background: none;
      border: none;
      padding: 8px;
      cursor: pointer;
      color: #999;
      transition: color 0.2s;
    }

    .clear-btn:hover {
      color: #333;
    }

    .suggestions-dropdown {
      position: absolute;
      top: calc(100% + 5px);
      left: 0;
      right: 0;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 10px;
      max-height: 400px;
      overflow-y: auto;
      z-index: 1000;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }

    .suggestion-item {
      padding: 15px;
      cursor: pointer;
      border-bottom: 1px solid #f5f5f5;
      transition: background-color 0.2s;
    }

    .suggestion-item:last-child {
      border-bottom: none;
    }

    .suggestion-item:hover,
    .suggestion-item.active {
      background-color: #f8f9fa;
    }

    .suggestion-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .suggestion-left {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
    }

    .product-icon {
      font-size: 20px;
      color: #1976D2;
    }

    .suggestion-info {
      flex: 1;
    }

    .product-name {
      font-weight: 600;
      color: #333;
      font-size: 15px;
      margin-bottom: 4px;
    }

    .product-details {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: #666;
    }

    .product-code {
      color: #999;
    }

    .separator {
      color: #ddd;
    }

    .product-stock {
      font-weight: 500;
    }

    .product-stock.low-stock {
      color: #dc3545;
      font-weight: 600;
    }

    .suggestion-right {
      text-align: right;
    }

    .product-price {
      font-size: 18px;
      font-weight: 600;
      color: #28a745;
    }

    .no-results {
      padding: 30px;
      text-align: center;
      color: #999;
      font-size: 14px;
    }

    .no-results i {
      font-size: 24px;
      margin-bottom: 10px;
      display: block;
    }

    /* Cart Section */
    .cart-section {
      background: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .cart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 2px solid #f5f5f5;
    }

    .cart-header h2 {
      margin: 0;
      font-size: 18px;
      color: #333;
    }

    .cart-count {
      font-size: 14px;
      color: #666;
      background: #f0f0f0;
      padding: 4px 12px;
      border-radius: 20px;
    }

    .cart-items {
      max-height: 400px;
      overflow-y: auto;
    }

    .cart-item {
      padding: 15px 0;
      border-bottom: 1px solid #f5f5f5;
    }

    .cart-item:last-child {
      border-bottom: none;
    }

    .item-info {
      margin-bottom: 10px;
    }

    .item-name {
      font-weight: 600;
      color: #333;
      font-size: 15px;
    }

    .item-code {
      font-size: 12px;
      color: #999;
      margin-top: 2px;
    }

    .item-controls {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .price-info {
      font-size: 14px;
      color: #666;
    }

    .quantity-control {
      display: flex;
      align-items: center;
      gap: 5px;
      background: #f8f9fa;
      padding: 5px;
      border-radius: 8px;
    }

    .qty-btn {
      width: 28px;
      height: 28px;
      border: none;
      background: white;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .qty-btn:hover {
      background-color: #e0e0e0;
    }

    .qty-input {
      width: 50px;
      text-align: center;
      border: none;
      background: transparent;
      font-weight: 600;
      font-size: 15px;
    }

    .item-total {
      margin-left: auto;
    }

    .total-price {
      font-size: 16px;
      font-weight: 600;
      color: #333;
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

    .empty-cart {
      text-align: center;
      padding: 60px 20px;
      color: #999;
    }

    .empty-cart i {
      font-size: 48px;
      margin-bottom: 15px;
      display: block;
      color: #ddd;
    }

    .empty-cart h3 {
      margin: 0 0 10px 0;
      color: #666;
      font-weight: 500;
    }

    .empty-cart p {
      margin: 0;
      font-size: 14px;
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
        grid-template-columns: 1fr 1fr;
      }

      .search-section-main {
        grid-column: 1 / -1;
        position: static;
      }

      .summary-section {
        position: static;
      }
    }

    @media (max-width: 768px) {
      .sales-container {
        grid-template-columns: 1fr;
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
    if (confirm('Are you sure you want to clear the cart?')) {
      this.cart = [];
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
