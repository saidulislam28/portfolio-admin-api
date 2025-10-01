import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional
} from '@nestjs/swagger';
import { ServiceType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  ValidateNested
} from 'class-validator';

export class AppointmentDto {
  @ApiProperty({
    description: 'Appointment start time in ISO 8601 format',
    example: '2024-01-15T10:00:00.000Z'
  })
  @IsISO8601()
  @IsNotEmpty()
  start_at: Date;

  @ApiProperty({
    description: 'Appointment end time in ISO 8601 format',
    example: '2024-01-15T11:00:00.000Z'
  })
  @IsISO8601()
  @IsNotEmpty()
  end_at: Date;

  @ApiPropertyOptional({
    description: 'Additional notes for the appointment',
    example: 'Please bring previous test results'
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({
    description: 'Appointment duration in minute',
    example: 60
  })
  @IsNumber()
  @IsPositive()
  duration_in_min: number;
}

export class BookOrderItemDto {
  @ApiProperty({
    description: 'Book ID for the order item',
    example: 1
  })
  @IsNumber()
  @IsPositive()
  book_id: number;

  // @ApiProperty({
  //   description: 'Item name',
  //   example: 'IELTS Preparation Book'
  // })
  // @IsString()
  // @IsNotEmpty()
  // name?: string;

  @ApiProperty({
    description: 'Item quantity',
    example: 1,
    minimum: 1
  })
  @IsNumber()
  @IsPositive()
  @Min(1)
  qty: number;

  @ApiProperty({
    description: 'Unit price of the item',
    example: 500.00
  })
  @IsNumber()
  @IsPositive()
  unit_price: number;

  @ApiPropertyOptional({
    description: 'Item description',
    example: 'Comprehensive IELTS preparation guide'
  })
  @IsString()
  @IsOptional()
  description?: string;
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'Type of service being ordered',
    enum: ServiceType,
    example: ServiceType.speaking_mock_test
  })
  @IsEnum(ServiceType)
  service_type: ServiceType;

  @ApiProperty({
    description: 'Customer full name',
    example: 'Johnss'
  })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({
    description: 'Customer email address',
    example: 'john.doe@example.com'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Customer phone number',
    example: '+8801712345678'
  })
  @IsOptional()
  // @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    description: 'Order subtotal amount',
    example: 1000.00
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  subtotal: number;
  @ApiProperty({
    description: 'UserID',
    example: 1
  })

  @ApiProperty({
    description: 'Order total amount',
    example: 1000.00
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  total: number;

  @ApiPropertyOptional({
    description: 'Package ID if ordering a package',
    example: 1
  })
  @IsNumber()
  @IsOptional()
  package_id?: number;
  
  @ApiPropertyOptional({
    description: 'Center ID if exam registration',
    example: 1
  })
  @IsNumber()
  @IsOptional()
  center_id?: number;

  @ApiPropertyOptional({
    description: 'Array of appointments for service types that require scheduling',
    type: [AppointmentDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  appointments?: AppointmentDto[];

  @ApiPropertyOptional({
    description: 'Array of order items for product purchases',
    type: [BookOrderItemDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BookOrderItemDto)
  @IsOptional()
  items?: BookOrderItemDto[];

  @ApiProperty({
    description: 'User timezone for appointment scheduling',
    example: 'Asia/Dhaka'
  })
  @IsString()
  @IsOptional()
  user_timezone?: string;

  @ApiHideProperty()
  @IsOptional()
  payment_status?: string;

  @ApiProperty({
    description: 'Coupon code',
    example: 'AFAFA'
  })
  @IsOptional()
  @IsString()
  coupon_code?: string;
}

export class CreateOrderResponseDto {
  @ApiProperty({
    description: 'ID of the created order',
    example: 123
  })
  order_id: number;

  @ApiProperty({
    description: 'Payment URL for completing the transaction',
    example: 'https://sandbox.sslcommerz.com/gwprocess/v4/...'
  })
  payment_url: string;

  @ApiProperty({
    description: 'Total amount of the order',
    example: 1000.00
  })
  total_amount: number;
}