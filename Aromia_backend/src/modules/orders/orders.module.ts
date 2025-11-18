import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { ShoppingCartModule } from '../shopping-cart/shopping-cart.module';
// Ya no necesitamos CustomersModule aquí

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    forwardRef(() => ShoppingCartModule),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}