import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateProductCategoryDto {
  @ApiProperty({ example: 'Electrónica' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'Dispositivos y accesorios electrónicos', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'https://example.com/image.jpg', required: false })
  @IsOptional()
  @IsString()
  image_url?: string;

  @ApiProperty({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
