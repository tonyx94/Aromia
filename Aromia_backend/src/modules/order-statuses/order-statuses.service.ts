import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderStatus } from './entities/order-status.entity';
import { CreateOrderStatusDto } from './dto/create-order-status.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrderStatusesService {
  constructor(
    @InjectRepository(OrderStatus)
    private readonly statusRepository: Repository<OrderStatus>,
  ) {}

  create(dto: CreateOrderStatusDto): Promise<OrderStatus> {
    const status = this.statusRepository.create(dto);
    return this.statusRepository.save(status);
  }

  findAll(): Promise<OrderStatus[]> {
    return this.statusRepository.find({ order: { order_sequence: 'ASC' } });
  }

  async findOne(id: number): Promise<OrderStatus> {
    const status = await this.statusRepository.findOne({ where: { id } });
    if (!status) throw new NotFoundException(`Order status #${id} not found`);
    return status;
  }

  async update(id: number, dto: UpdateOrderStatusDto): Promise<OrderStatus> {
    const status = await this.findOne(id);
    Object.assign(status, dto);
    return this.statusRepository.save(status);
  }

  async remove(id: number): Promise<void> {
    const status = await this.findOne(id);
    await this.statusRepository.remove(status);
  }
}
