import { Injectable, NotFoundException } from '@nestjs/common';
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
  ) {}

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
      where: { customer_id: customerId }, 
      order: { created_at: 'DESC' },     
    });
  }

  async findOneByCustomer(
    orderId: number,
    customerId: number,
  ): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: {
        id: orderId,
        customer_id: customerId,
      },
      relations: ['items'], 
    });

    if (!order) {
      throw new NotFoundException(
        `Orden con ID ${orderId} no encontrada para este cliente`,
      );
    }

    return order;
  }
}
