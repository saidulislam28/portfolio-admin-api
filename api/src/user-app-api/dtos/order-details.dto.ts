import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray,IsDateString, IsNumber, IsString, ValidateNested } from 'class-validator';

// Base appointment DTO
class AppointmentDto {
  @ApiProperty({ description: 'Unique appointment ID' })
  @IsString()
  appointmentId: string;

  @ApiProperty({ description: 'Appointment date' })
  @IsString()
  date: string;

  @ApiProperty({ description: 'Appointment time' })
  @IsString()
  time: string;
}

// Base book item DTO
class BookItemDto {
  @ApiProperty({ description: 'Book name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Quantity of books' })
  @IsNumber()
  quantity: number;

  @ApiProperty({ description: 'Price per book' })
  @IsNumber()
  price: number;
}

// Base exam item DTO
class ExamItemDto {
  @ApiProperty({ description: 'Exam type or service name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Quantity' })
  @IsNumber()
  quantity: number;

  @ApiProperty({ description: 'Price' })
  @IsNumber()
  price: number;
}

// Speaking Mock Test Response DTO
export class SpeakingMockTestResponseDto {
  @ApiProperty({ description: 'Success title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Success subtitle with congratulations' })
  @IsString()
  subtitle: string;

  @ApiProperty({ description: 'Card title for display' })
  @IsString()
  cardTitle: string;

  @ApiProperty({ description: 'Icon name for display' })
  @IsString()
  icon: string;

  @ApiProperty({ description: 'List of booked appointments', type: [AppointmentDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AppointmentDto)
  appointments: AppointmentDto[];

//   @ApiProperty({ description: 'Helpful tip for the user' })
//   @IsString()
//   tip: string;

  @ApiProperty({ description: 'Creation timestamp' })
  @IsDateString()
  createdAt: string;
}

// Conversation Response DTO
export class ConversationResponseDto {
  @ApiProperty({ description: 'Success title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Success subtitle with congratulations' })
  @IsString()
  subtitle: string;

  @ApiProperty({ description: 'Card title for display' })
  @IsString()
  cardTitle: string;

  @ApiProperty({ description: 'Icon name for display' })
  @IsString()
  icon: string;

  @ApiProperty({ description: 'List of booked appointments', type: [AppointmentDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AppointmentDto)
  appointments: AppointmentDto[];

  @ApiProperty({ description: 'Creation timestamp' })
  @IsDateString()
  createdAt: string;
}

// Book Purchase Response DTO
export class BookPurchaseResponseDto {
  @ApiProperty({ description: 'Success title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Success subtitle' })
  @IsString()
  subtitle: string;

  @ApiProperty({ description: 'Card title for display' })
  @IsString()
  cardTitle: string;

  @ApiProperty({ description: 'Icon name for display' })
  @IsString()
  icon: string;

  @ApiProperty({ description: 'Order ID' })
  @IsString()
  orderId: string;

  @ApiProperty({ description: 'Purchase date in readable format' })
  @IsString()
  purchaseDate: string;

  @ApiProperty({ description: 'List of purchased books', type: [BookItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BookItemDto)
  items: BookItemDto[];

  @ApiProperty({ description: 'Total price of all items' })
  @IsNumber()
  totalPrice: number;

  @ApiProperty({ description: 'Creation timestamp' })
  @IsDateString()
  createdAt: string;
}

// Exam Registration Response DTO
export class ExamRegistrationResponseDto {
  @ApiProperty({ description: 'Success title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Success subtitle' })
  @IsString()
  subtitle: string;

  @ApiProperty({ description: 'Card title for display' })
  @IsString()
  cardTitle: string;

  @ApiProperty({ description: 'Icon name for display' })
  @IsString()
  icon: string;

  @ApiProperty({ description: 'Registration ID' })
  @IsString()
  registrationId: string;

  @ApiProperty({ description: 'Exam date' })
  @IsString()
  examDate: string;

  @ApiProperty({ description: 'List of exam items and fees', type: [ExamItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExamItemDto)
  items: ExamItemDto[];

  @ApiProperty({ description: 'Total price including all fees' })
  @IsNumber()
  totalPrice: number;

  @ApiProperty({ description: 'Creation timestamp' })
  @IsDateString()
  createdAt: string;
}

// IELTS Academic Response DTO
export class IeltsAcademicResponseDto {
  @ApiProperty({ description: 'Success title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Success subtitle' })
  @IsString()
  subtitle: string;

  @ApiProperty({ description: 'Card title for display' })
  @IsString()
  cardTitle: string;

  @ApiProperty({ description: 'Icon name for display' })
  @IsString()
  icon: string;

  @ApiProperty({ description: 'Order ID' })
  @IsString()
  orderId: string;

  @ApiProperty({ description: 'Creation timestamp' })
  @IsDateString()
  createdAt: string;
}

// Generic Order Response DTO
export class GenericOrderResponseDto {
  @ApiProperty({ description: 'Success title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Success subtitle' })
  @IsString()
  subtitle: string;

  @ApiProperty({ description: 'Card title for display' })
  @IsString()
  cardTitle: string;

  @ApiProperty({ description: 'Icon name for display' })
  @IsString()
  icon: string;

  @ApiProperty({ description: 'Order ID' })
  @IsString()
  orderId: string;

  @ApiProperty({ description: 'Order date in readable format' })
  @IsString()
  date: string;

  @ApiProperty({ description: 'Creation timestamp' })
  @IsDateString()
  createdAt: string;
}

export type OrderDetailsResponse = 
  | SpeakingMockTestResponseDto 
  | ConversationResponseDto 
  | BookPurchaseResponseDto 
  | ExamRegistrationResponseDto 
  | IeltsAcademicResponseDto 
  | GenericOrderResponseDto;