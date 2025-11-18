import { Injectable } from '@nestjs/common';
export interface PaymentMethod { id: string; name: string; description: string; }

@Injectable()
export class PaymentsService {
  private availableMethods: PaymentMethod[] = [
    { id: 'credit-card', name: 'Tarjeta de Crédito', description: 'Visa, MasterCard, Amex' },
    { id: 'paypal', name: 'PayPal', description: 'Pago rápido y seguro' },
  ];
  getAvailablePaymentMethods(): PaymentMethod[] { return this.availableMethods; }
}