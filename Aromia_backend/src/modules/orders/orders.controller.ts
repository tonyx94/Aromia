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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from '../../guard/jwt-auth.guard'; 

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  private getCustomerIdFromReq(req: any): number {
    return Number(req.user?.id ?? req.user?.userId ?? req.user?.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  @ApiOperation({ summary: 'Listar órdenes del cliente autenticado' })
  @ApiResponse({ status: 200, description: 'Lista obtenida correctamente' })
  findMyOrders(@Req() req: any) {
    const customerId = this.getCustomerIdFromReq(req);
    return this.ordersService.findAllByCustomer(customerId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my/:id')
  @ApiOperation({
    summary: 'Obtener detalle de una orden del cliente autenticado',
  })
  @ApiResponse({ status: 200, description: 'Orden encontrada' })
  findMyOrder(@Req() req: any, @Param('id') id: string) {
    const customerId = this.getCustomerIdFromReq(req);
    return this.ordersService.findOneByCustomer(+id, customerId);
  }

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