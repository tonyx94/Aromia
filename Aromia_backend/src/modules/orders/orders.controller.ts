import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva orden' })
  @ApiResponse({ status: 201, description: 'Orden creada correctamente' })
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las órdenes' })
  @ApiResponse({ status: 200, description: 'Lista obtenida correctamente' })
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una orden por ID' })
  @ApiResponse({ status: 200, description: 'Orden encontrada' })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una orden' })
  @ApiResponse({ status: 200, description: 'Orden actualizada correctamente' })
  update(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
    return this.ordersService.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una orden' })
  @ApiResponse({ status: 200, description: 'Orden eliminada correctamente' })
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
