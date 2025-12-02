import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CustomerAddressesService } from './customer-addresses.service';
import { CreateCustomerAddressDto } from './dto/create-customer-address.dto';
import { UpdateCustomerAddressDto } from './dto/update-customer-address.dto';

@ApiTags('customer-addresses-me')
@Controller('customers/me/addresses')
export class CustomerAddressesMeController {
  constructor(private readonly service: CustomerAddressesService) { }

  @Get()
  findAll(@Query('customer_id') customerId: number) {
    return this.service.findAllByCustomer(customerId);
  }

  @Post()
  create(@Body() dto: CreateCustomerAddressDto & { customer_id: number }) {
    const { customer_id, ...addressDto } = dto;
    console.log('POST /customers/me/addresses - Received customer_id:', customer_id);
    console.log('POST /customers/me/addresses - Full DTO:', dto);
    return this.service.createForCustomer(customer_id, addressDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCustomerAddressDto & { customer_id: number },
  ) {
    const { customer_id, ...addressDto } = dto;
    console.log('PUT /customers/me/addresses/:id - Received customer_id:', customer_id);
    console.log('PUT /customers/me/addresses/:id - Address ID:', id);
    return this.service.updateForCustomer(customer_id, Number(id), addressDto);
  }

  @Delete(':id')
  remove(@Body('customer_id') customerId: number, @Param('id') id: string) {
    console.log('DELETE /customers/me/addresses/:id - Received customer_id:', customerId);
    console.log('DELETE /customers/me/addresses/:id - Address ID:', id);
    return this.service.removeForCustomer(customerId, Number(id));
  }

  @Put(':id/default')
  setDefault(@Body('customer_id') customerId: number, @Param('id') id: string) {
    console.log('PUT /customers/me/addresses/:id/default - Received customer_id:', customerId);
    console.log('PUT /customers/me/addresses/:id/default - Address ID:', id);
    return this.service.setDefaultForCustomer(customerId, Number(id));
  }
}