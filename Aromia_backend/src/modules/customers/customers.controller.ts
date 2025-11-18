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
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { UpdateCustomerProfileDto } from './dto/update-customer-profile.dto'; 
import { JwtAuthGuard } from '../../guard/jwt-auth.guard';              
import { ApiTags } from '@nestjs/swagger';

@ApiTags('customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

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
