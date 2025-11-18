import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { OrdersService } from '../../services/orders.service';
import { Order } from '../../models/order';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-orders-history',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
  templateUrl: './orders-history.page.html',
  styleUrls: ['./orders-history.page.scss'],
})
export class OrdersHistoryPage implements OnInit {
  orders: Order[] = [];
  loading = false;

  constructor(private ordersService: OrdersService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.ordersService.getMyOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}