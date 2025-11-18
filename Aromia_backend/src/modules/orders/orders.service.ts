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
    // ESTE ES EL CONSTRUCTOR CORRECTO Y FUSIONADO
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>, // Para AR-52 y lógica existente
    @Inject(forwardRef(() => ShoppingCartService))
    private readonly shoppingCartService: ShoppingCartService, // Para AR-53
  ) {}
  
  // --- MÉTODO NUEVO PARA AR-53 ---
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
  // --- FIN DEL MÉTODO NUEVO ---

  // --- MÉTODOS EXISTENTES Y DE AR-52 (LOS MANTENEMOS) ---
  async create(dto: CreateOrderDto): Promise<Order> {
    const order = this.orderRepository.create(dto);
    return await this.orderRepository.save(order);
  }

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find();
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
      where: { customer: { id: customerId } }, // Ajustado para usar la relación
      order: { created_at: 'DESC' },     
    });
  }

  async findOneById(orderId: number, customerId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, customer: { id: customerId } }, // Ajustado para usar la relación
      relations: ['items', 'items.product', 'address', 'status'], 
    });

    if (!order) {
      throw new NotFoundException(
        `Orden con ID ${orderId} no encontrada para este cliente`,
      );
    }
    return order;
  }
}