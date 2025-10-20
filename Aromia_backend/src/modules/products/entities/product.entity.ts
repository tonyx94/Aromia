
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { OrderItem } from '../../order-items/entities/order-item.entity';
import { ProductCategory } from '../../product-categories/entities/product-category.entity';
import { ShoppingCart } from '../../shopping-cart/entities/shopping-cart.entity';


@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  category_id: number;

  @Column({ type: 'int', default: 0 })
  stock_quantity: number;

  @Column({ type: 'int', default: 0 })
  min_stock_level: number;

  @Column({ length: 255, nullable: true })
  image_url: string;

  @Column({ default: true })
  is_active: boolean;
 
  
 @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date;

  @ManyToOne(() => ProductCategory, (category) => category.products, { eager: true })
  category: ProductCategory; 

  @OneToMany(() => OrderItem, (item) => item.product)
  orderItems: OrderItem[];

  @OneToMany(() => ShoppingCart, (cart) => cart.product)
  shoppingCarts: ShoppingCart[];
}
