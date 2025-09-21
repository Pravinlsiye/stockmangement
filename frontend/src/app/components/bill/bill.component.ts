import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';
import { ProductService } from '../../services/product.service';
import { Transaction } from '../../models/transaction.model';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-bill',
  template: `
    <div class="bill-container">
      <div class="bill-actions no-print">
        <div class="theme-selector">
          <label>Bill Theme:</label>
          <select [(ngModel)]="selectedTheme" (change)="changeTheme()">
            <option value="classic">Classic Receipt</option>
            <option value="modern">Modern Invoice</option>
            <option value="minimal">Minimal Style</option>
          </select>
        </div>
        <button class="btn btn-primary" (click)="print()">
          <i class="fas fa-print"></i> Print Bill
        </button>
        <button class="btn" (click)="goBack()">
          <i class="fas fa-arrow-left"></i> Back
        </button>
      </div>

      <div class="bill" id="billContent" [ngClass]="'theme-' + selectedTheme">
        <div class="bill-header">
          <div class="store-logo">
            <i class="fas fa-warehouse"></i>
          </div>
          <h1>StockPro SuperMarket</h1>
          <p>45, Gandhi Market, Karur - 639001</p>
          <p>Tamil Nadu, India</p>
          <p>Phone: +91-98430-12345 | GST: 33ABCDE1234F1Z5</p>
        </div>

        <div class="bill-info">
          <div class="info-row">
            <span>Bill No: {{ transaction?.reference }}</span>
            <span>Date: {{ formatDate(transaction?.transactionDate) }}</span>
          </div>
        </div>

        <table class="bill-items">
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="transaction && product">
              <td>{{ product.name }}</td>
              <td>{{ transaction.quantity }}</td>
              <td>₹{{ transaction.unitPrice }}</td>
              <td>₹{{ transaction.totalAmount }}</td>
            </tr>
          </tbody>
        </table>

        <div class="bill-total">
          <div class="total-row">
            <span>Sub Total:</span>
            <span>₹{{ transaction?.totalAmount }}</span>
          </div>
          <div class="total-row">
            <span>CGST (9%):</span>
            <span>₹{{ calculateTax(transaction?.totalAmount || 0, 9) }}</span>
          </div>
          <div class="total-row">
            <span>SGST (9%):</span>
            <span>₹{{ calculateTax(transaction?.totalAmount || 0, 9) }}</span>
          </div>
          <div class="total-row grand-total">
            <span>GRAND TOTAL:</span>
            <span>₹{{ calculateGrandTotal(transaction?.totalAmount || 0) }}</span>
          </div>
        </div>

        <div class="bill-footer">
          <p>Thank You! Visit Again!</p>
          <p class="small">Save paper, save trees</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bill-container {
      max-width: 400px;
      margin: 0 auto;
      padding: 20px;
    }

    .bill-actions {
      margin-bottom: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 20px;
    }

    .theme-selector {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .theme-selector label {
      font-weight: 600;
      color: #333;
    }

    .theme-selector select {
      padding: 6px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      background: white;
      cursor: pointer;
    }

    .bill {
      background: white;
      padding: 20px;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      line-height: 1.6;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .bill-header {
      text-align: center;
      margin-bottom: 10px;
    }

    .store-logo {
      font-size: 40px;
      color: #2c3e50;
      margin-bottom: 10px;
    }

    .bill-header h1 {
      font-size: 18px;
      margin: 0 0 5px 0;
      font-weight: bold;
    }

    .bill-header p {
      margin: 0;
      font-size: 11px;
    }

    .bill-info {
      margin-bottom: 20px;
      margin-top: 15px;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
    }

    .bill-items {
      width: 100%;
      margin-bottom: 10px;
      margin-top: 10px;
    }

    .bill-items th {
      text-align: left;
      border-bottom: 1px solid #ddd;
      padding: 8px 0;
      font-size: 11px;
    }

    .bill-items td {
      padding: 6px 0;
      font-size: 11px;
    }

    .bill-total {
      margin: 20px 0 10px 0;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      margin: 3px 0;
      font-size: 11px;
    }

    .grand-total {
      font-weight: bold;
      font-size: 14px;
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid #ddd;
    }

    .bill-footer {
      text-align: center;
      margin-top: 25px;
      padding-top: 15px;
      border-top: 1px solid #ddd;
    }

    .bill-footer p {
      margin: 3px 0;
      font-size: 11px;
    }

    .bill-footer .small {
      font-size: 9px;
      font-style: italic;
    }

    /* Theme Styles */
    .theme-modern .bill {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      border-radius: 8px;
    }

    .theme-modern .bill-header {
      background: #2196F3;
      color: white;
      padding: 20px;
      margin: -20px -20px 20px -20px;
      border-radius: 8px 8px 0 0;
    }

    .theme-modern .store-logo {
      font-size: 36px;
      color: white;
    }

    .theme-modern h1 {
      color: white;
    }

    .theme-minimal .bill {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      border: none;
      box-shadow: none;
    }

    .theme-minimal .store-logo {
      display: none;
    }

    .theme-minimal h1 {
      font-size: 18px;
      font-weight: 500;
    }

    @media print {
      /* Hide navigation and buttons */
      .no-print,
      app-navigation,
      button,
      .btn {
        display: none !important;
      }

      /* Remove container padding and shadows */
      .bill-container {
        padding: 0 !important;
        margin: 0 !important;
        min-height: auto !important;
      }

      .bill {
        box-shadow: none !important;
        border: none !important;
        padding: 10px !important;
        margin: 0 !important;
      }

      /* Print settings for receipt printer */
      @page {
        size: 80mm auto;
        margin: 0;
      }
      
      /* Ensure clean printing */
      body {
        margin: 0;
        padding: 0;
      }
      
      /* Prevent text cutoff */
      * {
        overflow: visible !important;
      }
    }
  `]
})
export class BillComponent implements OnInit {
  transaction: Transaction | null = null;
  product: Product | null = null;
  selectedTheme: string = 'classic';

  constructor(
    private route: ActivatedRoute,
    private transactionService: TransactionService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    // Load saved theme preference
    const savedTheme = localStorage.getItem('billTheme');
    if (savedTheme) {
      this.selectedTheme = savedTheme;
    }
    
    const transactionId = this.route.snapshot.paramMap.get('id');
    if (transactionId) {
      this.loadTransaction(transactionId);
    }
  }

  loadTransaction(id: string): void {
    this.transactionService.getTransactionById(id).subscribe(transaction => {
      this.transaction = transaction;
      if (transaction && transaction.productId) {
        this.loadProduct(transaction.productId);
      }
    });
  }

  loadProduct(id: string): void {
    this.productService.getProductById(id).subscribe(product => {
      this.product = product;
    });
  }

  formatDate(date: Date | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-IN') + ' ' + d.toLocaleTimeString('en-IN');
  }

  calculateTax(amount: number, rate: number): string {
    return (amount * rate / 100).toFixed(2);
  }

  calculateGrandTotal(amount: number): string {
    const cgst = amount * 0.09;
    const sgst = amount * 0.09;
    return (amount + cgst + sgst).toFixed(2);
  }

  print(): void {
    window.print();
  }

  goBack(): void {
    window.history.back();
  }

  changeTheme(): void {
    // Theme will be applied automatically through [ngClass] binding
    // Optionally, you can save the theme preference to localStorage
    localStorage.setItem('billTheme', this.selectedTheme);
  }
}
