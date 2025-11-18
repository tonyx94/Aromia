import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { OrderSummary } from '../models/order-summary.model';
import { PaymentMethod } from '../models/payment-method.model';

@Injectable({ providedIn: 'root' })
export class CheckoutStateService {
  private summarySource = new BehaviorSubject<OrderSummary | null>(null);
  summary$ = this.summarySource.asObservable();
  private paymentMethodSource = new BehaviorSubject<PaymentMethod | null>(null);
  selectedPaymentMethod$ = this.paymentMethodSource.asObservable();
  setOrderSummary(summary: OrderSummary) { this.summarySource.next(summary); }
  setPaymentMethod(method: PaymentMethod | null) { this.paymentMethodSource.next(method); }
}