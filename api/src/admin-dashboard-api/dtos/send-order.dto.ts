// src/orders/dtos/send-order.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class SendOrderToVendorDto {
  @ApiProperty({
    description: 'ID of the vendor to send the order to',
    example: 123,
    type: Number
  })
  @IsInt()
  vendor_id: number;

  @ApiProperty({
    description: 'ID of the order to send to vendor',
    example: 456,
    type: Number
  })
  @IsInt()
  order_id: number;
}

export class SendOrderResponseDto {
  @ApiProperty({
    description: 'Success status of the operation',
    example: true,
    type: Boolean
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Order sent to vendor successfully',
    type: String
  })
  message: string;

  @ApiProperty({
    description: 'Response data containing order details',
    example: { order_id: 456, vendor_id: 123, status: 'sent' },
    type: Object
  })
  data: any;

  @ApiProperty({
    description: 'HTTP status code',
    example: 200,
    type: Number
  })
  statusCode: number;
}