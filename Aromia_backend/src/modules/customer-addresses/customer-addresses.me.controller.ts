import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guard/jwt-auth.guard';
import { CustomerAddressesService } from './customer-addresses.service';
import { CreateCustomerAddressDto } from './dto/create-customer-address.dto';
import { UpdateCustomerAddressDto } from './dto/update-customer-address.dto';

@ApiTags('customer-addresses-me')
@ApiTags('customer-addresses-me')
@Controller('customers/me/addresses')
export class CustomerAddressesMeController {
  constructor(private readonly service: CustomerAddressesService) { }

  private getCustomerId(req: any): number {
    return Number(req.user?.id ?? req.user?.userId ?? req.user?.sub ?? 3);
  }

  @Get()
  findAll(@Req() req: any) {
    const customerId = this.getCustomerId(req);
    return this.service.findAllByCustomer(customerId);
  }

  @Post()
  create(@Req() req: any, @Body() dto: CreateCustomerAddressDto) {
    const customerId = this.getCustomerId(req);
    return this.service.createForCustomer(customerId, dto);
  }

  @Put(':id')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateCustomerAddressDto,
  ) {
    const customerId = this.getCustomerId(req);
    return this.service.updateForCustomer(customerId, Number(id), dto);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    const customerId = this.getCustomerId(req);
    return this.service.removeForCustomer(customerId, Number(id));
  }

  @Put(':id/default')
  setDefault(@Req() req: any, @Param('id') id: string) {
    const customerId = this.getCustomerId(req);
    return this.service.setDefaultForCustomer(customerId, Number(id));
  }
}