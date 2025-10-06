import { CustomerAddress } from 'src/modules/customer-addresses/entities/customer-address.entity';
import { Customer } from 'src/modules/customers/entities/customer.entity';
import { OrderItem } from 'src/modules/order-items/entities/order-item.entity';
import { OrderStatusHistory } from 'src/modules/order-status-history/entities/order-status-history.entity';
import { OrderStatus } from 'src/modules/order-statuses/entities/order-status.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';


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

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', nullable: true })
  admin_notes: string;

  @Column({ type: 'datetime', nullable: true })
  estimated_delivery: Date;

  @Column({ type: 'datetime', nullable: true })
  delivered_at: Date;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  // Relaciones
  @ManyToOne(() => Customer, (customer) => customer.orders, { eager: true })
  customer: Customer;

  @ManyToOne(() => CustomerAddress, (address) => address.orders, { eager: true })
  address: CustomerAddress;

  @ManyToOne(() => OrderStatus, (status) => status.orders, { eager: true })
  status: OrderStatus;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];

  @OneToMany(() => OrderStatusHistory, (history) => history.changed_by, { cascade: true })
  statusHistory: OrderStatusHistory[];
}
