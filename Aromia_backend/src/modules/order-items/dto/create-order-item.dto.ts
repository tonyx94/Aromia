import { IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderItemDto {
  @ApiProperty()
  @IsInt()
  orderId: number;

  @ApiProperty()
  @IsInt()
  productId: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  quantity: number;

  @ApiProperty()
  unit_price: number;

  @ApiProperty()
  total_price: number;
}
