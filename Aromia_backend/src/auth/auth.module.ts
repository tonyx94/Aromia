import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { JwtModule } from '@nestjs/jwt';
import { AdminUsersModule } from 'src/modules/admin-users/admin-users.module';
import { CustomersModule } from 'src/modules/customers/customers.module';

@Module({
  imports: [
    AdminUsersModule,
    CustomersModule, 
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'supersecret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
