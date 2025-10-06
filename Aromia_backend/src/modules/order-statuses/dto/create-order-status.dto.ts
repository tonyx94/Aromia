import { IsNotEmpty, IsString, IsOptional, IsInt, IsHexColor } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderStatusDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ default: '#000000' })
  @IsHexColor()
  color: string;

  @ApiProperty()
  @IsInt()
  order_sequence: number;
}
