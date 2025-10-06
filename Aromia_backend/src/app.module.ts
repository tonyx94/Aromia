import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RolesModule } from './modules/roles/roles.module';
import { AdminUsersModule } from './modules/admin-users/admin-users.module';
import { CustomersModule } from './modules/customers/customers.module';

import { CustomerAddressesModule } from './modules/customer-addresses/customer-addresses.module';
import { ProductCategoriesModule } from './modules/product-categories/product-categories.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { OrderItemsModule } from './modules/order-items/order-items.module';
import { OrderStatusesModule } from './modules/order-statuses/order-statuses.module';
import { OrderStatusHistoryModule } from './modules/order-status-history/order-status-history.module';
import { ShoppingCartModule } from './modules/shopping-cart/shopping-cart.module';
import { SystemSettingsModule } from './modules/system-setting/system-setting.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

 
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/entities/*.entity{.ts,.js}'],
      synchronize: true, 
      logging: false, 
    }),
    RolesModule, AdminUsersModule, CustomersModule, CustomerAddressesModule, CustomerAddressesModule, ProductCategoriesModule, ProductsModule, OrdersModule, OrderItemsModule, OrderStatusesModule, OrderStatusHistoryModule, ShoppingCartModule, SystemSettingsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
