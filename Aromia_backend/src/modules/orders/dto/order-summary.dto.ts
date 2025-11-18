import { ApiProperty } from '@nestjs/swagger';
import { OrderItemSummaryDto } from './order-item-summary.dto'; 
export class OrderSummaryDto {
  @ApiProperty({ type: [OrderItemSummaryDto] })
  items: OrderItemSummaryDto[];
  
  @ApiProperty()
  subtotal: number;
  
  @ApiProperty()
  shippingCost: number;
  
  @ApiProperty()
  taxes: number;
  
  @ApiProperty()
  total: number;
}