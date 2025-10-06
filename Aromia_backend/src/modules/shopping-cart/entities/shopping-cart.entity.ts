import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';
import { Customer } from '../../customers/entities/customer.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('shopping_cart')
@Unique('unique_customer_product', ['customer', 'product'])
export class ShoppingCart {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Customer, (customer) => customer.shoppingCart, { onDelete: 'CASCADE', eager: true })
  customer: Customer;

  @ManyToOne(() => Product, (product) => product.shoppingCarts, { onDelete: 'CASCADE', eager: true })
  product: Product;

  @Column({ type: 'int' })
  quantity: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
