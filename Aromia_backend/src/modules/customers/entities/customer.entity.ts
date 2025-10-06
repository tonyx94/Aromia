import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { CustomerAddress } from '../../customer-addresses/entities/customer-address.entity';
import { Order } from '../../orders/entities/order.entity';
import { ShoppingCart } from '../../shopping-cart/entities/shopping-cart.entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({ name: 'first_name', length: 50 })
  firstName: string;

  @Column({ name: 'last_name', length: 50 })
  lastName: string;

  @Column({ length: 20 })
  phone: string;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth?: Date;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relaciones
  @OneToMany(() => CustomerAddress, (address) => address.customer)
  addresses: CustomerAddress[];

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];

  @OneToMany(() => ShoppingCart, (cart) => cart.customer)
  shoppingCart: ShoppingCart[];
}
