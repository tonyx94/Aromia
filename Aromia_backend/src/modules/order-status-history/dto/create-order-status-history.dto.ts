import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateOrderStatusHistoryDto {
  @ApiProperty()
  @IsInt()
  orderId: number;

  @ApiProperty()
  @IsInt()
  statusId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  changedBy?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
