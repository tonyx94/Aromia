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
import { PaymentsModule } from './modules/payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: "127.0.0.1",
      port: 3310,
      username: "root",
      password: "",
      database: "aromia",
      entities: [__dirname + '/**/entities/*.entity{.ts,.js}'],
      synchronize: true,
      logging: false,
      dateStrings: false,
      charset: 'utf8mb4_unicode_ci',
    }),
    RolesModule,
    AdminUsersModule,
    CustomersModule,
    CustomerAddressesModule,
    ProductCategoriesModule,
    ProductsModule,
    OrdersModule,
    OrderItemsModule,
    OrderStatusesModule,
    OrderStatusHistoryModule,
    ShoppingCartModule,
    SystemSettingsModule,
    AuthModule,
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }