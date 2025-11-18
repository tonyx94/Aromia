import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AromiaApi } from './request';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private baseEndpoint = 'orders/my';

  constructor(private api: AromiaApi) {}

  getMyOrders(): Observable<Order[]> {
    return this.api.get<Order[]>(this.baseEndpoint);
  }

  getOrderDetail(id: number): Observable<Order> {
    return this.api.get<Order>(`${this.baseEndpoint}/${id}`);
  }
}