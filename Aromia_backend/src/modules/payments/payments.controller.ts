import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
// RUTA FINAL Y CORRECTA:
import { JwtAuthGuard } from '../../guard/jwt-auth.guard';
import { PaymentsService, PaymentMethod } from './payments.service';

@ApiTags('Payments')
@ApiBearerAuth()
@Controller('payment-methods')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}
  
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'Returns available payment methods.' })
  getPaymentMethods(): PaymentMethod[] {
    return this.paymentsService.getAvailablePaymentMethods();
  }
}