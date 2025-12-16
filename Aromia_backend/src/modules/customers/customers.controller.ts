import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomerAddressesService } from '../customer-addresses/customer-addresses.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { UpdateCustomerProfileDto } from './dto/update-customer-profile.dto';
import { CreateCustomerAddressDto } from '../customer-addresses/dto/create-customer-address.dto';
import { UpdateCustomerAddressDto } from '../customer-addresses/dto/update-customer-address.dto';
import { JwtAuthGuard } from '../../guard/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('customers')
@Controller('customers')
export class CustomersController {
  constructor(
    private readonly customersService: CustomersService,
    private readonly customerAddressesService: CustomerAddressesService,
  ) { }

  private getCustomerIdFromReq(req: any): number {
    return Number(req.user?.id ?? req.user?.userId ?? req.user?.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req: any) {
    const customerId = this.getCustomerIdFromReq(req);
    return this.customersService.findOne(customerId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('me')
  updateMe(
    @Req() req: any,
    @Body() dto: UpdateCustomerProfileDto,
  ) {
    const customerId = this.getCustomerIdFromReq(req);

    return this.customersService.update(
      customerId,
      dto as unknown as UpdateCustomerDto,
    );
  }

  // Address management endpoints
  @UseGuards(JwtAuthGuard)
  @Get('me/addresses')
  getMyAddresses(@Req() req: any) {
    const customerId = this.getCustomerIdFromReq(req);
    console.log('GET /customers/me/addresses - Received customer_id:', customerId);
    return this.customerAddressesService.findAllByCustomer(customerId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me/addresses')
  createMyAddress(
    @Req() req: any,
    @Body() dto: CreateCustomerAddressDto,
  ) {
    const customerId = this.getCustomerIdFromReq(req);
    console.log('POST /customers/me/addresses - Received customer_id:', customerId);
    return this.customerAddressesService.createForCustomer(customerId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('me/addresses/:id')
  updateMyAddress(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateCustomerAddressDto,
  ) {
    const customerId = this.getCustomerIdFromReq(req);
    console.log('PUT /customers/me/addresses/:id - Received customer_id:', customerId, 'Address ID:', id);
    return this.customerAddressesService.updateForCustomer(customerId, +id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me/addresses/:id')
  deleteMyAddress(
    @Req() req: any,
    @Param('id') id: string,
  ) {
    const customerId = this.getCustomerIdFromReq(req);
    console.log('DELETE /customers/me/addresses/:id - Received customer_id:', customerId, 'Address ID:', id);
    return this.customerAddressesService.removeForCustomer(customerId, +id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('me/addresses/:id/default')
  setMyDefaultAddress(
    @Req() req: any,
    @Param('id') id: string,
  ) {
    const customerId = this.getCustomerIdFromReq(req);
    console.log('PUT /customers/me/addresses/:id/default - Received customer_id:', customerId, 'Address ID:', id);
    return this.customerAddressesService.setDefaultForCustomer(customerId, +id);
  }


  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  findAll() {
    return this.customersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(+id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customersService.remove(+id);
  }
}
