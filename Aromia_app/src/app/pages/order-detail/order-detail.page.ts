import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from '../../services/orders.service';
import { Order } from '../../models/order';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './order-detail.page.html',
  styleUrls: ['./order-detail.page.scss'],
})
export class OrderDetailPage implements OnInit {
  order: Order | null = null;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private ordersService: OrdersService,
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? +idParam : NaN;
    if (!isNaN(id)) {
      this.loadOrder(id);
    }
  }

  loadOrder(id: number) {
    this.loading = true;
    this.ordersService.getOrderDetail(id).subscribe({
      next: (order) => {
        this.order = order;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}