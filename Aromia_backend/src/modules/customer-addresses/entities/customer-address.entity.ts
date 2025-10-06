import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Customer } from '../../customers/entities/customer.entity';
import { Order } from '../../orders/entities/order.entity';

@Entity('customer_addresses')
export class CustomerAddress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  alias: string;

  @Column({ name: 'street_address', length: 200 })
  streetAddress: string;

  @Column({ length: 100 })
  city: string;

  @Column({ length: 100 })
  state: string;

  @Column({ name: 'postal_code', length: 20, nullable: true })
  postalCode?: string;

  @Column({ length: 100, default: 'Costa Rica' })
  country: string;

  @Column({ name: 'additional_info', type: 'text', nullable: true })
  additionalInfo?: string;

  @Column({ name: 'is_default', default: false })
  isDefault: boolean;

  @ManyToOne(() => Customer, (customer) => customer.addresses, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  // <-- relación inversa con orders
  @OneToMany(() => Order, (order) => order.address)
  orders: Order[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
