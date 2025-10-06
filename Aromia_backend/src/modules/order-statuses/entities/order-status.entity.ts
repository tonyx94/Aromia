import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { OrderStatusHistory } from '../../order-status-history/entities/order-status-history.entity';

@Entity('order_statuses')
export class OrderStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 7, default: '#000000' })
  color: string;

  @Column({ type: 'int' })
  order_sequence: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @OneToMany(() => Order, (order) => order.status)
  orders: Order[];

  @OneToMany(() => OrderStatusHistory, (history) => history.status)
  history: OrderStatusHistory[];
}
