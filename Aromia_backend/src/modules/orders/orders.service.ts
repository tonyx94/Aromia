import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { ShoppingCartService } from '../shopping-cart/shopping-cart.service';
import { OrderSummaryDto } from './dto/order-summary.dto';
import { OrderItemSummaryDto } from './dto/order-item-summary.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @Inject(forwardRef(() => ShoppingCartService))
    private readonly shoppingCartService: ShoppingCartService,
  ) { }

  async getOrderSummary(customerId: number): Promise<OrderSummaryDto> {
    const cartItems = await this.shoppingCartService.findAllByCustomerId(customerId);

    if (!cartItems || cartItems.length === 0) {
      return { items: [], subtotal: 0, shippingCost: 0, taxes: 0, total: 0 };
    }

    const itemsSummary: OrderItemSummaryDto[] = cartItems.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      productImage: item.product.image_url,
      quantity: item.quantity,
      unitPrice: item.product.price,
      total: parseFloat((item.quantity * item.product.price).toFixed(2)),
    }));

    const subtotal = itemsSummary.reduce((acc, item) => acc + item.total, 0);
    const shippingCost = 5.00;
    const taxRate = 0.19;
    const taxes = subtotal * taxRate;
    const total = subtotal + shippingCost + taxes;

    return {
      items: itemsSummary,
      subtotal: parseFloat(subtotal.toFixed(2)),
      shippingCost,
      taxes: parseFloat(taxes.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
    };
  }

  async create(dto: CreateOrderDto, customerId: number): Promise<Order> {
    if (dto.address_id) {
      const address = await this.orderRepository.manager.findOne('customer_addresses', {
        where: { id: dto.address_id, customer: { id: customerId } }
      });

      if (!address) {
        throw new NotFoundException(
          `Address with ID ${dto.address_id} not found or does not belong to customer ${customerId}`
        );
      }
    }

    const { items, ...orderData } = dto;
    const order = this.orderRepository.create(orderData);
    const savedOrder = await this.orderRepository.save(order);

    if (items && items.length > 0) {
      const orderItems = items.map(item => ({
        order: savedOrder,
        product: { id: item.product_id },
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total
      }));

      await this.orderRepository.manager
        .getRepository('order_items')
        .save(orderItems);
    }

    const completeOrder = await this.orderRepository.findOne({
      where: { id: savedOrder.id },
      relations: ['items', 'items.product', 'address', 'status', 'customer']
    });

    if (!completeOrder) {
      throw new NotFoundException(`Order with ID ${savedOrder.id} not found after creation`);
    }

    await this.shoppingCartService.clearByCustomerId(customerId);

    return completeOrder;
  }

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find({
      relations: ['items', 'items.product', 'address', 'status', 'customer'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }
    return order;
  }

  async update(id: number, dto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    Object.assign(order, dto);
    return await this.orderRepository.save(order);
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);
    await this.orderRepository.remove(order);
  }

  async findAllByCustomer(customerId: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: { customer_id: customerId },
      relations: ['items', 'items.product', 'address', 'status', 'customer'],
      order: { created_at: 'DESC' },
    });
  }

  async findOneById(orderId: number, customerId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, customer_id: customerId },
      relations: ['items', 'items.product', 'address', 'status'],
    });

    if (!order) {
      throw new NotFoundException(
        `Orden con ID ${orderId} no encontrada para este cliente`,
      );
    }
    return order;
  }

  async updateStatus(orderId: number, statusId: number): Promise<Order> {
    console.log(`=== updateStatus called ===`);
    console.log(`orderId: ${orderId}, statusId: ${statusId}`);

    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException(`Orden con ID ${orderId} no encontrada`);
    }

    console.log(`Current order status_id: ${order.status_id}`);

    // Verify that the status exists
    const status = await this.orderRepository.manager.findOne('order_statuses', {
      where: { id: statusId }
    });

    if (!status) {
      throw new NotFoundException(`Estado con ID ${statusId} no encontrado`);
    }

    console.log(`New status found:`, status);

    // Update the status using update method to ensure it's persisted
    await this.orderRepository.update(
      { id: orderId },
      { status_id: statusId }
    );

    console.log(`Status updated in database`);

    // Return the complete order with all relations
    const updatedOrder = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['items', 'items.product', 'address', 'status', 'customer'],
    });

    console.log(`Updated order status_id: ${updatedOrder?.status_id}`);
    console.log(`Updated order status:`, updatedOrder?.status);

    return updatedOrder!;
  }

  // ===== DASHBOARD STATISTICS METHODS =====

  async getSalesOverTime(startDate: string, endDate: string): Promise<any> {
    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .select('DATE(order.created_at)', 'date')
      .addSelect('SUM(order.total_amount)', 'total')
      .addSelect('COUNT(order.id)', 'orderCount')
      .where('order.created_at BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy('DATE(order.created_at)')
      .orderBy('date', 'ASC')
      .getRawMany();

    return {
      data: orders.map(item => ({
        date: item.date,
        total: parseFloat(item.total) || 0,
        orderCount: parseInt(item.orderCount) || 0,
      })),
    };
  }

  async getOrdersByStatus(startDate: string, endDate: string): Promise<any> {
    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.status', 'status')
      .select('status.name', 'statusName')
      .addSelect('COUNT(order.id)', 'count')
      .where('order.created_at BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy('status.id')
      .getRawMany();

    const total = orders.reduce((sum, item) => sum + parseInt(item.count), 0);

    const statusColors: Record<string, string> = {
      'Pendiente': '#FFA726',
      'Procesando': '#42A5F5',
      'Enviado': '#66BB6A',
      'Entregado': '#26A69A',
      'Cancelado': '#EF5350',
    };

    return {
      data: orders.map(item => ({
        statusName: item.statusName,
        count: parseInt(item.count),
        percentage: total > 0 ? parseFloat(((parseInt(item.count) / total) * 100).toFixed(2)) : 0,
        color: statusColors[item.statusName] || '#9E9E9E',
      })),
      total,
    };
  }

  async getRevenueMetrics(startDate: string, endDate: string): Promise<any> {
    const result = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.total_amount)', 'totalRevenue')
      .addSelect('COUNT(order.id)', 'totalOrders')
      .addSelect('AVG(order.total_amount)', 'averageOrderValue')
      .addSelect('COUNT(DISTINCT order.customer_id)', 'totalCustomers')
      .where('order.created_at BETWEEN :startDate AND :endDate', { startDate, endDate })
      .getRawOne();

    // Calculate previous period for growth comparison
    const start = new Date(startDate);
    const end = new Date(endDate);
    const periodDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const previousStart = new Date(start.getTime() - periodDays * 24 * 60 * 60 * 1000);
    const previousEnd = start;

    const previousResult = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.total_amount)', 'totalRevenue')
      .where('order.created_at BETWEEN :previousStart AND :previousEnd', {
        previousStart: previousStart.toISOString(),
        previousEnd: previousEnd.toISOString(),
      })
      .getRawOne();

    const currentRevenue = parseFloat(result.totalRevenue) || 0;
    const previousRevenue = parseFloat(previousResult.totalRevenue) || 0;
    const revenueGrowth = previousRevenue > 0
      ? parseFloat((((currentRevenue - previousRevenue) / previousRevenue) * 100).toFixed(2))
      : 0;

    return {
      totalRevenue: currentRevenue,
      totalOrders: parseInt(result.totalOrders) || 0,
      averageOrderValue: parseFloat(result.averageOrderValue) || 0,
      totalCustomers: parseInt(result.totalCustomers) || 0,
      revenueGrowth,
    };
  }

  async getMonthlyComparison(startDate: string, endDate: string): Promise<any> {
    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .select('DATE_FORMAT(order.created_at, "%Y-%m")', 'month')
      .addSelect('SUM(order.total_amount)', 'revenue')
      .addSelect('COUNT(order.id)', 'orderCount')
      .where('order.created_at BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany();

    return {
      data: orders.map(item => ({
        month: item.month,
        revenue: parseFloat(item.revenue) || 0,
        orderCount: parseInt(item.orderCount) || 0,
      })),
    };
  }
}