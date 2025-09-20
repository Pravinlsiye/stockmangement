import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';
import { ProductService } from '../../services/product.service';
import { Transaction, TransactionType } from '../../models/transaction.model';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-transaction-list',
  template: `
    <div class="transaction-list">
      <div class="flex-between mb-20">
        <h1>Transactions</h1>
        <button class="btn btn-primary" (click)="showAddModal = true">
          <i class="fas fa-plus"></i> New Transaction
        </button>
      </div>

      <div class="card mb-20">
        <div class="flex">
          <button class="btn" [class.btn-primary]="selectedType === 'ALL'" (click)="filterByType('ALL')"><i class="fas fa-list"></i> All</button>
          <button class="btn" [class.btn-primary]="selectedType === 'PURCHASE'" (click)="filterByType('PURCHASE')"><i class="fas fa-shopping-cart"></i> Purchases</button>
          <button class="btn" [class.btn-primary]="selectedType === 'SALE'" (click)="filterByType('SALE')"><i class="fas fa-cash-register"></i> Sales</button>
          <button class="btn" [class.btn-primary]="selectedType === 'ADJUSTMENT'" (click)="filterByType('ADJUSTMENT')"><i class="fas fa-sliders-h"></i> Adjustments</button>
        </div>
      </div>

      <div class="card">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Product</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total Amount</th>
              <th>Reference</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let transaction of paginatedTransactions">
              <td>{{ formatDate(transaction.transactionDate) }}</td>
              <td>{{ getProductName(transaction.productId) }}</td>
              <td>
                <span [class]="getTypeClass(transaction.type)">
                  {{ transaction.type }}
                </span>
              </td>
              <td>
                <span *ngIf="transaction.type === 'ADJUSTMENT' && transaction.quantity < 0" class="text-danger">
                  {{ transaction.quantity }}
                </span>
                <span *ngIf="transaction.type === 'ADJUSTMENT' && transaction.quantity > 0" class="text-success">
                  +{{ transaction.quantity }}
                </span>
                <span *ngIf="transaction.type !== 'ADJUSTMENT'">
                  {{ transaction.quantity }}
                </span>
              </td>
              <td>₹{{ transaction.unitPrice }}</td>
              <td>₹{{ transaction.totalAmount }}</td>
              <td>{{ transaction.reference }}</td>
              <td>{{ transaction.notes }}</td>
              <td>
                <button *ngIf="transaction.type === 'SALE'" class="btn btn-sm btn-primary" (click)="generateBill(transaction)">
                  <i class="fas fa-file-invoice"></i> Bill
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Pagination -->
        <div class="pagination" *ngIf="totalPages > 1">
          <button class="btn btn-sm" (click)="goToPage(currentPage - 1)" [disabled]="currentPage === 1">
            <i class="fas fa-chevron-left"></i> Previous
          </button>
          <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
          <button class="btn btn-sm" (click)="goToPage(currentPage + 1)" [disabled]="currentPage === totalPages">
            Next <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      <!-- Add Transaction Modal -->
      <div class="modal-backdrop" *ngIf="showAddModal" (click)="closeModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2 class="modal-title">New Transaction</h2>
            <button class="close-btn" (click)="closeModal()">&times;</button>
          </div>
          <form (ngSubmit)="saveTransaction()">
            <div class="form-group">
              <label>Transaction Type</label>
              <select class="form-control" [(ngModel)]="currentTransaction.type" name="type" required>
                <option value="">Select Type</option>
                <option value="PURCHASE">Purchase</option>
                <option value="SALE">Sale</option>
                <option value="ADJUSTMENT">Adjustment</option>
              </select>
            </div>
            <div class="form-group">
              <label>Product</label>
              <select class="form-control" [(ngModel)]="currentTransaction.productId" name="productId" (change)="onProductChange()" required>
                <option value="">Select Product</option>
                <option *ngFor="let product of products" [value]="product.id">{{ product.name }}</option>
              </select>
            </div>
            <div class="grid grid-2">
              <div class="form-group">
                <label>Quantity</label>
                <input type="number" class="form-control" [(ngModel)]="currentTransaction.quantity" name="quantity" (change)="calculateTotal()" required>
                <small *ngIf="currentTransaction.type === 'ADJUSTMENT'" class="text-muted">
                  Use positive number to add stock, negative to reduce stock
                </small>
              </div>
              <div class="form-group">
                <label>Unit Price</label>
                <input type="number" step="0.01" class="form-control" [(ngModel)]="currentTransaction.unitPrice" name="unitPrice" (change)="calculateTotal()" required>
              </div>
            </div>
            <div class="form-group">
              <label>Total Amount</label>
              <input type="number" step="0.01" class="form-control" [(ngModel)]="currentTransaction.totalAmount" name="totalAmount" readonly>
            </div>
            <div class="form-group">
              <label>Reference (Invoice/Receipt Number)</label>
              <input type="text" class="form-control" [(ngModel)]="currentTransaction.reference" name="reference" required>
            </div>
            <div class="form-group">
              <label>Notes</label>
              <textarea class="form-control" [(ngModel)]="currentTransaction.notes" name="notes" rows="2"></textarea>
            </div>
            <div class="flex text-right mt-20">
              <button type="button" class="btn" (click)="closeModal()">Cancel</button>
              <button type="submit" class="btn btn-primary">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .transaction-list h1 {
      margin: 0;
      color: #333;
    }
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 20px;
      gap: 20px;
    }
    .page-info {
      font-weight: 500;
    }
    .text-success {
      color: #28a745;
      font-weight: 500;
    }
    .text-danger {
      color: #dc3545;
      font-weight: 500;
    }
    .text-muted {
      color: #6c757d;
      font-size: 0.85em;
      display: block;
      margin-top: 4px;
    }
  `]
})
export class TransactionListComponent implements OnInit {
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  paginatedTransactions: Transaction[] = [];
  products: Product[] = [];
  showAddModal = false;
  selectedType = 'ALL';
  currentTransaction: Transaction = this.initializeTransaction();
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 15;
  totalPages = 0;

