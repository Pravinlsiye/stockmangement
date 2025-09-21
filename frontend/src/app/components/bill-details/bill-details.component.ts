import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BillService } from '../../services/bill.service';
import { Bill } from '../../models/bill.model';

@Component({
  selector: 'app-bill-details',
  template: `
    <div class="bill-details-container" [class.print-mode]="printMode">
      <div class="action-bar" *ngIf="!printMode">
        <button class="back-btn" (click)="goBack()">
          <i class="fas fa-arrow-left"></i> Back to Bills
        </button>
        <div class="theme-selector">
          <label>Bill Style:</label>
           <select [(ngModel)]="selectedTheme" (change)="changeTheme()">
            <option value="classic">Classic Receipt</option>
            <option value="traditional">Traditional Receipt</option>
            <option value="modern">Modern Invoice</option>
            <option value="elegant">Elegant Style</option>
          </select>
        </div>
      </div>

      <div class="bill-wrapper" id="billContent" [ngClass]="'theme-' + selectedTheme">
        <div class="bill-header" *ngIf="selectedTheme === 'traditional'">
          <div class="store-logo">
            <i class="fas fa-warehouse"></i>
          </div>
          <h1>StockPro SuperMarket</h1>
          <p>45, Gandhi Market, Karur - 639001</p>
          <p>Tamil Nadu, India</p>
          <p>Phone: +91-98430-12345 | GST: 33ABCDE1234F1Z5</p>
        </div>

        <div class="bill-info" *ngIf="selectedTheme === 'traditional'">
          <div class="info-row">
            <span>Bill No: {{ bill?.billId }}</span>
            <span>Date: {{ formatDate(bill?.billDate) }}</span>
          </div>
        </div>

        <!-- Original header for other themes -->
        <div class="bill-header" *ngIf="selectedTheme !== 'traditional'">
          <div class="shop-info">
            <h1>SUPERMARKET</h1>
            <p>Tamil Nadu, Karur</p>
            <p>Phone: +91 98765 43210</p>
            <p>GSTIN: 33AAAAA0000A1Z5</p>
          </div>
          <div class="bill-info">
            <h2>CUSTOMER INVOICE</h2>
            <p><strong>Bill No:</strong> {{ bill?.billId }}</p>
            <p><strong>Date:</strong> {{ formatDate(bill?.billDate) }}</p>
            <p><strong>Type:</strong> Grouped Sale</p>
          </div>
        </div>

        <div class="bill-items">
          <table class="bill-items" *ngIf="selectedTheme === 'traditional'">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of bill?.items">
                <td>{{ item.productName }}</td>
                <td>{{ item.quantity }}</td>
                <td>₹{{ item.unitPrice }}</td>
                <td>₹{{ item.totalPrice }}</td>
              </tr>
            </tbody>
          </table>
          
          <table *ngIf="selectedTheme !== 'traditional'">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Item Description</th>
                <th>Code</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of bill?.items; let i = index">
                <td>{{ i + 1 }}</td>
                <td>{{ item.productName }}</td>
                <td>{{ item.productCode }}</td>
                <td>{{ item.quantity }}</td>
                <td>₹{{ item.unitPrice.toFixed(2) }}</td>
                <td>₹{{ item.totalPrice.toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="bill-total" *ngIf="selectedTheme === 'traditional'">
          <div class="total-row">
            <span>Sub Total:</span>
            <span>₹{{ calculateSubTotal().toFixed(2) }}</span>
          </div>
          <div class="total-row">
            <span>CGST (9%):</span>
            <span>₹{{ calculateCGST().toFixed(2) }}</span>
          </div>
          <div class="total-row">
            <span>SGST (9%):</span>
            <span>₹{{ calculateSGST().toFixed(2) }}</span>
          </div>
          <div class="total-row grand-total">
            <span>GRAND TOTAL:</span>
            <span>₹{{ calculateGrandTotal().toFixed(2) }}</span>
          </div>
        </div>

        <div class="bill-summary" *ngIf="selectedTheme !== 'traditional'">
          <div class="summary-row">
            <span>Sub Total:</span>
            <span>₹{{ calculateSubTotal().toFixed(2) }}</span>
          </div>
          <div class="summary-row">
            <span>CGST (9%):</span>
            <span>₹{{ calculateCGST().toFixed(2) }}</span>
          </div>
          <div class="summary-row">
            <span>SGST (9%):</span>
            <span>₹{{ calculateSGST().toFixed(2) }}</span>
          </div>
          <div class="summary-row total">
            <span>Grand Total:</span>
            <span>₹{{ calculateGrandTotal().toFixed(2) }}</span>
          </div>
        </div>

        <div class="bill-footer">
          <p>{{ selectedTheme === 'traditional' ? 'Thank You! Visit Again!' : 'Thank you for shopping with us!' }}</p>
          <p class="small">{{ selectedTheme === 'traditional' ? 'Save paper, save trees' : 'Visit again' }}</p>
        </div>
      </div>

      <div class="action-buttons" *ngIf="!printMode">
        <button class="print-btn" (click)="printBill()">
          <i class="fas fa-print"></i> Print Bill
        </button>
      </div>
    </div>
  `,
  styles: [`
    .bill-details-container {
      padding: 24px;
      background: #f5f5f5;
      min-height: calc(100vh - 60px);
    }

    .action-bar {
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .back-btn {
      padding: 10px 20px;
      background: #2196F3;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .back-btn:hover {
      background: #1976D2;
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
      padding: 8px 16px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      background: white;
      cursor: pointer;
    }

    .bill-wrapper {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .bill-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid #333;
    }

    .shop-info h1 {
      margin: 0;
      font-size: 32px;
      color: #4CAF50;
    }

    .shop-info p {
      margin: 4px 0;
      color: #666;
    }

    .bill-info {
      text-align: right;
    }

    .bill-info h2 {
      margin: 0 0 16px 0;
      font-size: 24px;
      color: #333;
    }

    .bill-info p {
      margin: 4px 0;
      color: #666;
    }

    .bill-items {
      margin-bottom: 40px;
    }

    .bill-items table {
      width: 100%;
      border-collapse: collapse;
    }

    .bill-items th {
      background: #f5f5f5;
      padding: 12px;
      text-align: left;
      border-bottom: 2px solid #ddd;
      font-weight: 600;
      color: #333;
    }

    .bill-items td {
      padding: 12px;
      border-bottom: 1px solid #eee;
      color: #666;
    }

    .bill-items tr:last-child td {
      border-bottom: 2px solid #ddd;
    }

    .bill-summary {
      margin-left: auto;
      width: 300px;
      margin-bottom: 40px;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 16px;
    }

    .summary-row.total {
      margin-top: 8px;
      padding-top: 16px;
      border-top: 2px solid #333;
      font-size: 20px;
      font-weight: 600;
      color: #4CAF50;
    }

    .bill-footer {
      text-align: center;
      padding-top: 20px;
      border-top: 1px dashed #ddd;
      color: #666;
    }

    .bill-footer p {
      margin: 8px 0;
    }

    .action-buttons {
      text-align: center;
      margin-top: 32px;
    }

    .print-btn {
      padding: 12px 32px;
      background: #FF9800;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 18px;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .print-btn:hover {
      background: #F57C00;
    }

    /* Theme Styles */
    /* Classic Theme - Default monospace receipt style */
    .theme-classic .bill-wrapper {
      font-family: 'Courier New', monospace;
    }

    .theme-classic .bill-header {
      border-bottom: 2px solid #333;
      padding-bottom: 20px;
    }

    .theme-classic table {
      font-family: 'Courier New', monospace;
    }

    /* Modern Theme */
    .theme-modern .bill-wrapper {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.08);
    }

    .theme-modern .bill-header {
      background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
      color: white;
      padding: 40px;
      margin: -40px -40px 30px -40px;
      border-radius: 12px 12px 0 0;
    }

    .theme-modern .shop-info h1,
    .theme-modern .shop-info p,
    .theme-modern .bill-info h2,
    .theme-modern .bill-info p {
      color: white;
    }

    .theme-modern table {
      border-collapse: separate;
      border-spacing: 0;
    }

    .theme-modern table th {
      background: #E3F2FD;
      color: #1976D2;
      font-weight: 600;
    }

    .theme-modern table tr:hover {
      background: #F5F5F5;
    }

    .theme-modern .bill-summary {
      background: #F5F5F5;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }

    .theme-modern .summary-row.total {
      background: #E3F2FD;
      padding: 12px;
      border-radius: 4px;
      margin: 8px -12px -12px -12px;
    }

    /* Elegant Theme */
    .theme-elegant .bill-wrapper {
      font-family: 'Georgia', serif;
      border: 2px solid #D4AF37;
      box-shadow: 0 8px 24px rgba(0,0,0,0.1);
    }

    .theme-elegant .bill-header {
      text-align: center;
      padding-bottom: 30px;
      border-bottom: 1px solid #D4AF37;
    }

    .theme-elegant .shop-info h1 {
      font-size: 36px;
      color: #D4AF37;
      font-weight: 400;
      letter-spacing: 2px;
    }

    .theme-elegant .bill-info {
      text-align: center;
      border-top: 1px solid #D4AF37;
      border-bottom: 1px solid #D4AF37;
      padding: 20px 0;
      margin: 20px 0;
    }

    .theme-elegant table {
      font-family: 'Georgia', serif;
    }

    .theme-elegant table th {
      border-bottom: 2px solid #D4AF37;
      color: #333;
      font-weight: 400;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-size: 13px;
    }

    .theme-elegant .summary-row.total {
      border-top: 2px solid #D4AF37;
      color: #D4AF37;
      font-size: 22px;
    }

    .theme-elegant .bill-footer {
      text-align: center;
      border-top: 1px solid #D4AF37;
      padding-top: 30px;
      font-style: italic;
    }

    /* Traditional Theme - Direct copy from individual transaction bill classic style */
    .bill-wrapper.theme-traditional {
      background: white !important;
      padding: 20px !important;
      font-family: 'Courier New', monospace !important;
      font-size: 12px !important;
      line-height: 1.6 !important;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
      max-width: 400px !important;
      margin: 0 auto !important;
      border-radius: 0 !important;
    }

    .theme-traditional .bill-header {
      text-align: center !important;
      margin-bottom: 10px !important;
      border-bottom: none !important;
      display: block !important;
      justify-content: unset !important;
      padding-bottom: 0 !important;
    }

    .theme-traditional .store-logo {
      font-size: 40px !important;
      color: #2c3e50 !important;
      margin-bottom: 10px !important;
      display: block !important;
      text-align: center !important;
    }

    .theme-traditional .bill-header h1,
    .theme-traditional .shop-info h1 {
      font-size: 18px !important;
      margin: 0 0 5px 0 !important;
      font-weight: bold !important;
      text-align: center !important;
      display: block !important;
    }

    .theme-traditional .bill-header p,
    .theme-traditional .shop-info p {
      margin: 0 !important;
      font-size: 11px !important;
      text-align: center !important;
      display: block !important;
    }

    .theme-traditional .shop-info {
      text-align: center !important;
      width: 100% !important;
      display: block !important;
    }


    .theme-traditional .bill-info {
      margin-bottom: 20px !important;
      margin-top: 15px !important;
      display: block !important;
    }

    .theme-traditional .info-row {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
    }

    .theme-traditional .bill-items {
      width: 100%;
      margin-bottom: 10px;
      margin-top: 10px;
    }

    .theme-traditional .bill-items th {
      text-align: left;
      border-bottom: 1px solid #ddd;
      padding: 8px 0;
      font-size: 11px;
    }

    .theme-traditional .bill-items td {
      padding: 6px 0;
      font-size: 11px;
    }

    .theme-traditional .bill-total,
    .theme-traditional .bill-summary {
      margin: 20px 0 10px 0;
    }

    .theme-traditional .total-row,
    .theme-traditional .summary-row {
      display: flex;
      justify-content: space-between;
      margin: 3px 0;
      font-size: 11px;
    }

    .theme-traditional .grand-total,
    .theme-traditional .summary-row.total {
      font-weight: bold;
      font-size: 14px;
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid #ddd;
    }

    .theme-traditional .bill-footer {
      text-align: center;
      margin-top: 25px;
      padding-top: 15px;
      border-top: 1px solid #ddd;
    }

    .theme-traditional .bill-footer p {
      margin: 3px 0;
      font-size: 11px;
    }

    .theme-traditional .bill-footer .small {
      font-size: 9px;
      font-style: italic;
    }

    /* Print styles */
    @media print {
      .bill-details-container {
        padding: 0;
        background: white;
      }

      .action-bar,
      .action-buttons {
        display: none !important;
      }

      .bill-wrapper {
        box-shadow: none;
        padding: 20px;
        max-width: 100%;
      }

      /* Traditional theme print optimization for 80mm receipt printer */
      .theme-traditional .bill-wrapper {
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
    }

    .print-mode {
      padding: 0;
      background: white;
    }

    .print-mode .bill-wrapper {
      box-shadow: none;
      border-radius: 0;
      padding: 20px;
      max-width: 100%;
    }
  `]
})
export class BillDetailsComponent implements OnInit {
  bill: Bill | null = null;
  printMode: boolean = false;
  selectedTheme: string = 'traditional';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private billService: BillService
  ) {}

  ngOnInit() {
    // Load saved theme preference
    const savedTheme = localStorage.getItem('customerBillTheme');
    if (savedTheme) {
      this.selectedTheme = savedTheme;
    }
    
    const billId = this.route.snapshot.paramMap.get('id');
    if (billId) {
      this.loadBillDetails(billId);
    }

    // Check if print mode
    this.route.queryParams.subscribe(params => {
      if (params['print'] === 'true') {
        this.printMode = true;
        setTimeout(() => this.printBill(), 500);
      }
    });
  }

  loadBillDetails(billId: string) {
    this.billService.getBillDetails(billId).subscribe(
      bill => {
        this.bill = bill;
      },
      error => {
        console.error('Error loading bill details:', error);
      }
    );
  }

  calculateSubTotal(): number {
    if (!this.bill || !this.bill.items) return 0;
    return this.bill.items.reduce((sum, item) => sum + item.totalPrice, 0);
  }

  calculateCGST(): number {
    return this.calculateSubTotal() * 0.09;
  }

  calculateSGST(): number {
    return this.calculateSubTotal() * 0.09;
  }

  calculateGrandTotal(): number {
    return this.calculateSubTotal() + this.calculateCGST() + this.calculateSGST();
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  printBill() {
    window.print();
  }

  goBack() {
    this.router.navigate(['/bills']);
  }

  changeTheme() {
    // Save theme preference for customer bills
    localStorage.setItem('customerBillTheme', this.selectedTheme);
  }
}
