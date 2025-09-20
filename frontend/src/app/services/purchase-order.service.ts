import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PurchaseOrder, PaymentUpdate } from '../models/purchase-order.model';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {
  private apiUrl = 'http://localhost:8080/api/purchase-orders';

  constructor(private http: HttpClient) { }

  getAllPurchaseOrders(): Observable<PurchaseOrder[]> {
    return this.http.get<PurchaseOrder[]>(this.apiUrl);
  }

  getPurchaseOrderById(id: string): Observable<PurchaseOrder> {
    return this.http.get<PurchaseOrder>(`${this.apiUrl}/${id}`);
  }

  getPurchaseOrdersByStatus(status: string): Observable<PurchaseOrder[]> {
    return this.http.get<PurchaseOrder[]>(`${this.apiUrl}/status/${status}`);
  }

  getPurchaseOrdersBySupplierId(supplierId: string): Observable<PurchaseOrder[]> {
    return this.http.get<PurchaseOrder[]>(`${this.apiUrl}/supplier/${supplierId}`);
  }

  getPurchaseOrdersByProductId(productId: string): Observable<PurchaseOrder[]> {
    return this.http.get<PurchaseOrder[]>(`${this.apiUrl}/product/${productId}`);
  }

  getUpcomingDeliveries(): Observable<PurchaseOrder[]> {
    return this.http.get<PurchaseOrder[]>(`${this.apiUrl}/upcoming-deliveries`);
  }

  getPendingPayments(): Observable<PurchaseOrder[]> {
    return this.http.get<PurchaseOrder[]>(`${this.apiUrl}/pending-payments`);
  }

  createPurchaseOrder(order: PurchaseOrder): Observable<PurchaseOrder> {
    return this.http.post<PurchaseOrder>(this.apiUrl, order);
  }

  updatePurchaseOrder(id: string, order: PurchaseOrder): Observable<PurchaseOrder> {
    return this.http.put<PurchaseOrder>(`${this.apiUrl}/${id}`, order);
  }

  updatePaymentStatus(id: string, paymentData: PaymentUpdate): Observable<PurchaseOrder> {
    return this.http.put<PurchaseOrder>(`${this.apiUrl}/${id}/payment`, paymentData);
  }

  deletePurchaseOrder(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
