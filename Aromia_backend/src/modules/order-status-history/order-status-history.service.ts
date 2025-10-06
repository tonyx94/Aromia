import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderStatusHistory } from './entities/order-status-history.entity';
import { CreateOrderStatusHistoryDto } from './dto/create-order-status-history.dto';
import { UpdateOrderStatusHistoryDto } from './dto/update-order-status-history.dto';
import { Order } from '../orders/entities/order.entity';
import { OrderStatus } from '../order-statuses/entities/order-status.entity';
import { AdminUser } from '../admin-users/entities/admin-user.entity';

@Injectable()
export class OrderStatusHistoryService {
  constructor(
    @InjectRepository(OrderStatusHistory)
    private readonly historyRepo: Repository<OrderStatusHistory>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderStatus)
    private readonly statusRepo: Repository<OrderStatus>,
    @InjectRepository(AdminUser)
    private readonly adminRepo: Repository<AdminUser>,
  ) {}

  async create(dto: CreateOrderStatusHistoryDto): Promise<OrderStatusHistory> {
    const order = await this.orderRepo.findOne({ where: { id: dto.orderId } });
    if (!order) throw new NotFoundException('Order not found');

    const status = await this.statusRepo.findOne({ where: { id: dto.statusId } });
    if (!status) throw new NotFoundException('Status not found');

    let user: AdminUser | null = null;
    if (dto.changedBy) {
      user = await this.adminRepo.findOne({ where: { id: dto.changedBy } });
      if (!user) throw new NotFoundException('Admin user not found');
    }

    const history = this.historyRepo.create({
      order,
      status,
      ...(user ? { changed_by: user } : {}),
      notes: dto.notes,
    });

    return this.historyRepo.save(history);
  }

  findAll(): Promise<OrderStatusHistory[]> {
    return this.historyRepo.find({ relations: ['order', 'status', 'changed_by'] });
  }

  async findOne(id: number): Promise<OrderStatusHistory> {
    const history = await this.historyRepo.findOne({ where: { id }, relations: ['order', 'status', 'changed_by'] });
    if (!history) throw new NotFoundException('History entry not found');
    return history;
  }

  async update(id: number, dto: UpdateOrderStatusHistoryDto): Promise<OrderStatusHistory> {
    const history = await this.findOne(id);

    if (dto.orderId) {
      const order = await this.orderRepo.findOne({ where: { id: dto.orderId } });
      if (!order) throw new NotFoundException('Order not found');
      history.order = order;
    }

    if (dto.statusId) {
      const status = await this.statusRepo.findOne({ where: { id: dto.statusId } });
      if (!status) throw new NotFoundException('Status not found');
      history.status = status;
    }

    if (dto.changedBy) {
      const user = await this.adminRepo.findOne({ where: { id: dto.changedBy } });
      if (!user) throw new NotFoundException('Admin user not found');
      history.changed_by = user;
    }

    if (dto.notes !== undefined) history.notes = dto.notes;

    return this.historyRepo.save(history);
  }

  async remove(id: number): Promise<void> {
    const history = await this.findOne(id);
    await this.historyRepo.remove(history);
  }
}
