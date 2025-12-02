import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrdersService } from '../../../../services/apis/orders.service';
import { StorageService } from '../../../../services/storage.service';
import { Order, OrderStatus } from '../../../../interfaces/order.interface';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {
  private ordersService = inject(OrdersService);
  private storageService = inject(StorageService);

  private ordersSubject = new BehaviorSubject<Order[]>([]);
  orders$ = this.ordersSubject.asObservable();

  private searchTermSubject = new BehaviorSubject<string>('');
  private statusFilterSubject = new BehaviorSubject<string>('all');
  private dateStartSubject = new BehaviorSubject<Date | null>(null);
  private dateEndSubject = new BehaviorSubject<Date | null>(null);

  filteredOrders$: Observable<Order[]>;

  selectedOrder: Order | null = null;

  loading = true;
  error: string | null = null;

  searchTerm = '';
  statusFilter = 'all';
  dateStart: string = '';
  dateEnd: string = '';

  availableStatuses: string[] = [];
  allStatuses: OrderStatus[] = [];

  constructor() {
    this.filteredOrders$ = combineLatest([
      this.orders$,
      this.searchTermSubject,
      this.statusFilterSubject,
      this.dateStartSubject,
      this.dateEndSubject
    ]).pipe(
      map(([orders, searchTerm, statusFilter, dateStart, dateEnd]) => {
        return this.filterOrders(orders, searchTerm, statusFilter, dateStart, dateEnd);
      })
    );
  }

  ngOnInit() {
    this.loadOrders();
    this.loadAllStatuses();
  }

  async loadOrders() {
    try {
      this.loading = true;
      this.error = null;

      this.ordersService.getAllOrdersGeneral().pipe(
        catchError(err => {
          console.error('Error loading orders:', err);
          this.error = 'Error al cargar las órdenes';
          return of([]);
        })
      ).subscribe(orders => {
        this.ordersSubject.next(orders);
        this.extractAvailableStatuses(orders);
        this.loading = false;
      });
    } catch (err) {
      console.error('Error in loadOrders:', err);
      this.error = 'Error al cargar las órdenes';
      this.loading = false;
    }
  }

  private extractAvailableStatuses(orders: Order[]) {
    const statuses = new Set<string>();
    orders.forEach(order => {
      if (order.status?.name) {
        statuses.add(order.status.name);
      }
    });
    this.availableStatuses = Array.from(statuses).sort();
  }

  private filterOrders(
    orders: Order[],
    searchTerm: string,
    statusFilter: string,
    dateStart: Date | null,
    dateEnd: Date | null
  ): Order[] {
    return orders.filter(order => {
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const matchesOrderNumber = order.order_number.toLowerCase().includes(search);
        const matchesCustomerName =
          `${order.customer.firstName} ${order.customer.lastName}`.toLowerCase().includes(search);

        if (!matchesOrderNumber && !matchesCustomerName) {
          return false;
        }
      }

      if (statusFilter !== 'all' && order.status?.name !== statusFilter) {
        return false;
      }

      if (dateStart) {
        const orderDate = new Date(order.created_at);
        if (orderDate < dateStart) {
          return false;
        }
      }

      if (dateEnd) {
        const orderDate = new Date(order.created_at);
        const endOfDay = new Date(dateEnd);
        endOfDay.setHours(23, 59, 59, 999);
        if (orderDate > endOfDay) {
          return false;
        }
      }

      return true;
    });
  }

  selectOrder(order: Order) {
    this.selectedOrder = order;
  }

  onSearchChange(value: string) {
    this.searchTerm = value;
    this.searchTermSubject.next(value);
  }

  onStatusFilterChange(value: string) {
    this.statusFilter = value;
    this.statusFilterSubject.next(value);
  }

  onDateStartChange(value: string) {
    this.dateStart = value;
    this.dateStartSubject.next(value ? new Date(value) : null);
  }

  onDateEndChange(value: string) {
    this.dateEnd = value;
    this.dateEndSubject.next(value ? new Date(value) : null);
  }

  clearFilters() {
    this.searchTerm = '';
    this.statusFilter = 'all';
    this.dateStart = '';
    this.dateEnd = '';
    this.searchTermSubject.next('');
    this.statusFilterSubject.next('all');
    this.dateStartSubject.next(null);
    this.dateEndSubject.next(null);
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatCurrency(amount: number): string {
    return `₡${amount.toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  loadAllStatuses() {
    this.ordersService.getAllStatuses().subscribe({
      next: (statuses) => {
        this.allStatuses = statuses.sort((a, b) => a.order_sequence - b.order_sequence);
      },
      error: (err) => {
        console.error('Error loading statuses:', err);
      }
    });
  }

  changeOrderStatus(statusId: number) {

    if (!this.selectedOrder || this.selectedOrder.status_id === statusId) {
      console.log('Returning early - no order selected or same status');
      return;
    }

    const orderId = this.selectedOrder.id;
    const previousStatus = this.selectedOrder.status;
    console.log('orderId:', orderId);
    console.log('previousStatus:', previousStatus);

    const newStatus = this.allStatuses.find(s => s.id === statusId);
    console.log('newStatus found:', newStatus);

    if (newStatus) {
      this.selectedOrder.status = newStatus;
      this.selectedOrder.status_id = statusId;

      const currentOrders = this.ordersSubject.value;
      const updatedOrders = currentOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus, status_id: statusId } : order
      );
      this.ordersSubject.next(updatedOrders);
      console.log('Optimistic update applied');
    }

    console.log('Making API call to update status...');
    this.ordersService.updateOrderStatus(orderId, statusId).subscribe({
      next: (updatedOrder) => {
        console.log('✅ Order status updated successfully:', updatedOrder);
        this.selectedOrder = updatedOrder;
        const currentOrders = this.ordersSubject.value;
        const updatedOrders = currentOrders.map(order =>
          order.id === orderId ? updatedOrder : order
        );
        this.ordersSubject.next(updatedOrders);
      },
      error: (err) => {
        console.error('❌ Error updating order status:', err);

        if (this.selectedOrder) {
          this.selectedOrder.status = previousStatus;
          this.selectedOrder.status_id = previousStatus.id;
        }
        const currentOrders = this.ordersSubject.value;
        const revertedOrders = currentOrders.map(order =>
          order.id === orderId ? { ...order, status: previousStatus, status_id: previousStatus.id } : order
        );
        this.ordersSubject.next(revertedOrders);
        console.log('Reverted to previous status due to error');
      }
    });
  }
}
