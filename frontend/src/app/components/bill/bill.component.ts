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
        <button class="btn btn-primary" (click)="print()">
          <i class="fas fa-print"></i> Print Bill
        </button>
        <button class="btn" (click)="goBack()">
          <i class="fas fa-arrow-left"></i> Back
        </button>
      </div>

      <div class="bill" id="billContent">
        <div class="bill-header">
          <div class="store-logo">
            <i class="fas fa-warehouse"></i>
          </div>
          <h1>StockPro SuperMarket</h1>
          <p>45, Gandhi Market, Karur - 639001</p>
          <p>Tamil Nadu, India</p>
          <p>Phone: +91-98430-12345 | GST: 33ABCDE1234F1Z5</p>
        </div>

        <div class="bill-divider">==================================</div>

        <div class="bill-info">
          <div class="info-row">
            <span>Bill No: {{ transaction?.reference }}</span>
            <span>Date: {{ formatDate(transaction?.transactionDate) }}</span>
          </div>
        </div>

        <div class="bill-divider">==================================</div>

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

        <div class="bill-divider">----------------------------------</div>

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
          <div class="bill-divider">----------------------------------</div>
          <div class="total-row grand-total">
            <span>GRAND TOTAL:</span>
            <span>₹{{ calculateGrandTotal(transaction?.totalAmount || 0) }}</span>
          </div>
        </div>

        <div class="bill-divider">==================================</div>

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
      gap: 10px;
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

    .bill-divider {
      text-align: center;
      margin: 10px 0;
      letter-spacing: -1px;
    }

    .bill-info {
      margin-bottom: 10px;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
    }

    .bill-items {
      width: 100%;
      margin-bottom: 10px;
    }

    .bill-items th {
      text-align: left;
      border-bottom: 1px dashed #000;
      padding: 5px 0;
      font-size: 11px;
    }

    .bill-items td {
      padding: 5px 0;
      font-size: 11px;
    }

    .bill-total {
      margin: 10px 0;
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
      margin-top: 5px;
    }

    .bill-footer {
      text-align: center;
      margin-top: 15px;
    }

    .bill-footer p {
      margin: 3px 0;
      font-size: 11px;
    }

    .bill-footer .small {
      font-size: 9px;
      font-style: italic;
    }

    @media print {
      .no-print {
        display: none !important;
      }

      .bill-container {
        padding: 0;
      }

      .bill {
        box-shadow: none;
        padding: 10px;
      }

      @page {
        size: 80mm 200mm;
        margin: 0;
      }
    }
  `]
})
export class BillComponent implements OnInit {
  transaction: Transaction | null = null;
  product: Product | null = null;

  constructor(
    private route: ActivatedRoute,
    private transactionService: TransactionService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
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
}
