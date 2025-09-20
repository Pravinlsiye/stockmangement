import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { AnalyticsService, SalesFrequency, ProductSalesTrend, TopProduct, RevenueAnalytics } from '../../services/analytics.service';

@Component({
  selector: 'app-reports',
  template: `
    <div class="reports-container">
      <div class="page-header">
        <h1><i class="fas fa-chart-line"></i> Business Analytics</h1>
        <div class="header-info">
          <span>Real-time insights for your supermarket</span>
        </div>
      </div>

      <!-- Revenue Overview Cards -->
      <div class="metrics-grid" *ngIf="revenueAnalytics">
        <div class="metric-card">
          <div class="metric-icon revenue">
            <i class="fas fa-rupee-sign"></i>
          </div>
          <div class="metric-content">
            <h3>Today's Revenue</h3>
            <p class="metric-value">₹{{ revenueAnalytics.todayRevenue | number:'1.2-2' }}</p>
            <span class="metric-label">{{ revenueAnalytics.todayTransactions }} transactions</span>
          </div>
        </div>
        
        <div class="metric-card">
          <div class="metric-icon profit">
            <i class="fas fa-chart-line"></i>
          </div>
          <div class="metric-content">
            <h3>Weekly Profit</h3>
            <p class="metric-value">₹{{ revenueAnalytics.weekProfit | number:'1.2-2' }}</p>
            <span class="metric-label">From ₹{{ revenueAnalytics.weekRevenue | number:'1.2-2' }} revenue</span>
          </div>
        </div>
        
        <div class="metric-card">
          <div class="metric-icon sales">
            <i class="fas fa-shopping-cart"></i>
          </div>
          <div class="metric-content">
            <h3>Monthly Sales</h3>
            <p class="metric-value">{{ revenueAnalytics.monthTransactions }}</p>
            <span class="metric-label">₹{{ revenueAnalytics.monthRevenue | number:'1.2-2' }} total</span>
          </div>
        </div>
        
        <div class="metric-card">
          <div class="metric-icon margin">
            <i class="fas fa-percentage"></i>
          </div>
          <div class="metric-content">
            <h3>Profit Margin</h3>
            <p class="metric-value">{{ calculateProfitMargin() }}%</p>
            <span class="metric-label">Monthly average</span>
          </div>
        </div>
      </div>

      <!-- Charts Row 1 -->
      <div class="charts-row">
        <!-- Sales Frequency Chart -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>Sales Frequency (Last {{ selectedDays }} Days)</h3>
            <div class="chart-controls">
              <button class="btn-small" [class.active]="selectedDays === 7" (click)="loadSalesFrequency(7)">7 Days</button>
              <button class="btn-small" [class.active]="selectedDays === 30" (click)="loadSalesFrequency(30)">30 Days</button>
              <button class="btn-small" [class.active]="selectedDays === 90" (click)="loadSalesFrequency(90)">90 Days</button>
            </div>
          </div>
          <div class="chart-content">
            <canvas baseChart
              [data]="salesFrequencyData"
              [options]="salesFrequencyOptions"
              [type]="'line'"
              *ngIf="salesFrequencyData">
            </canvas>
          </div>
        </div>

        <!-- Top Products Chart -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>Top Selling Products</h3>
          </div>
          <div class="chart-content">
            <canvas baseChart
              [data]="topProductsData"
              [options]="topProductsOptions"
              [type]="'bar'"
              *ngIf="topProductsData">
            </canvas>
          </div>
        </div>
      </div>

      <!-- Product Trends Table with Predictions -->
      <div class="table-card">
        <div class="table-header">
          <h3><i class="fas fa-box"></i> Product Sales Trends & Purchase Predictions</h3>
          <div class="legend">
            <span class="urgent"><i class="fas fa-exclamation-circle"></i> Urgent Order</span>
            <span class="warning"><i class="fas fa-exclamation-triangle"></i> Order Soon</span>
            <span class="good"><i class="fas fa-check-circle"></i> Good Stock</span>
          </div>
        </div>
        <div class="table-container">
          <table class="trends-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Current Stock</th>
                <th>30-Day Sales</th>
                <th>Daily Avg</th>
                <th>Days Until Stockout</th>
                <th>Suggested Order Date</th>
                <th>Order Quantity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let trend of paginatedProductTrends" [class.urgent-row]="trend.daysUntilStockout <= 3"
                  [class.warning-row]="trend.daysUntilStockout > 3 && trend.daysUntilStockout <= 7">
                <td class="product-name">{{ trend.productName }}</td>
                <td>{{ trend.currentStock }}</td>
                <td>{{ trend.totalSold }}</td>
                <td>{{ trend.averageDailySales | number:'1.1-1' }}</td>
                <td>
                  <span class="days-badge" [class.urgent]="trend.daysUntilStockout <= 3"
                        [class.warning]="trend.daysUntilStockout > 3 && trend.daysUntilStockout <= 7">
                    {{ trend.daysUntilStockout || 'N/A' }}
                  </span>
                </td>
                <td>{{ formatDate(trend.suggestedOrderDate) }}</td>
                <td>{{ trend.suggestedOrderQuantity || '-' }}</td>
                <td>
                  <span class="status-badge" 
                        [class.urgent]="trend.daysUntilStockout <= 3"
                        [class.warning]="trend.daysUntilStockout > 3 && trend.daysUntilStockout <= 7"
                        [class.good]="trend.daysUntilStockout > 7">
                    <i class="fas" 
                       [class.fa-exclamation-circle]="trend.daysUntilStockout <= 3"
                       [class.fa-exclamation-triangle]="trend.daysUntilStockout > 3 && trend.daysUntilStockout <= 7"
                       [class.fa-check-circle]="trend.daysUntilStockout > 7"></i>
                    {{ getStockStatus(trend.daysUntilStockout) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination Controls -->
        <div class="pagination-container" *ngIf="productTrends.length > 0">
          <div class="pagination-info">
            <span>Showing {{ (currentPage - 1) * itemsPerPage + 1 }} - 
                  {{ Math.min(currentPage * itemsPerPage, productTrends.length) }} 
                  of {{ productTrends.length }} products</span>
            
            <div class="items-per-page">
              <label>Items per page:</label>
              <select [(ngModel)]="itemsPerPage" (ngModelChange)="updatePagination()">
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

      <!-- Charts Row 2 -->
      <div class="charts-row">
        <!-- Category Distribution -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>Sales by Category</h3>
          </div>
          <div class="chart-content">
            <canvas baseChart
              [data]="categoryData"
              [options]="categoryOptions"
              [type]="'doughnut'"
              *ngIf="categoryData">
            </canvas>
          </div>
        </div>

        <!-- Revenue Trend -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>Revenue vs Profit Trend</h3>
          </div>
          <div class="chart-content">
            <canvas baseChart
              [data]="revenueTrendData"
              [options]="revenueTrendOptions"
              [type]="'line'"
              *ngIf="revenueTrendData">
            </canvas>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reports-container {
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 30px;
    }

    .page-header h1 {
      margin: 0;
      color: #333;
      font-size: 28px;
    }

    .header-info {
      color: #666;
      margin-top: 5px;
    }

    /* Metrics Grid */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .metric-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      display: flex;
      align-items: center;
      gap: 20px;
      transition: transform 0.2s;
    }

    .metric-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.12);
    }

    .metric-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
    }

    .metric-icon.revenue {
      background: #e3f2fd;
      color: #1976d2;
    }

    .metric-icon.profit {
      background: #e8f5e9;
      color: #388e3c;
    }

    .metric-icon.sales {
      background: #fff3e0;
      color: #f57c00;
    }

    .metric-icon.margin {
      background: #f3e5f5;
      color: #7b1fa2;
    }

    .metric-content h3 {
      margin: 0;
      font-size: 14px;
      color: #666;
      font-weight: 500;
    }

    .metric-value {
      margin: 8px 0;
      font-size: 24px;
      font-weight: 700;
      color: #333;
    }

    .metric-label {
      font-size: 12px;
      color: #999;
    }

    /* Charts */
    .charts-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .chart-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .chart-header h3 {
      margin: 0;
      font-size: 18px;
      color: #333;
    }

    .chart-controls {
      display: flex;
      gap: 8px;
    }

    .btn-small {
      padding: 5px 12px;
      border: 1px solid #ddd;
      background: white;
      border-radius: 6px;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-small:hover {
      background: #f5f5f5;
    }

    .btn-small.active {
      background: #1976d2;
      color: white;
      border-color: #1976d2;
    }

    .chart-content {
      height: 300px;
      position: relative;
    }

    /* Table */
    .table-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      margin-bottom: 30px;
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .table-header h3 {
      margin: 0;
      font-size: 18px;
      color: #333;
    }

    .legend {
      display: flex;
      gap: 20px;
      font-size: 13px;
    }

    .legend span {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .legend .urgent {
      color: #dc3545;
    }

    .legend .warning {
      color: #ff9800;
    }

    .legend .good {
      color: #28a745;
    }

    .table-container {
      overflow-x: auto;
    }

    .trends-table {
      width: 100%;
      border-collapse: collapse;
    }

    .trends-table th {
      background: #f8f9fa;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      color: #555;
      border-bottom: 2px solid #dee2e6;
    }

    .trends-table td {
      padding: 12px;
      border-bottom: 1px solid #f0f0f0;
    }

    .trends-table tbody tr:hover {
      background: #f8f9fa;
    }

    .urgent-row {
      background: #ffebee !important;
    }

    .warning-row {
      background: #fff8e1 !important;
    }

    .product-name {
      font-weight: 600;
      color: #333;
    }

    .days-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
    }

    .days-badge.urgent {
      background: #dc3545;
      color: white;
    }

    .days-badge.warning {
      background: #ff9800;
      color: white;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }

    .status-badge.urgent {
      background: #ffebee;
      color: #dc3545;
    }

    .status-badge.warning {
      background: #fff8e1;
      color: #ff9800;
    }

    .status-badge.good {
      background: #e8f5e9;
      color: #28a745;
    }

    /* Pagination Styles */
    .pagination-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-top: 1px solid #dee2e6;
      background: #f8f9fa;
      border-radius: 0 0 12px 12px;
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
      padding: 5px 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
      cursor: pointer;
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
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .page-btn:hover:not(:disabled) {
      background: #f5f5f5;
      border-color: #999;
    }

    .page-btn.active {
      background: #1976d2;
      color: white;
      border-color: #1976d2;
    }

    .page-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .charts-row {
        grid-template-columns: 1fr;
      }

      .metrics-grid {
        grid-template-columns: 1fr;
      }

      .table-container {
        overflow-x: scroll;
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
export class ReportsComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  Math = Math; // Make Math available in template

  // Data
  revenueAnalytics: RevenueAnalytics | null = null;
  productTrends: ProductSalesTrend[] = [];
  topProducts: TopProduct[] = [];
  salesFrequencyList: SalesFrequency[] = [];
  selectedDays: number = 30; // Track selected time period
  
  // Pagination for Product Trends
  paginatedProductTrends: ProductSalesTrend[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;

  // Chart configurations
  salesFrequencyData: ChartConfiguration<'line'>['data'] | null = null;
  salesFrequencyOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  topProductsData: ChartConfiguration<'bar'>['data'] | null = null;
  topProductsOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  categoryData: ChartConfiguration<'doughnut'>['data'] | null = null;
  categoryOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
    },
  };

  revenueTrendData: ChartConfiguration<'line'>['data'] | null = null;
  revenueTrendOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit() {
    this.loadAllData();
  }

  loadAllData() {
    this.loadRevenueAnalytics();
    this.loadSalesFrequency(30);
    this.loadProductTrends();
    this.loadTopProducts();
  }

  loadRevenueAnalytics() {
    this.analyticsService.getRevenueAnalytics().subscribe(data => {
      this.revenueAnalytics = data;
      this.updateRevenueTrendChart();
    });
  }

  loadSalesFrequency(days: number) {
    this.selectedDays = days; // Update selected days
    this.analyticsService.getSalesFrequency(days).subscribe(data => {
      this.salesFrequencyList = data;
      this.updateSalesFrequencyChart();
    });
  }

  loadProductTrends() {
    this.analyticsService.getProductSalesTrends().subscribe(data => {
      this.productTrends = data;
      this.updatePagination();
    });
  }

  loadTopProducts() {
    this.analyticsService.getTopProducts(5).subscribe(data => {
      this.topProducts = data;
      this.updateTopProductsChart();
      this.updateCategoryChart();
    });
  }

  updateSalesFrequencyChart() {
    const labels = this.salesFrequencyList.map(item => this.formatDate(item.date));
    const salesData = this.salesFrequencyList.map(item => item.count);
    const revenueData = this.salesFrequencyList.map(item => item.totalAmount);

    this.salesFrequencyData = {
      labels,
      datasets: [
        {
          label: 'Number of Sales',
          data: salesData,
          borderColor: '#1976d2',
          backgroundColor: 'rgba(25, 118, 210, 0.1)',
          tension: 0.4,
          yAxisID: 'y',
        },
        {
          label: 'Revenue (₹)',
          data: revenueData,
          borderColor: '#388e3c',
          backgroundColor: 'rgba(56, 142, 60, 0.1)',
          tension: 0.4,
          yAxisID: 'y1',
        },
      ],
    };

    this.salesFrequencyOptions.scales = {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Sales',
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        beginAtZero: true,
        title: {
          display: true,
          text: 'Revenue (₹)',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    };
  }

  updateTopProductsChart() {
    const labels = this.topProducts.map(p => p.productName.length > 20 ? 
                                           p.productName.substring(0, 20) + '...' : 
                                           p.productName);
    const data = this.topProducts.map(p => p.revenue);

    this.topProductsData = {
      labels,
      datasets: [
        {
          label: 'Revenue (₹)',
          data,
          backgroundColor: [
            '#1976d2',
            '#388e3c',
            '#f57c00',
            '#7b1fa2',
            '#c62828',
          ],
        },
      ],
    };
  }

  updateCategoryChart() {
    const categoryMap = new Map<string, number>();
    
    this.topProducts.forEach(product => {
      const current = categoryMap.get(product.category) || 0;
      categoryMap.set(product.category, current + product.revenue);
    });

    const labels = Array.from(categoryMap.keys());
    const data = Array.from(categoryMap.values());

    this.categoryData = {
      labels,
      datasets: [
        {
          data,
          backgroundColor: [
            '#1976d2',
            '#388e3c',
            '#f57c00',
            '#7b1fa2',
            '#c62828',
            '#00796b',
            '#455a64',
          ],
        },
      ],
    };
  }

  updateRevenueTrendChart() {
    if (!this.revenueAnalytics) return;

    // Sample data for demonstration
    const labels = ['Today', 'This Week', 'This Month'];
    const revenue = [
      this.revenueAnalytics.todayRevenue,
      this.revenueAnalytics.weekRevenue / 7,
      this.revenueAnalytics.monthRevenue / 30,
    ];
    const profit = [
      this.revenueAnalytics.todayProfit,
      this.revenueAnalytics.weekProfit / 7,
      this.revenueAnalytics.monthProfit / 30,
    ];

    this.revenueTrendData = {
      labels,
      datasets: [
        {
          label: 'Average Revenue',
          data: revenue,
          borderColor: '#1976d2',
          backgroundColor: 'rgba(25, 118, 210, 0.1)',
          tension: 0.4,
        },
        {
          label: 'Average Profit',
          data: profit,
          borderColor: '#388e3c',
          backgroundColor: 'rgba(56, 142, 60, 0.1)',
          tension: 0.4,
        },
      ],
    };
  }

  calculateProfitMargin(): string {
    if (!this.revenueAnalytics || this.revenueAnalytics.monthRevenue === 0) {
      return '0.0';
    }
    const margin = (this.revenueAnalytics.monthProfit / this.revenueAnalytics.monthRevenue) * 100;
    return margin.toFixed(1);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  }

  getStockStatus(daysUntilStockout: number): string {
    if (!daysUntilStockout) return 'No Sales Data';
    if (daysUntilStockout <= 3) return 'Order Now!';
    if (daysUntilStockout <= 7) return 'Order Soon';
    return 'Good Stock';
  }

  // Pagination methods
  updatePagination(): void {
    this.totalPages = Math.ceil(this.productTrends.length / this.itemsPerPage);
    this.goToPage(1);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    
    this.currentPage = page;
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProductTrends = this.productTrends.slice(startIndex, endIndex);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  nextPage(): void {
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
}
