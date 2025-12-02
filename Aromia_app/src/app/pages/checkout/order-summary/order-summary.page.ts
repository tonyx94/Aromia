import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { OrderSummary } from 'src/app/models/order-summary.model';
import { CheckoutService } from 'src/app/services/checkout.service';
import { CheckoutStateService } from 'src/app/services/checkout-state.service';
import { Product } from 'src/app/models/products';
import { StorageKey, StorageService } from 'src/app/services/storage.service';

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

  cart: Product[] = [];
  discountAmount: number = 0;

  constructor(
    private checkoutService: CheckoutService,
    private checkoutState: CheckoutStateService,
    private router: Router,
    private local: StorageService,
  ) { }
  ngOnInit(): void {
    this.summary$ = this.checkoutService.getOrderSummary().pipe(
      tap(summary => this.checkoutState.setOrderSummary(summary)),
      catchError(() => {
        this.error = 'No pudimos cargar el resumen.';
        return EMPTY;
      })
    );
  }

  ngAfterViewInit(): void {
    this.local.get<Product[]>(StorageKey.Cart).then((c) => {
      if (c) {
        this.cart = c
        console.log("Products in Cart: ", c)
      }
    })
  }


  getSubtotal(): number {
    return this.cart.reduce((sum, p) => {
      const price = p.price;
      return sum + price * p.cant;
    }, 0);
  }

  getTaxes(): number {
    const subtotal = this.getSubtotal();
    return subtotal * 0.13; // 13% de IVA
  }

  getDiscount(): number {
    return this.discountAmount;
  }

  getTotal(): number {
    const subtotal = this.getSubtotal();
    const taxes = this.getTaxes();
    const discount = this.getDiscount();
    return subtotal + taxes - discount;
  }


  proceedToPayment(): void { this.router.navigate(['/checkout/payment-selection']); }
}