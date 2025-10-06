import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrderStatusHistoryService } from './order-status-history.service';
import { CreateOrderStatusHistoryDto } from './dto/create-order-status-history.dto';
import { UpdateOrderStatusHistoryDto } from './dto/update-order-status-history.dto';

@ApiTags('order-status-history')
@Controller('order-status-history')
export class OrderStatusHistoryController {
  constructor(private readonly historyService: OrderStatusHistoryService) {}

  @Post()
  create(@Body() dto: CreateOrderStatusHistoryDto) {
    return this.historyService.create(dto);
  }

  @Get()
  findAll() {
    return this.historyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.historyService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateOrderStatusHistoryDto) {
    return this.historyService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.historyService.remove(+id);
  }
}
