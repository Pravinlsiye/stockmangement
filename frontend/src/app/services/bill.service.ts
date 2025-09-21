import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bill } from '../models/bill.model';

@Injectable({
  providedIn: 'root'
})
export class BillService {
  private apiUrl = 'http://localhost:8080/api/bills';

  constructor(private http: HttpClient) { }

  getAllBills(): Observable<Bill[]> {
    return this.http.get<Bill[]>(this.apiUrl);
  }

  getBillDetails(billId: string): Observable<Bill> {
    return this.http.get<Bill>(`${this.apiUrl}/${billId}`);
  }

  generateBillId(): Observable<string> {
    return this.http.get(`${this.apiUrl}/generate-id`, { responseType: 'text' });
  }
}
