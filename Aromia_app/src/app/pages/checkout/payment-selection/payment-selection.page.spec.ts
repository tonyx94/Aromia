import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { Observable, Subscription, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { PaymentMethod } from 'src/app/models/payment-method.model';
import { CheckoutService } from 'src/app/services/checkout.service';
import { CheckoutStateService } from 'src/app/services/checkout-state.service';

@Component({
  selector: 'app-payment-selection',
  templateUrl: './payment-selection.page.html',
  styleUrls: ['./payment-selection.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, RouterModule]
})
export class PaymentSelectionPage implements OnInit, OnDestroy {
  paymentMethods$!: Observable<PaymentMethod[]>;
  paymentForm: FormGroup;
  private formSubscription!: Subscription;

  constructor(
    private checkoutService: CheckoutService,
    private checkoutState: CheckoutStateService,
    private fb: FormBuilder,
    private router: Router
  ) { this.paymentForm = this.fb.group({ method: [null, Validators.required] }); }

  ngOnInit(): void {
    let allMethods: PaymentMethod[] = [];
    this.paymentMethods$ = this.checkoutService.getPaymentMethods().pipe(
      tap(methods => allMethods = methods),
      catchError(() => of([]))
    );
    this.formSubscription = this.paymentForm.get('method')!.valueChanges.subscribe(selectedId => {
      const selectedMethod = allMethods.find(m => m.id === selectedId) || null;
      this.checkoutState.setPaymentMethod(selectedMethod);
    });
  }
  
  proceedToConfirmation(): void { if (this.paymentForm.valid) { this.router.navigate(['/checkout/confirmation']); } }
  
  ngOnDestroy(): void { this.formSubscription?.unsubscribe(); }
}