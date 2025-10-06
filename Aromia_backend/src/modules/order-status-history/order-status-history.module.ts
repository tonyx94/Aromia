import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderStatusHistoryService } from './order-status-history.service';
import { OrderStatusHistoryController } from './order-status-history.controller';
import { OrderStatusHistory } from './entities/order-status-history.entity';
import { Order } from '../orders/entities/order.entity';
import { OrderStatus } from '../order-statuses/entities/order-status.entity';
import { AdminUser } from '../admin-users/entities/admin-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderStatusHistory, Order, OrderStatus, AdminUser])],
  controllers: [OrderStatusHistoryController],
  providers: [OrderStatusHistoryService],
  exports: [OrderStatusHistoryService],
})
export class OrderStatusHistoryModule {}
