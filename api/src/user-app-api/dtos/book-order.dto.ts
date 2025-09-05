import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

export class BookOrderItemDto {
  @ApiProperty({ description: 'Book ID', example: 1 })
  @IsNumber()
  book_id: number;

  @ApiProperty({ description: 'Quantity of books', example: 2 })
  @IsNumber()
  qty: number;

  @ApiProperty({ description: 'Unit price of the book', example: 25.99 })
  @IsNumber()
  unit_price: number;

  @ApiProperty({ description: 'Subtotal for this item', example: 51.98 })
  @IsNumber()
  subtotal: number;
}

export class CreateBookOrderDto {
  @ApiProperty({ description: 'User ID', example: 123 })
  @IsNumber()
  user_id: number;

  @ApiProperty({ description: 'Phone number', example: '+1234567890' })
  @IsString()
  phone: string;

  @ApiProperty({ description: 'Delivery address', example: '123 Main St, City, Country' })
  @IsString()
  delivery_address: string;

  @ApiProperty({ description: 'Order subtotal', example: 51.98 })
  @IsNumber()
  subtotal: number;

  @ApiProperty({ description: 'Delivery charge', example: 5.99 })
  @IsNumber()
  delivery_charge: number;

  @ApiProperty({ description: 'Total amount', example: 57.97 })
  @IsNumber()
  total: number;

  @ApiProperty({
    description: 'Book order items',
    type: [BookOrderItemDto],
    example: [
      {
        book_id: 1,
        qty: 2,
        unit_price: 25.99,
        subtotal: 51.98
      }
    ]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BookOrderItemDto)
  bookorderItems: BookOrderItemDto[];

  @ApiProperty({
    description: 'Order ID (optional)',
    required: false,
    example: 1
  })
  @IsOptional()
  @IsNumber()
  id?: number;
}