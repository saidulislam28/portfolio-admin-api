import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

// Query DTO
export class BookingQueryDto {
  @ApiPropertyOptional({
    description: 'Search term to filter bookings by notes, token, consultant_id, or user_id',
    example: 'john'
  })
  @IsString()
  @IsOptional()
  search?: string;
}

// Request DTO
export class UpdateBookingDto {
  @ApiPropertyOptional({
    description: 'Booking notes',
    example: 'Customer requested rescheduling'
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Booking status',
    example: 'confirmed'
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({
    description: 'Booking token',
    example: 'booking-12345'
  })
  @IsString()
  @IsOptional()
  token?: string;

  @ApiPropertyOptional({
    description: 'Start time of the booking',
    example: '2024-01-15T10:00:00.000Z'
  })
  @IsDateString()
  @IsOptional()
  start_at?: string;

  @ApiPropertyOptional({
    description: 'End time of the booking',
    example: '2024-01-15T11:00:00.000Z'
  })
  @IsDateString()
  @IsOptional()
  end_at?: string;
}

// Response DTOs
export class UserDto {
  @ApiProperty({ description: 'User ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'User full name', example: 'John Doe' })
  full_name: string;
}

export class ConsultantDto {
  @ApiProperty({ description: 'Consultant ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Consultant full name', example: 'Jane Smith' })
  full_name: string;

  @ApiProperty({ description: 'Consultant email', example: 'jane@example.com' })
  email: string;

  @ApiPropertyOptional({ description: 'Consultant phone number', example: '+1234567890' })
  phone?: string;

  @ApiPropertyOptional({ description: 'Consultant profile image URL' })
  profile_image?: string;

  @ApiProperty({ description: 'Whether consultant is active', example: true })
  is_active: boolean;
}

export class BookingHistoryDto {
  @ApiProperty({ description: 'History ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Booking ID', example: 1 })
  booking_id: number;

  @ApiProperty({ description: 'Action performed', example: 'status_update' })
  action: string;

  @ApiProperty({ description: 'Previous value', example: 'pending' })
  previous_value: string;

  @ApiProperty({ description: 'New value', example: 'confirmed' })
  new_value: string;

  @ApiProperty({ description: 'Change timestamp' })
  changed_at: Date;
}

export class BookingResponseDto {
  @ApiProperty({ description: 'Booking ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'User ID', example: 1 })
  user_id: number;

  @ApiProperty({ description: 'Consultant ID', example: 1 })
  consultant_id: number;

  @ApiProperty({ description: 'Booking start time' })
  start_at: Date;

  @ApiProperty({ description: 'Booking end time' })
  end_at: Date;

  @ApiProperty({ description: 'Booking status', example: 'confirmed' })
  status: string;

  @ApiPropertyOptional({ description: 'Booking notes' })
  notes?: string;

  @ApiProperty({ description: 'Booking token', example: 'booking-12345' })
  token: string;

  @ApiProperty({ description: 'Booking duration in minutes', example: 60 })
  duration_in_min: number;

  @ApiProperty({ description: 'Booking creation date' })
  created_at: Date;

  @ApiProperty({ description: 'Booking last update date' })
  updated_at: Date;

  @ApiProperty({ type: UserDto })
  User: UserDto;

  @ApiProperty({ type: ConsultantDto })
  Consultant: ConsultantDto;

  @ApiPropertyOptional({ type: [BookingHistoryDto] })
  BookingHistory?: BookingHistoryDto[];
}

export class BookingListResponseDto {
  @ApiProperty({
    type: [BookingResponseDto],
    description: 'List of bookings'
  })
  data: BookingResponseDto[];

  @ApiProperty({
    description: 'Total count of bookings',
    example: 10
  })
  total: number;
}

// Additional DTOs for future use
export class CreateBookingDto {
  @ApiProperty({
    description: 'User ID for the booking',
    example: 1
  })
  @IsNumber()
  user_id: number;

  @ApiProperty({
    description: 'Consultant ID for the booking',
    example: 1
  })
  @IsNumber()
  consultant_id: number;

  @ApiProperty({
    description: 'Booking start time',
    example: '2024-01-15T10:00:00.000Z'
  })
  @IsDateString()
  start_at: string;

  @ApiProperty({
    description: 'Booking end time',
    example: '2024-01-15T11:00:00.000Z'
  })
  @IsDateString()
  end_at: string;

  @ApiPropertyOptional({
    description: 'Booking notes',
    example: 'Initial consultation booking'
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Booking status',
    example: 'pending'
  })
  @IsString()
  @IsOptional()
  status?: string;
}

export class BookingStatusDto {
  @ApiProperty({
    description: 'New booking status',
    example: 'confirmed',
    enum: ['pending', 'confirmed', 'cancelled', 'completed']
  })
  @IsString()
  status: string;
}

export class BookingFilterDto {
  @ApiPropertyOptional({
    description: 'Filter by user ID',
    example: 1
  })
  @IsNumber()
  @IsOptional()
  user_id?: number;

  @ApiPropertyOptional({
    description: 'Filter by consultant ID',
    example: 1
  })
  @IsNumber()
  @IsOptional()
  consultant_id?: number;

  @ApiPropertyOptional({
    description: 'Filter by status',
    example: 'confirmed'
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({
    description: 'Filter by start date (YYYY-MM-DD)',
    example: '2024-01-01'
  })
  @IsString()
  @IsOptional()
  start_date?: string;

  @ApiPropertyOptional({
    description: 'Filter by end date (YYYY-MM-DD)',
    example: '2024-01-31'
  })
  @IsString()
  @IsOptional()
  end_date?: string;
}