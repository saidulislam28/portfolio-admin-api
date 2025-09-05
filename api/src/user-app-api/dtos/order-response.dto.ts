// src/orders/dto/order-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class OrderResponseDto {
  @ApiProperty()
  order_id: number;

  @ApiProperty()
  payment_url: string;
}