  constructor(
    private transactionService: TransactionService,
    private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadTransactions();
    this.loadProducts();
  }

  initializeTransaction(): Transaction {
    return {
      productId: '',
      type: TransactionType.SALE,
      quantity: 0,
      unitPrice: 0,
      totalAmount: 0,
      reference: '',
      notes: ''
    };
  }

  loadTransactions(): void {
    this.transactionService.getAllTransactions().subscribe(transactions => {
      // Sort transactions by date in descending order (latest first)
      this.transactions = transactions.sort((a, b) => {
        const dateA = new Date(a.transactionDate || 0).getTime();
        const dateB = new Date(b.transactionDate || 0).getTime();
        return dateB - dateA; // Descending order (latest first)
      });
      this.filterByType(this.selectedType);
    });
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe(products => {
      this.products = products;
    });
  }

  filterByType(type: string): void {
    this.selectedType = type;
    if (type === 'ALL') {
      this.filteredTransactions = [...this.transactions]; // Already sorted
    } else {
      this.filteredTransactions = this.transactions.filter(t => t.type === type);
    }
    this.updatePagination();
  }
  
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredTransactions.length / this.itemsPerPage);
    this.goToPage(1);
  }
  
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    
    this.currentPage = page;
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedTransactions = this.filteredTransactions.slice(startIndex, endIndex);
  }

  getProductName(productId: string): string {
    const product = this.products.find(p => p.id === productId);
    return product ? product.name : '';
  }

  getTypeClass(type: TransactionType): string {
    switch (type) {
      case TransactionType.PURCHASE:
        return 'badge badge-success';
      case TransactionType.SALE:
        return 'badge badge-warning';
      case TransactionType.ADJUSTMENT:
        return 'badge badge-danger';
      default:
        return 'badge';
    }
  }

  formatDate(date: Date | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
  }

  onProductChange(): void {
    const product = this.products.find(p => p.id === this.currentTransaction.productId);
    if (product) {
      if (this.currentTransaction.type === TransactionType.PURCHASE) {
        this.currentTransaction.unitPrice = product.purchasePrice;
      } else if (this.currentTransaction.type === TransactionType.SALE) {
        this.currentTransaction.unitPrice = product.sellingPrice;
      } else if (this.currentTransaction.type === TransactionType.ADJUSTMENT) {
        // For adjustments, use purchase price (cost value)
        this.currentTransaction.unitPrice = product.purchasePrice;
      }
      this.calculateTotal();
    }
  }

  calculateTotal(): void {
    this.currentTransaction.totalAmount = Math.abs(this.currentTransaction.quantity) * this.currentTransaction.unitPrice;
  }

  saveTransaction(): void {
    this.transactionService.createTransaction(this.currentTransaction).subscribe(() => {
      this.loadTransactions();
      this.closeModal();
    });
  }

  closeModal(): void {
    this.showAddModal = false;
    this.currentTransaction = this.initializeTransaction();
  }

  generateBill(transaction: Transaction): void {
    if (transaction.id) {
      this.router.navigate(['/bill', transaction.id]);
    }
  }
}
