import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrderStatusesService } from './order-statuses.service';
import { CreateOrderStatusDto } from './dto/create-order-status.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@ApiTags('order-statuses')
@Controller('order-statuses')
export class OrderStatusesController {
  constructor(private readonly orderStatusesService: OrderStatusesService) {}

  @Post()
  create(@Body() dto: CreateOrderStatusDto) {
    return this.orderStatusesService.create(dto);
  }

  @Get()
  findAll() {
    return this.orderStatusesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderStatusesService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.orderStatusesService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderStatusesService.remove(+id);
  }
}
