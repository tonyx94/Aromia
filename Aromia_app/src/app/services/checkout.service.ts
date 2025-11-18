import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderSummary } from '../models/order-summary.model';
import { PaymentMethod } from '../models/payment-method.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  private apiUrl = environment.baseUrl; // Usando baseUrl como corregimos
  constructor(private http: HttpClient) { }
  getOrderSummary(): Observable<OrderSummary> { return this.http.get<OrderSummary>(`${this.apiUrl}/orders/summary`); }
  getPaymentMethods(): Observable<PaymentMethod[]> { return this.http.get<PaymentMethod[]>(`${this.apiUrl}/payment-methods`); }
}