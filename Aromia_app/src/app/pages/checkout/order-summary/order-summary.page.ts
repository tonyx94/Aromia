import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { OrderSummary } from 'src/app/models/order-summary.model';
import { CheckoutService } from 'src/app/services/checkout.service';
import { CheckoutStateService } from 'src/app/services/checkout-state.service';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.page.html',
  styleUrls: ['./order-summary.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class OrderSummaryPage implements OnInit {
  summary$!: Observable<OrderSummary>;
  error: string | null = null;
  constructor(
    private checkoutService: CheckoutService,
    private checkoutState: CheckoutStateService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.summary$ = this.checkoutService.getOrderSummary().pipe(
      tap(summary => this.checkoutState.setOrderSummary(summary)),
      catchError(() => {
        this.error = 'No pudimos cargar el resumen.';
        return EMPTY;
      })
    );
  }
  proceedToPayment(): void { this.router.navigate(['/checkout/payment-selection']); }
}