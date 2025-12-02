import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Customer } from '../../customers/entities/customer.entity';
import { Order } from '../../orders/entities/order.entity';

@Entity('customer_addresses')
export class CustomerAddress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci' })
  alias: string;

  @Column({ name: 'street_address', length: 200, charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci' })
  streetAddress: string;

  @Column({ length: 100, charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci' })
  city: string;

  @Column({ length: 100, charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci' })
  state: string;

  @Column({ name: 'postal_code', length: 20, nullable: true, charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci' })
  postalCode?: string;

  @Column({ length: 100, default: 'Costa Rica', charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci' })
  country: string;

  @Column({ name: 'additional_info', type: 'text', nullable: true, charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci' })
  additionalInfo?: string;

  @Column({ name: 'is_default', default: false })
  isDefault: boolean;

  @ManyToOne(() => Customer, (customer) => customer.addresses, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @OneToMany(() => Order, (order) => order.address)
  orders: Order[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
