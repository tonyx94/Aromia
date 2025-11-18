import { Controller, Get, Req, UseGuards, Param, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../../guard/jwt-auth.guard';
import { OrdersService } from './orders.service';
// Ya no necesitamos CustomersService aquí
import { OrderSummaryDto } from './dto/order-summary.dto';
import { ApiTags, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { Order } from './entities/order.entity';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  // SOLO INYECTAMOS ORDERSERVICE
  constructor(private readonly ordersService: OrdersService) {}

  // --- ENDPOINT PARA AR-53 (SIMPLIFICADO) ---
  @Get('summary')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: OrderSummaryDto })
  async getOrderSummary(@Req() req): Promise<OrderSummaryDto> {
    // Obtenemos el customerId directamente del token
    const customerId = req.user.customerId;
    return this.ordersService.getOrderSummary(customerId);
  }

  // --- ENDPOINTS PARA AR-52 (SIMPLIFICADOS) ---
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Req() req): Promise<Order[]> {
    const customerId = req.user.customerId;
    return this.ordersService.findAllByCustomer(customerId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req): Promise<Order> {
    const customerId = req.user.customerId;
    return this.ordersService.findOneById(id, customerId); // Asumiendo que ahora se llama findOneById
  }
}