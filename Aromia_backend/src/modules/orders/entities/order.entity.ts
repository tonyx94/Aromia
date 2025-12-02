
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { CustomerAddress } from '../../customer-addresses/entities/customer-address.entity';
import { Customer } from '../../customers/entities/customer.entity';
import { OrderItem } from '../../order-items/entities/order-item.entity';
import { OrderStatusHistory } from '../../order-status-history/entities/order-status-history.entity';
import { OrderStatus } from '../../order-statuses/entities/order-status.entity';


@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  order_number: string;

  @Column()
  customer_id: number;

  @Column()
  address_id: number;

  @Column()
  status_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  tax_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  shipping_cost: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_amount: number;

  @Column({ type: 'text', nullable: true, charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci' })
  notes: string;

  @Column({ type: 'text', nullable: true, charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci' })
  admin_notes: string;

  @Column({ type: 'datetime', nullable: true })
  estimated_delivery: Date;

  @Column({ type: 'datetime', nullable: true })
  delivered_at: Date;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];

  @OneToMany(() => OrderStatusHistory, (history) => history.changed_by, { cascade: true })
  statusHistory: OrderStatusHistory[];


  @ManyToOne(() => Customer, (customer) => customer.orders, { eager: true })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @ManyToOne(() => CustomerAddress, (address) => address.orders, { eager: true })
  @JoinColumn({ name: 'address_id' })
  address: CustomerAddress;

  @ManyToOne(() => OrderStatus, (status) => status.orders, { eager: true })
  @JoinColumn({ name: 'status_id' })
  status: OrderStatus;
}
