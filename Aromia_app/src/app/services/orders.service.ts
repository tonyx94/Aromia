import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AromiaApi } from './request';
import { Order } from '../models/order';

export interface OrderItemSummary {
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface OrderSummary {
  items: OrderItemSummary[];
  subtotal: number;
  shippingCost: number;
  taxes: number;
  total: number;
}

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private baseEndpoint = 'orders/my';

  constructor(private api: AromiaApi) { }

  getMyOrders(customerId?: number): Observable<Order[]> {
    let url = this.baseEndpoint;
    if (customerId) {
      url += `?customerId=${customerId}`;
    }
    return this.api.get<Order[]>(url);
  }

  getOrderDetail(id: number): Observable<Order> {
    return this.api.get<Order>(`${this.baseEndpoint}/${id}`);
  }

  createOrder(orderData: any): Observable<Order> {
    return this.api.post<Order>('orders', orderData);
  }

  getOrderSummary(): Observable<OrderSummary> {
    return this.api.get<OrderSummary>('orders/summary');
  }
}