import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

// Request DTOs
export class AssignConsultantDto {
  @ApiProperty({
    description: 'Consultant ID to assign to the appointment',
    example: 1
  })
  @IsNumber()
  @IsNotEmpty()
  consultant_id: number;
}

// Response DTOs
export class UserDto {
  @ApiProperty({ description: 'User ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'User full name', example: 'John Doe' })
  full_name: string;

  @ApiProperty({ description: 'User email', example: 'john@example.com' })
  email: string;

  @ApiPropertyOptional({ description: 'User phone number', example: '+1234567890' })
  phone?: string;

  @ApiPropertyOptional({ description: 'User profile image URL' })
  profile_image?: string;

  @ApiProperty({ description: 'Whether user is a test user', example: false })
  is_test_user: boolean;

  @ApiPropertyOptional({ description: 'User timezone', example: 'UTC' })
  timezone?: string;
}

export class ConsultantDto {
  @ApiProperty({ description: 'Consultant ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Consultant full name', example: 'Jane Smith' })
  full_name: string;

  @ApiProperty({ description: 'Consultant email', example: 'jane@example.com' })
  email: string;

  @ApiPropertyOptional({ description: 'Consultant skills', example: 'IELTS, Conversation' })
  skills?: string;

  @ApiPropertyOptional({ description: 'Consultant profile image URL' })
  profile_image?: string;

  @ApiProperty({ description: 'Whether consultant is a test user', example: false })
  is_test_user: boolean;

  @ApiPropertyOptional({ description: 'Consultant phone number', example: '+1987654321' })
  phone?: string;

  @ApiPropertyOptional({ description: 'Consultant hourly rate', example: 25.0 })
  hourly_rate?: number;
}

export class OrderDto {
  @ApiProperty({ description: 'Order ID', example: 1 })
  id: number;

  @ApiPropertyOptional({ description: 'Order service type', example: 'speaking_mock_test' })
  service_type?: string;

  @ApiPropertyOptional({ description: 'Order status', example: 'approved' })
  status?: string;

  @ApiPropertyOptional({ description: 'Order total amount', example: 100.0 })
  total?: number;
}

export class MockTestFeedbackDto {
  @ApiProperty({ description: 'Feedback ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Overall band score', example: 6.5 })
  overallBandScore: number;

  @ApiProperty({ description: 'Fluency score', example: 7.0 })
  fluencyCoherence: number;

  @ApiProperty({ description: 'Vocabulary score', example: 6.0 })
  lexicalResource: number;

  @ApiProperty({ description: 'Grammar score', example: 6.5 })
  grammaticalRange: number;

  @ApiProperty({ description: 'Pronunciation score', example: 7.5 })
  pronunciation: number;
}

export class ConversationFeedbackDto {
  @ApiProperty({ description: 'Feedback ID', example: 1 })
  id: number;

  @ApiPropertyOptional({ description: 'Overall level', example: 'B2 Intermediate' })
  overallLevel?: string;

  @ApiPropertyOptional({ description: 'General comments' })
  generalComments?: string;
}

export class AppointmentResponseDto {
  @ApiProperty({ description: 'Appointment ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Appointment start time' })
  start_at: Date;

  @ApiProperty({ description: 'Appointment end time' })
  end_at: Date;

  @ApiProperty({ description: 'Appointment status', example: 'scheduled' })
  status: string;

  @ApiProperty({ description: 'Appointment duration in minutes', example: 60 })
  duration_in_min: number;

  @ApiPropertyOptional({ description: 'Appointment notes' })
  notes?: string;

  @ApiProperty({ description: 'Appointment token', example: 'uuid-token' })
  token: string;

  @ApiProperty({ description: 'Appointment creation date' })
  created_at: Date;

  @ApiProperty({ type: UserDto })
  User: UserDto;

  @ApiProperty({ type: ConsultantDto })
  Consultant: ConsultantDto;

  @ApiProperty({ type: OrderDto })
  Order: OrderDto;

  @ApiPropertyOptional({ type: MockTestFeedbackDto })
  MockTestFeedback?: MockTestFeedbackDto;

  @ApiPropertyOptional({ type: ConversationFeedbackDto })
  ConversationFeedback?: ConversationFeedbackDto;
}

export class AppointmentListResponseDto {
  @ApiProperty({
    type: [AppointmentResponseDto],
    description: 'List of appointments'
  })
  data: AppointmentResponseDto[];

  @ApiProperty({
    description: 'Total count of appointments',
    example: 10
  })
  total: number;
}

export class AssignConsultantResponseDto {
  @ApiProperty({ description: 'Appointment ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Consultant ID', example: 1 })
  consultant_id: number;

  @ApiProperty({ description: 'Consultant name', example: 'Jane Smith' })
  consultant_name: string;

  @ApiProperty({ description: 'Assignment success status', example: true })
  success: boolean;

  @ApiProperty({ description: 'Notification queued status', example: true })
  notification_queued: boolean;
}

// Additional DTOs for future use
export class AppointmentQueryDto {
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
    example: 'scheduled'
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({
    description: 'Start date filter (YYYY-MM-DD)',
    example: '2024-01-01'
  })
  @IsString()
  @IsOptional()
  start_date?: string;

  @ApiPropertyOptional({
    description: 'End date filter (YYYY-MM-DD)',
    example: '2024-12-31'
  })
  @IsString()
  @IsOptional()
  end_date?: string;
}

export class UpdateAppointmentDto {
  @ApiPropertyOptional({
    description: 'Appointment status',
    example: 'completed'
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({
    description: 'Appointment notes',
    example: 'Client arrived late'
  })
  @IsString()
  @IsOptional()
  notes?: string;
}