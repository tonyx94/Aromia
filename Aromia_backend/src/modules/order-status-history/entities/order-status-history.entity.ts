import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { OrderStatus } from '../../order-statuses/entities/order-status.entity';
import { AdminUser } from '../../admin-users/entities/admin-user.entity';

@Entity('order_status_history')
export class OrderStatusHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.statusHistory, { onDelete: 'CASCADE', eager: true })
  order: Order;

  @ManyToOne(() => AdminUser, (user) => user.statusChanges, { nullable: true, eager: true })
  changed_by: AdminUser;

  @ManyToOne(() => OrderStatus, (status) => status.history, { eager: true })
  status: OrderStatus;

  

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
