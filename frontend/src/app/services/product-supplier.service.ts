import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductSupplier, ProductSupplierDetails } from '../models/product-supplier.model';

@Injectable({
  providedIn: 'root'
})
export class ProductSupplierService {
  private apiUrl = 'http://localhost:8080/api/product-suppliers';

  constructor(private http: HttpClient) { }

  getAllProductSuppliers(): Observable<ProductSupplier[]> {
    return this.http.get<ProductSupplier[]>(this.apiUrl);
  }

  getProductSupplierById(id: string): Observable<ProductSupplier> {
    return this.http.get<ProductSupplier>(`${this.apiUrl}/${id}`);
  }

  getSuppliersByProductId(productId: string): Observable<ProductSupplier[]> {
    return this.http.get<ProductSupplier[]>(`${this.apiUrl}/by-product/${productId}`);
  }

  getSupplierDetailsForProduct(productId: string): Observable<ProductSupplierDetails[]> {
    return this.http.get<ProductSupplierDetails[]>(`${this.apiUrl}/by-product/${productId}/details`);
  }

  getProductsBySupplierId(supplierId: string): Observable<ProductSupplier[]> {
    return this.http.get<ProductSupplier[]>(`${this.apiUrl}/by-supplier/${supplierId}`);
  }

  createProductSupplier(productSupplier: ProductSupplier): Observable<ProductSupplier> {
    return this.http.post<ProductSupplier>(this.apiUrl, productSupplier);
  }

  updateProductSupplier(id: string, productSupplier: ProductSupplier): Observable<ProductSupplier> {
    return this.http.put<ProductSupplier>(`${this.apiUrl}/${id}`, productSupplier);
  }

  deleteProductSupplier(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
