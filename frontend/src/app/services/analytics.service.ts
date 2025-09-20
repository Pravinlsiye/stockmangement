import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SalesFrequency {
  date: string;
  count: number;
  totalAmount: number;
}

export interface ProductSalesTrend {
  productId: string;
  productName: string;
  currentStock: number;
  totalSold: number;
  averageDailySales: number;
  daysUntilStockout: number;
  suggestedOrderDate: string;
  suggestedOrderQuantity: number;
}

export interface TopProduct {
  productId: string;
  productName: string;
  quantitySold: number;
  revenue: number;
  category: string;
}

export interface RevenueAnalytics {
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
  todayProfit: number;
  weekProfit: number;
  monthProfit: number;
  todayTransactions: number;
  weekTransactions: number;
  monthTransactions: number;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = 'http://localhost:8080/api/analytics';

  constructor(private http: HttpClient) { }

  getSalesFrequency(days: number = 30): Observable<SalesFrequency[]> {
    return this.http.get<SalesFrequency[]>(`${this.apiUrl}/sales-frequency?days=${days}`);
  }

  getProductSalesTrends(): Observable<ProductSalesTrend[]> {
    return this.http.get<ProductSalesTrend[]>(`${this.apiUrl}/product-trends`);
  }

  getTopProducts(limit: number = 10): Observable<TopProduct[]> {
    return this.http.get<TopProduct[]>(`${this.apiUrl}/top-products?limit=${limit}`);
  }

  getRevenueAnalytics(): Observable<RevenueAnalytics> {
    return this.http.get<RevenueAnalytics>(`${this.apiUrl}/revenue`);
  }
}
