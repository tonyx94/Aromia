import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Laptop Dell XPS 13' })
  @IsString()
  @MaxLength(200)
  name: string;

  @ApiProperty({ example: 'Laptop ultraligera de 13 pulgadas', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 1299.99 })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  category_id?: number;

  @ApiProperty({ example: 50, default: 0 })
  @IsOptional()
  @IsInt()
  stock_quantity?: number;

  @ApiProperty({ example: 5, default: 0 })
  @IsOptional()
  @IsInt()
  min_stock_level?: number;

  @ApiProperty({ example: 'https://example.com/product.jpg', required: false })
  @IsOptional()
  @IsString()
  image_url?: string;

  @ApiProperty({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
