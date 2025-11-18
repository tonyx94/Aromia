import { Module } from '@nestjs/common';
import { CustomerAddressesService } from './customer-addresses.service';
import { CustomerAddressesController } from './customer-addresses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerAddress } from './entities/customer-address.entity';
import { Customer } from '../customers/entities/customer.entity';
import { CustomerAddressesMeController } from './customer-addresses.me.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerAddress, Customer])],
  controllers: [
    CustomerAddressesController,      
    CustomerAddressesMeController,    
  ],
  providers: [CustomerAddressesService],
  exports: [CustomerAddressesService],
})
export class CustomerAddressesModule {}
