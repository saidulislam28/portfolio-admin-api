import { ApiProperty } from '@nestjs/swagger';
import { AppointmentStatus, ServiceType } from '@prisma/client';

class UserDto {
  @ApiProperty({ description: 'User ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'User full name', example: 'John Doe' })
  full_name: string;

  @ApiProperty({ 
    description: 'User profile image URL', 
    example: 'https://example.com/profile.jpg',
    nullable: true 
  })
  profile_image: string | null;

  @ApiProperty({ description: 'Whether user is a test user', example: false })
  is_test_user: boolean;
}

class ConsultantDto {
  @ApiProperty({ description: 'Consultant ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Consultant full name', example: 'Jane Smith' })
  full_name: string;

  @ApiProperty({ description: 'Consultant email', example: 'jane@example.com' })
  email: string;

  @ApiProperty({ description: 'Consultant phone number', example: '+1234567890' })
  phone: string;

  @ApiProperty({ description: 'Consultant timezone', example: 'UTC' })
  timezone: string;

  @ApiProperty({ description: 'Consultant experience', example: '5 years' })
  experience: string;

  @ApiProperty({ 
    description: 'Consultant profile image URL', 
    example: 'https://example.com/consultant.jpg',
    nullable: true 
  })
  profile_image: string | null;

  @ApiProperty({ description: 'Whether consultant is test user', example: false })
  is_test_user: boolean;
}

class OrderDto {
  @ApiProperty({ 
    description: 'Service type', 
    enum: ServiceType,
    example: ServiceType.speaking_mock_test 
  })
  service_type: ServiceType;
}

class FeedbackDto {
  @ApiProperty({ description: 'Feedback ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Rating given', example: 4.5 })
  rating: number;

  @ApiProperty({ description: 'Feedback comments', example: 'Great session!' })
  comments: string;

  @ApiProperty({ description: 'Feedback creation date' })
  created_at: Date;
}

class AppointmentModelDto {
  @ApiProperty({ description: 'Appointment ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Appointment start time' })
  start_at: Date;

  @ApiProperty({ description: 'Appointment end time' })
  end_at: Date;

  @ApiProperty({ 
    description: 'Appointment status', 
    enum: AppointmentStatus,
    example: AppointmentStatus.CONFIRMED 
  })
  status: AppointmentStatus;

  @ApiProperty({ description: 'Appointment duration in minutes', example: 60 })
  duration_in_min: number;

  @ApiProperty({ description: 'Appointment notes', nullable: true })
  notes: string | null;

  @ApiProperty({ description: 'Appointment token', example: 'uuid-token' })
  token: string;

  @ApiProperty({ description: 'Appointment creation date' })
  created_at: Date;

  @ApiProperty({ type: UserDto })
  User: UserDto;

  @ApiProperty({ type: OrderDto })
  Order: OrderDto;

  @ApiProperty({ type: ConsultantDto })
  Consultant: ConsultantDto;

  @ApiProperty({ type: FeedbackDto, nullable: true })
  MockTestFeedback: FeedbackDto | null;

  @ApiProperty({ type: FeedbackDto, nullable: true })
  ConversationFeedback: FeedbackDto | null;
}

export class AppointmentsResponseDto {
  @ApiProperty({ 
    type: [AppointmentModelDto],
    description: 'Upcoming appointments (more than 12 hours from now)' 
  })
  upcoming: AppointmentModelDto[];

  @ApiProperty({ 
    type: [AppointmentModelDto],
    description: 'Live appointments (within next 12 hours)' 
  })
  live: AppointmentModelDto[];

  @ApiProperty({ 
    type: [AppointmentModelDto],
    description: 'Past appointments' 
  })
  past: AppointmentModelDto[];
}



class ConsultantDetailDto {
  @ApiProperty({ description: 'Consultant ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Consultant full name', example: 'Jane Smith' })
  full_name: string;

  @ApiProperty({ description: 'Consultant email', example: 'jane@example.com' })
  email: string;

  @ApiProperty({ description: 'Consultant phone number', example: '+1234567890' })
  phone: string;

  @ApiProperty({ description: 'Consultant timezone', example: 'UTC' })
  timezone: string;

  @ApiProperty({ description: 'Consultant experience', example: '5 years' })
  experience: string;

  @ApiProperty({ 
    description: 'Consultant profile image URL', 
    example: 'https://example.com/consultant.jpg',
    nullable: true 
  })
  profile_image: string | null;

  @ApiProperty({ description: 'Whether consultant is test user', example: false })
  is_test_user: boolean;
}

class OrderDetailDto {
  @ApiProperty({ 
    description: 'Service type', 
    enum: ServiceType,
    example: ServiceType.speaking_mock_test 
  })
  service_type: ServiceType;
}

export class AppointmentDetailResponseDto {
  @ApiProperty({ description: 'Appointment ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Appointment start time' })
  start_at: Date;

  @ApiProperty({ description: 'Appointment end time' })
  end_at: Date;

  @ApiProperty({ 
    description: 'Appointment status', 
    enum: AppointmentStatus,
    example: AppointmentStatus.CONFIRMED 
  })
  status: AppointmentStatus;

  @ApiProperty({ description: 'Appointment duration in minutes', example: 60 })
  duration_in_min: number;

  @ApiProperty({ description: 'Appointment notes', nullable: true })
  notes: string | null;

  @ApiProperty({ description: 'Appointment token', example: 'uuid-token' })
  token: string;

  @ApiProperty({ description: 'Appointment creation date' })
  created_at: Date;

  @ApiProperty({ type: OrderDetailDto })
  Order: OrderDetailDto;

  @ApiProperty({ type: ConsultantDetailDto })
  Consultant: ConsultantDetailDto;

  @ApiProperty({ 
    description: 'Mock test feedback', 
    nullable: true 
  })
  MockTestFeedback: any | null;

  @ApiProperty({ 
    description: 'Conversation feedback', 
    nullable: true 
  })
  ConversationFeedback: any | null;
}