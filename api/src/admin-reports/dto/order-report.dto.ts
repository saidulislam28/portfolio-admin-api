import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsOptional, ValidateIf } from 'class-validator';
import { ServiceType } from '@prisma/client';

export class OrderReportsQueryDto {
  @ApiPropertyOptional({
    description: 'Single date for daily report (YYYY-MM-DD format)',
    example: '2024-01-15',
    type: String,
  })
  @IsOptional()
  @IsDateString()
  @ValidateIf((o) => !o.start_date && !o.end_date)
  date?: string;

  @ApiPropertyOptional({
    description: 'Start date for date range report (YYYY-MM-DD format)',
    example: '2024-01-01',
    type: String,
  })
  @IsOptional()
  @IsDateString()
  @ValidateIf((o) => !o.date)
  start_date?: string;

  @ApiPropertyOptional({
    description: 'End date for date range report (YYYY-MM-DD format)',
    example: '2024-01-31',
    type: String,
  })
  @IsOptional()
  @IsDateString()
  @ValidateIf((o) => !o.date)
  end_date?: string;

  @ApiPropertyOptional({
    description: 'Filter by service type',
    enum: ServiceType,
    example: ServiceType.ielts_academic,
  })
  @IsOptional()
  @IsEnum(ServiceType)
  service_type?: ServiceType;
}

export class OrderSummaryDto {
  @ApiProperty({
    description: 'Order ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Customer first name',
    example: 'John',
  })
  first_name: string;

  @ApiProperty({
    description: 'Customer last name',
    example: 'Doe',
  })
  last_name: string;

  @ApiProperty({
    description: 'Customer email',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Order status',
    example: 'completed',
  })
  status: string;

  @ApiProperty({
    description: 'Payment status',
    example: 'paid',
  })
  payment_status: string;

  @ApiProperty({
    description: 'Service type',
    enum: ServiceType,
    example: ServiceType.ielts_academic,
  })
  service_type: ServiceType;

  @ApiProperty({
    description: 'Order total amount',
    example: 150.00,
  })
  total: number;

  @ApiProperty({
    description: 'Order creation date',
    example: '2024-01-15T10:30:00Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Cash on delivery flag',
    example: false,
  })
  cod: boolean;
}

export class PaymentMethodStatsDto {
  @ApiProperty({
    description: 'Cash on delivery orders count',
    example: 5,
  })
  cod_orders: number;

  @ApiProperty({
    description: 'Online payment orders count',
    example: 25,
  })
  online_orders: number;

  @ApiProperty({
    description: 'Total COD amount',
    example: 750.00,
  })
  cod_amount: number;

  @ApiProperty({
    description: 'Total online payment amount',
    example: 3750.00,
  })
  online_amount: number;
}

export class ServiceTypeStatsDto {
  @ApiProperty({
    description: 'Service type',
    enum: ServiceType,
    example: ServiceType.ielts_academic,
  })
  service_type: ServiceType;

  @ApiProperty({
    description: 'Number of orders for this service type',
    example: 10,
  })
  order_count: number;

  @ApiProperty({
    description: 'Total revenue for this service type',
    example: 1500.00,
  })
  total_revenue: number;

  @ApiProperty({
    description: 'Average order value for this service type',
    example: 150.00,
  })
  average_order_value: number;
}

export class OrderReportsResponseDto {
  @ApiProperty({
    description: 'Date range for the report',
    example: '2024-01-01 to 2024-01-31',
  })
  report_period: string;

  @ApiProperty({
    description: 'Applied service type filter',
    enum: ServiceType,
    required: false,
    example: ServiceType.ielts_academic,
  })
  service_type_filter?: ServiceType;

  @ApiProperty({
    description: 'Total sales amount',
    example: 4500.00,
  })
  total_sales: number;

  @ApiProperty({
    description: 'Total number of orders',
    example: 30,
  })
  total_orders: number;

  @ApiProperty({
    description: 'Total cancelled orders amount',
    example: 300.00,
  })
  total_cancelled_amount: number;

  @ApiProperty({
    description: 'Number of cancelled orders',
    example: 2,
  })
  cancelled_orders_count: number;

  @ApiProperty({
    description: 'Average order value',
    example: 150.00,
  })
  average_order_value: number;

  @ApiProperty({
    description: 'Total revenue (excluding cancelled orders)',
    example: 4200.00,
  })
  total_revenue: number;

  @ApiProperty({
    description: 'Payment method statistics',
    type: PaymentMethodStatsDto,
  })
  payment_stats: PaymentMethodStatsDto;

  @ApiProperty({
    description: 'Service type breakdown',
    type: [ServiceTypeStatsDto],
  })
  service_type_stats: ServiceTypeStatsDto[];

  @ApiProperty({
    description: 'List of orders in the report period',
    type: [OrderSummaryDto],
  })
  orders: OrderSummaryDto[];

  @ApiProperty({
    description: 'List of cancelled orders',
    type: [OrderSummaryDto],
  })
  cancelled_orders: OrderSummaryDto[];
}