import { Controller, Get, Post, Body, Param, Put, Delete, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ShoppingCartService } from './shopping-cart.service';
import { CreateShoppingCartDto } from './dto/create-shopping-cart.dto';
import { UpdateShoppingCartDto } from './dto/update-shopping-cart.dto';
import { JwtAuthGuard } from '../../guard/jwt-auth.guard';

@ApiTags('shopping-cart')
@Controller('shopping-cart')
export class ShoppingCartController {
  constructor(private readonly cartService: ShoppingCartService) { }

  @Post()
  create(@Body() dto: CreateShoppingCartDto) {
    return this.cartService.create(dto);
  }

  @Get()
  findAll() {
    return this.cartService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateShoppingCartDto) {
    return this.cartService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartService.remove(+id);
  }

  @Delete('customer/clear')
  async clearCart(@Req() req) {
    const customerId = req.user?.customerId ?? 3;
    await this.cartService.clearByCustomerId(customerId);
    return { message: 'Cart cleared successfully' };
  }
}
