import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BillService } from '../../services/bill.service';
import { Bill } from '../../models/bill.model';

@Component({
  selector: 'app-bills-list',
  template: `
    <div class="bills-container">
      <div class="header-section">
        <h2><i class="fas fa-file-invoice-dollar"></i> Customer Bills</h2>
        <p class="subtitle">View all grouped customer purchases and invoices</p>
      </div>

      <div class="bills-grid">
        <div class="bills-header">
          <div class="header-cell">Bill Number</div>
          <div class="header-cell">Date & Time</div>
          <div class="header-cell">Items</div>
          <div class="header-cell">Total Amount</div>
          <div class="header-cell">Actions</div>
        </div>

        <div class="bills-list">
          <div *ngFor="let bill of paginatedBills" class="bill-row" (click)="viewBillDetails(bill.billId)">
            <div class="bill-cell bill-number">
              <i class="fas fa-receipt"></i>
              {{ bill.billId }}
            </div>
            <div class="bill-cell bill-date">
              {{ formatDate(bill.billDate) }}
            </div>
            <div class="bill-cell bill-items">
              <span class="items-badge">{{ bill.totalItems }} items</span>
            </div>
            <div class="bill-cell bill-amount">
              <span class="amount">₹{{ bill.totalAmount.toFixed(2) }}</span>
            </div>
            <div class="bill-cell bill-actions">
              <button class="view-btn" (click)="viewBillDetails(bill.billId); $event.stopPropagation()">
                <i class="fas fa-eye"></i> View
              </button>
              <button class="print-btn" (click)="printBill(bill.billId); $event.stopPropagation()">
                <i class="fas fa-print"></i> Print
              </button>
            </div>
          </div>

          <div *ngIf="bills.length === 0" class="no-bills">
            <i class="fas fa-file-invoice" style="font-size: 48px; color: #ccc; margin-bottom: 16px"></i>
            <p>No bills found</p>
          </div>
        </div>

        <!-- Pagination Controls -->
        <div class="pagination-container" *ngIf="bills.length > 0">
          <div class="pagination-info">
            <span>Showing {{ (currentPage - 1) * itemsPerPage + 1 }} - 
                  {{ Math.min(currentPage * itemsPerPage, bills.length) }} 
                  of {{ bills.length }} bills</span>
            
            <div class="items-per-page">
              <label>Items per page:</label>
              <select [(ngModel)]="itemsPerPage" (ngModelChange)="onItemsPerPageChange()">
                <option [value]="5">5</option>
                <option [value]="10">10</option>
                <option [value]="20">20</option>
                <option [value]="50">50</option>
              </select>
            </div>
          </div>
          
          <div class="pagination-controls">
            <button class="page-btn" (click)="previousPage()" [disabled]="currentPage === 1">
              <i class="fas fa-chevron-left"></i>
            </button>
            
            <button *ngFor="let page of getPageNumbers()" 
                    class="page-btn" 
                    [class.active]="page === currentPage"
                    (click)="goToPage(page)">
              {{ page }}
            </button>
            
            <button class="page-btn" (click)="nextPage()" [disabled]="currentPage === totalPages">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bills-container {
      padding: 24px;
      background: #f5f5f5;
      min-height: calc(100vh - 60px);
    }

    .header-section {
      margin-bottom: 32px;
      background: white;
      padding: 24px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .header-section h2 {
      margin: 0;
      color: #333;
      font-size: 28px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .header-section h2 i {
      color: #4CAF50;
    }

    .subtitle {
      margin: 8px 0 0 0;
      color: #666;
      font-size: 16px;
    }

    .bills-grid {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .bills-header {
      display: grid;
      grid-template-columns: 2fr 2fr 1fr 1.5fr 1.5fr;
      background: #4CAF50;
      color: white;
      font-weight: 600;
    }

    .header-cell {
      padding: 16px;
      border-right: 1px solid rgba(255,255,255,0.2);
    }

    .header-cell:last-child {
      border-right: none;
    }

    .bills-list {
      min-height: 400px;
    }

    .bill-row {
      display: grid;
      grid-template-columns: 2fr 2fr 1fr 1.5fr 1.5fr;
      border-bottom: 1px solid #f0f0f0;
      transition: background 0.2s;
      cursor: pointer;
    }

    .bill-row:hover {
      background: #f8f8f8;
    }

    .bill-cell {
      padding: 16px;
      display: flex;
      align-items: center;
      border-right: 1px solid #f0f0f0;
    }

    .bill-cell:last-child {
      border-right: none;
    }

    .bill-number {
      font-weight: 600;
      color: #2196F3;
      gap: 8px;
    }

    .bill-number i {
      color: #2196F3;
    }

    .bill-date {
      color: #666;
    }

    .items-badge {
      background: #E3F2FD;
      color: #1976D2;
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 14px;
      font-weight: 500;
    }

    .amount {
      font-weight: 600;
      color: #4CAF50;
      font-size: 18px;
    }

    .bill-actions {
      gap: 8px;
      justify-content: center;
    }

    .view-btn, .print-btn {
      padding: 6px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .view-btn {
      background: #2196F3;
      color: white;
    }

    .view-btn:hover {
      background: #1976D2;
    }

    .print-btn {
      background: #FF9800;
      color: white;
    }

    .print-btn:hover {
      background: #F57C00;
    }

    .no-bills {
      padding: 64px;
      text-align: center;
      color: #999;
    }

    .no-bills p {
      margin: 0;
      font-size: 18px;
    }


    @media (max-width: 1024px) {
      .bills-header,
      .bill-row {
        grid-template-columns: 2fr 1.5fr 1fr 1.5fr;
      }

      .header-cell:nth-child(2),
      .bill-cell:nth-child(2) {
        display: none;
      }
    }

    /* Pagination Styles */
    .pagination-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-top: 1px solid #e0e0e0;
      background: #fafafa;
    }

    .pagination-info {
      display: flex;
      align-items: center;
      gap: 20px;
      font-size: 14px;
      color: #666;
    }

    .items-per-page {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .items-per-page label {
      font-weight: 500;
    }

    .items-per-page select {
      padding: 6px 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
      cursor: pointer;
      font-size: 14px;
    }

    .pagination-controls {
      display: flex;
      gap: 5px;
    }

    .page-btn {
      min-width: 36px;
      height: 36px;
      padding: 0 10px;
      border: 1px solid #ddd;
      background: white;
      color: #333;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    }

    .page-btn:hover:not(:disabled) {
      background: #f5f5f5;
      border-color: #999;
    }

    .page-btn.active {
      background: #4CAF50;
      color: white;
      border-color: #4CAF50;
    }

    .page-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: #f5f5f5;
    }

    @media (max-width: 768px) {
      .bills-container {
        padding: 16px;
      }

      .bills-header,
      .bill-row {
        grid-template-columns: 2fr 1fr 1fr;
      }

      .header-cell:nth-child(5),
      .bill-cell:nth-child(5) {
        display: none;
      }

      .pagination-container {
        flex-direction: column;
        gap: 15px;
      }

      .pagination-info {
        flex-direction: column;
        gap: 10px;
        text-align: center;
      }
    }
  `]
})
export class BillsListComponent implements OnInit {
  bills: Bill[] = [];
  paginatedBills: Bill[] = [];
  
  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;

  // Make Math available in template
  Math = Math;

  constructor(
    private billService: BillService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadBills();
  }

  loadBills() {
    this.billService.getAllBills().subscribe(
      bills => {
        this.bills = bills;
        this.updatePagination();
      },
      error => {
        console.error('Error loading bills:', error);
      }
    );
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.bills.length / this.itemsPerPage);
    this.goToPage(1);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    
    this.currentPage = page;
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedBills = this.bills.slice(startIndex, endIndex);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  onItemsPerPageChange() {
    this.updatePagination();
  }

  viewBillDetails(billId: string) {
    this.router.navigate(['/bills', billId]);
  }

  printBill(billId: string) {
    // Navigate to bill detail with print mode
    this.router.navigate(['/bills', billId], { queryParams: { print: true } });
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    const dateStr = d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    const timeStr = d.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return `${dateStr} ${timeStr}`;
  }
}
