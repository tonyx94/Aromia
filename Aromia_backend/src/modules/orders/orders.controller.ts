import { Controller, Get, Post, Body, Req, UseGuards, Param, ParseIntPipe, Query, Patch } from '@nestjs/common';
import { JwtAuthGuard } from '../../guard/jwt-auth.guard';
import { OrdersService } from './orders.service';
import { ProductsService } from '../products/products.service';
import { CustomersService } from '../customers/customers.service';
// Ya no necesitamos CustomersService aquí
import { OrderSummaryDto } from './dto/order-summary.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiTags, ApiBearerAuth, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { Order } from './entities/order.entity';



@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  // INJECT SERVICES FOR STATISTICS
  constructor(
    private readonly ordersService: OrdersService,
    private readonly productsService: ProductsService,
    private readonly customersService: CustomersService,
  ) { }

  // --- ENDPOINT PARA AR-53 (SIMPLIFICADO) ---
  @Get('summary')
  // @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: OrderSummaryDto })
  async getOrderSummary(@Req() req): Promise<OrderSummaryDto> {
    const customerId = req.user?.customerId ?? 3;
    return this.ordersService.getOrderSummary(customerId);
  }

  @Get()
  @ApiOkResponse({ type: [Order] })
  async findAllOrders(): Promise<Order[]> {
    console.log('Fetching all orders (general list)');
    return this.ordersService.findAll();
  }

  @Post()
  @ApiOkResponse({ type: Order })
  async createOrder(@Req() req, @Body() createOrderDto: CreateOrderDto): Promise<Order> {
    const customerId = req.user?.customerId ?? createOrderDto.customer_id ?? 3;
    return this.ordersService.create({ ...createOrderDto, customer_id: customerId }, customerId);
  }

  @Get('my')
  async findAll(@Req() req, @Query('customerId') queryCustomerId?: number): Promise<Order[]> {
    const customerId = queryCustomerId ?? req.user?.customerId ?? 1;
    console.log('Fetching orders for customerId:', customerId);
    return this.ordersService.findAllByCustomer(customerId);
  }

  @Get('my/:id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req): Promise<Order> {
    const customerId = req.user?.customerId ?? 1;
    console.log(`Fetching order ${id} for customerId:`, customerId);
    return this.ordersService.findOneById(id, customerId);
  }

  @Patch(':id/status')
  @ApiOkResponse({ type: Order })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { status_id: number }
  ): Promise<Order> {
    console.log(`Updating order ${id} status to ${body.status_id}`);
    return this.ordersService.updateStatus(id, body.status_id);
  }

  // ===== DASHBOARD STATISTICS ENDPOINTS =====

  @Get('stats/sales-over-time')
  @ApiQuery({ name: 'startDate', required: true, type: String })
  @ApiQuery({ name: 'endDate', required: true, type: String })
  async getSalesOverTime(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<any> {
    return this.ordersService.getSalesOverTime(startDate, endDate);
  }

  @Get('stats/by-status')
  @ApiQuery({ name: 'startDate', required: true, type: String })
  @ApiQuery({ name: 'endDate', required: true, type: String })
  async getOrdersByStatus(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<any> {
    return this.ordersService.getOrdersByStatus(startDate, endDate);
  }

  @Get('stats/revenue-metrics')
  @ApiQuery({ name: 'startDate', required: true, type: String })
  @ApiQuery({ name: 'endDate', required: true, type: String })
  async getRevenueMetrics(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<any> {
    return this.ordersService.getRevenueMetrics(startDate, endDate);
  }

  @Get('stats/monthly-comparison')
  @ApiQuery({ name: 'startDate', required: true, type: String })
  @ApiQuery({ name: 'endDate', required: true, type: String })
  async getMonthlyComparison(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<any> {
    return this.ordersService.getMonthlyComparison(startDate, endDate);
  }

  @Get('stats/top-products')
  @ApiQuery({ name: 'startDate', required: true, type: String })
  @ApiQuery({ name: 'endDate', required: true, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getTopProducts(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('limit') limit?: number,
  ): Promise<any> {
    return this.productsService.getTopProducts(startDate, endDate, limit || 10);
  }

  @Get('stats/customer-growth')
  @ApiQuery({ name: 'startDate', required: true, type: String })
  @ApiQuery({ name: 'endDate', required: true, type: String })
  async getCustomerGrowth(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<any> {
    return this.customersService.getCustomerGrowth(startDate, endDate);
  }
}