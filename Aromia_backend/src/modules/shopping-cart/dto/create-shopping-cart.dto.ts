import { IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateShoppingCartDto {
  @ApiProperty()
  @IsInt()
  customerId: number;

  @ApiProperty()
  @IsInt()
  productId: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  quantity: number;
}
