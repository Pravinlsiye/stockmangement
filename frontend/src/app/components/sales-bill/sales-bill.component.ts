import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface BillItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface BillData {
  billNumber: string;
  date: Date;
  items: BillItem[];
  subTotal: number;
  cgst: number;
  sgst: number;
  grandTotal: number;
}

@Component({
  selector: 'app-sales-bill',
  template: `
    <div class="bill-container">
      <div class="bill-actions no-print">
        <button class="btn btn-primary" (click)="print()">
          <i class="fas fa-print"></i> Print Bill
        </button>
        <button class="btn btn-success" (click)="newSale()">
          <i class="fas fa-plus"></i> New Sale
        </button>
        <button class="btn" (click)="goBack()">
          <i class="fas fa-arrow-left"></i> Back to Sales
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
            <span>Bill No: {{ billData?.billNumber }}</span>
          </div>
          <div class="info-row">
            <span>Date: {{ formatDate(billData?.date) }}</span>
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
            <tr *ngFor="let item of billData?.items">
              <td class="item-name">{{ item.productName }}</td>
              <td>{{ item.quantity }}</td>
              <td>₹{{ item.unitPrice }}</td>
              <td>₹{{ item.totalPrice }}</td>
            </tr>
          </tbody>
        </table>

        <div class="bill-divider">----------------------------------</div>

        <div class="bill-total">
          <div class="total-row">
            <span>Sub Total:</span>
            <span>₹{{ billData?.subTotal?.toFixed(2) }}</span>
          </div>
          <div class="total-row">
            <span>CGST (9%):</span>
            <span>₹{{ billData?.cgst?.toFixed(2) }}</span>
          </div>
          <div class="total-row">
            <span>SGST (9%):</span>
            <span>₹{{ billData?.sgst?.toFixed(2) }}</span>
          </div>
          <div class="bill-divider">----------------------------------</div>
          <div class="total-row grand-total">
            <span>GRAND TOTAL:</span>
            <span>₹{{ billData?.grandTotal?.toFixed(2) }}</span>
          </div>
          <div class="total-items">
            Total Items: {{ billData?.items?.length || 0 }}
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

    .btn-success {
      background-color: #28a745;
      color: white;
    }

    .btn-success:hover {
      background-color: #218838;
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
      font-size: 11px;
      margin: 2px 0;
    }

    .bill-items {
      width: 100%;
      margin-bottom: 10px;
    }

    .bill-items th {
      text-align: left;
      border-bottom: 1px dashed #000;
      padding: 5px 2px;
      font-size: 11px;
    }

    .bill-items td {
      padding: 3px 2px;
      font-size: 11px;
      vertical-align: top;
    }

    .item-name {
      word-wrap: break-word;
      max-width: 150px;
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

    .total-items {
      text-align: center;
      font-size: 10px;
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
        max-width: 100%;
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
export class SalesBillComponent implements OnInit {
  billData: BillData | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const data = sessionStorage.getItem('currentBill');
    if (data) {
      this.billData = JSON.parse(data);
    } else {
      // If no bill data, redirect back to sales
      this.router.navigate(['/sales']);
    }
  }

  formatDate(date: Date | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-IN') + ' ' + d.toLocaleTimeString('en-IN');
  }

  print(): void {
    window.print();
  }

  newSale(): void {
    sessionStorage.removeItem('currentBill');
    this.router.navigate(['/sales']);
  }

  goBack(): void {
    this.router.navigate(['/sales']);
  }
}
