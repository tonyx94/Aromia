import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { ShoppingCartModule } from '../shopping-cart/shopping-cart.module';
import { AuthModule } from '../../auth/auth.module';
import { ProductsModule } from '../products/products.module';
import { CustomersModule } from '../customers/customers.module';
import { OrdersGateway } from './orders.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    forwardRef(() => ShoppingCartModule),
    AuthModule,
    ProductsModule,
    CustomersModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersGateway],
  exports: [OrdersService, OrdersGateway],
})
export class OrdersModule { }