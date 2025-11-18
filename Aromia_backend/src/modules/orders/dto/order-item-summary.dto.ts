import { ApiProperty } from '@nestjs/swagger';

export class OrderItemSummaryDto {
  @ApiProperty()
  productId: number;
  
  @ApiProperty()
  productName: string;
  
  @ApiProperty()
  productImage: string;
  
  @ApiProperty()
  quantity: number;
  
  @ApiProperty()
  unitPrice: number;
  
  @ApiProperty()
  total: number;
}