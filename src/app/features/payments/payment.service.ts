// src/app/features/payments/payment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment } from '../../core/models/payment';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) { }

  getAllPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(this.apiUrl);
  }

  getPaymentById(id: string): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/${id}`);
  }

  createPayment(payment: Payment): Observable<Payment> {
    return this.http.post<Payment>(this.apiUrl, payment);
  }

  updatePayment(id: string, payment: Payment): Observable<Payment> {
    return this.http.put<Payment>(`${this.apiUrl}/${id}`, payment);
  }

  softDeletePayment(id: string): Observable<Payment> {
    return this.http.patch<Payment>(`${this.apiUrl}/${id}/soft-delete`, {});
  }

  restorePayment(id: string): Observable<Payment> {
    return this.http.patch<Payment>(`${this.apiUrl}/${id}/restore`, {});
  }
}