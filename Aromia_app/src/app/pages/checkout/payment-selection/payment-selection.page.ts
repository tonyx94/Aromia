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
  paymentMethods: { id: number, name: string, description: string, selected: boolean }[] = [];
  paymentForm: FormGroup;
  private formSubscription!: Subscription;

  constructor(
    private checkoutService: CheckoutService,
    private checkoutState: CheckoutStateService,
    private fb: FormBuilder,
    private router: Router
  ) { this.paymentForm = this.fb.group({ method: [null, Validators.required] }); }

  ngOnInit(): void {
    this.paymentMethods = [
      { id: 0, name: "Efectivo", description: 'Dinero en formato físico para uso inmediato.', selected: true },
      { id: 1, name: "Sinpe movil", description: 'Es un servicio para realizar transferencias. ', selected: true },
    ]
  }

  proceedToConfirmation(): void { if (this.paymentForm.valid) { this.router.navigate(['/checkout/confirmation']); } }

  ngOnDestroy(): void { this.formSubscription?.unsubscribe(); }
}