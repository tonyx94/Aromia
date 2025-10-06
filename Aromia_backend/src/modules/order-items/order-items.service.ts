import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { Order } from '../orders/entities/order.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(dto: CreateOrderItemDto): Promise<OrderItem> {
    const order = await this.orderRepository.findOne({ where: { id: dto.orderId } });
    if (!order) throw new NotFoundException('Order not found');

    const product = await this.productRepository.findOne({ where: { id: dto.productId } });
    if (!product) throw new NotFoundException('Product not found');

    const orderItem = this.orderItemRepository.create({
      order,
      product,
      quantity: dto.quantity,
      unit_price: dto.unit_price,
      total_price: dto.total_price,
    });

    return this.orderItemRepository.save(orderItem);
  }

  findAll(): Promise<OrderItem[]> {
    return this.orderItemRepository.find({ relations: ['order', 'product'] });
  }

  async findOne(id: number): Promise<OrderItem> {
    const orderItem = await this.orderItemRepository.findOne({
      where: { id },
      relations: ['order', 'product'],
    });
    if (!orderItem) throw new NotFoundException('Order item not found');
    return orderItem;
  }

  async update(id: number, dto: UpdateOrderItemDto): Promise<OrderItem> {
    const orderItem = await this.findOne(id);

    if (dto.orderId) {
      const order = await this.orderRepository.findOne({ where: { id: dto.orderId } });
      if (!order) throw new NotFoundException('Order not found');
      orderItem.order = order;
    }

    if (dto.productId) {
      const product = await this.productRepository.findOne({ where: { id: dto.productId } });
      if (!product) throw new NotFoundException('Product not found');
      orderItem.product = product;
    }

    Object.assign(orderItem, dto);

    return this.orderItemRepository.save(orderItem);
  }

  async remove(id: number): Promise<void> {
    const orderItem = await this.findOne(id);
    await this.orderItemRepository.remove(orderItem);
  }
}
