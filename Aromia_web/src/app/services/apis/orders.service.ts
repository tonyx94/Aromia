import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiAromia } from '../api.service';
import { Order, OrderStatus } from '../../interfaces/order.interface';

@Injectable({
    providedIn: 'root'
})
export class OrdersService {
    private api = inject(ApiAromia);

    getAllOrdersGeneral(): Observable<Order[]> {
        return this.api.get<Order[]>('orders');
    }

    getAllOrders(customerId: number): Observable<Order[]> {
        return this.api.get<Order[]>(`orders/my?customerId=${customerId}`);
    }

    getOrderById(orderId: number): Observable<Order> {
        return this.api.get<Order>(`orders/my/${orderId}`);
    }

    getAllStatuses(): Observable<OrderStatus[]> {
        return this.api.get<OrderStatus[]>('order-statuses');
    }

    updateOrderStatus(orderId: number, statusId: number): Observable<Order> {
        return this.api.patch<Order>(`orders/${orderId}/status`, { status_id: statusId });
    }
}
