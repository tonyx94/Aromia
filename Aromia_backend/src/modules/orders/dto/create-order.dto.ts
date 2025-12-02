import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsInt, IsNumber, IsOptional, IsPositive, IsString, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderItemDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  product_id: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @IsPositive()
  quantity: number;

  @ApiProperty({ example: 25.50 })
  @IsNumber()
  @IsPositive()
  unit_price: number;

  @ApiProperty({ example: 51.00 })
  @IsNumber()
  @IsPositive()
  total: number;
}

export class CreateOrderDto {
  @ApiProperty({ example: 'ORD-2025-0001' })
  @IsString()
  @MaxLength(50)
  order_number: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  customer_id: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  address_id: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  status_id: number;

  @ApiProperty({ example: 100.50 })
  @IsNumber()
  @IsPositive()
  subtotal: number;

  @ApiProperty({ example: 13.12, required: false })
  @IsOptional()
  @IsNumber()
  tax_amount?: number;

  @ApiProperty({ example: 5.00, required: false })
  @IsOptional()
  @IsNumber()
  shipping_cost?: number;

  @ApiProperty({ example: 10.00, required: false })
  @IsOptional()
  @IsNumber()
  discount_amount?: number;

  @ApiProperty({ example: 108.62 })
  @IsNumber()
  @IsPositive()
  total_amount: number;

  @ApiProperty({ example: 'Entrega rápida', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ example: 'Cliente VIP', required: false })
  @IsOptional()
  @IsString()
  admin_notes?: string;

  @ApiProperty({ example: '2025-10-15T15:30:00Z', required: false })
  @IsOptional()
  @IsDateString()
  estimated_delivery?: Date;

  @ApiProperty({ example: '2025-10-20T10:00:00Z', required: false })
  @IsOptional()
  @IsDateString()
  delivered_at?: Date;

  @ApiProperty({
    type: [CreateOrderItemDto],
    required: false,
    example: [
      { product_id: 1, quantity: 2, unit_price: 25.50, total: 51.00 }
    ]
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items?: CreateOrderItemDto[];
}
