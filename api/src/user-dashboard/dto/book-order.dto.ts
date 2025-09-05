import { ApiProperty } from '@nestjs/swagger';

// User DTO
export class UserDto {
  @ApiProperty({ description: 'User ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'User name', example: 'John Doe' })
  full_name: string;

  @ApiProperty({ description: 'User email', example: 'john@example.com' })
  email: string;

  @ApiProperty({ description: 'User phone number', example: '+1234567890', nullable: true })
  phone: string | null;
}

// Book DTO
export class BookDto {
  @ApiProperty({ description: 'Book ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Book title', example: 'The Great Gatsby' })
  title: string;

  @ApiProperty({ description: 'Book author', example: 'F. Scott Fitzgerald' })
  writer: string;

  @ApiProperty({ description: 'Book price', example: 25.99 })
  price: number;

  @ApiProperty({ description: 'Book ISBN', example: '978-3-16-148410-0', nullable: true })
  isbn: string | null;
}

// Order Item DTO
export class OrderItemDto {
  @ApiProperty({ description: 'Order item ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Book ID', example: 1 })
  book_id: number;

  @ApiProperty({ description: 'Quantity', example: 2 })
  qty: number;

  @ApiProperty({ description: 'Unit price', example: 25.99 })
  unit_price: number;

  @ApiProperty({ description: 'Subtotal', example: 51.98 })
  subtotal: number;

  @ApiProperty({ description: 'Book details', type: BookDto })
  Book: BookDto;
}

// Payment DTO
export class PaymentDto {
  @ApiProperty({ description: 'Order ID', example: 1 })
  order_id: number;

  @ApiProperty({ description: 'Payment method', example: 'credit_card' })
  payment_method: string;

  @ApiProperty({ description: 'Transaction ID', example: 'txn_123456789' })
  transaction_id: string;

  @ApiProperty({ description: 'Payment timestamp', example: '2023-12-01T10:00:00Z' })
  paid_at: Date;
}

// Book Order Response DTO
export class BookOrderResponseDto {
  @ApiProperty({ description: 'Order ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'User ID', example: 1 })
  user_id: number;

  @ApiProperty({ description: 'Service type', example: 'book_purchase' })
  service_type: string;

  @ApiProperty({ description: 'Order status', example: 'completed' })
  status: string;

  @ApiProperty({ description: 'Total amount', example: 57.97 })
  total: number;

  @ApiProperty({ description: 'Creation timestamp', example: '2023-12-01T10:00:00Z' })
  created_at: Date;

  @ApiProperty({ description: 'Update timestamp', example: '2023-12-01T10:00:00Z' })
  updated_at: Date;

  @ApiProperty({ description: 'User details', type: UserDto })
  User: UserDto;

  @ApiProperty({ description: 'Order items', type: [OrderItemDto] })
  OrderItem: OrderItemDto[];

  @ApiProperty({ description: 'Payment information', type: PaymentDto, nullable: true })
  Payment: PaymentDto | null;
}

// Book Order Detail Response DTO (for single order with more details)
export class BookOrderDetailResponseDto extends BookOrderResponseDto {
  @ApiProperty({ description: 'Delivery address', example: '123 Main St, City, Country', nullable: true })
  delivery_address: string | null;

  @ApiProperty({ description: 'Phone number for delivery', example: '+1234567890', nullable: true })
  phone: string | null;

  @ApiProperty({ description: 'Subtotal amount', example: 51.98 })
  subtotal: number;

  @ApiProperty({ description: 'Delivery charge', example: 5.99 })
  delivery_charge: number;
}

// Error Response DTO
export class ErrorResponseDto {
  @ApiProperty({ description: 'HTTP status code', example: 404 })
  statusCode: number;

  @ApiProperty({ description: 'Error message', example: 'Book order not found' })
  message: string;

  @ApiProperty({ description: 'Error details', example: 'No order found with the given ID' })
  error: string;
}