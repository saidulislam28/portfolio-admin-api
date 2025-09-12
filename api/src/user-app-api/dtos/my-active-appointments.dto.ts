import { ApiProperty } from '@nestjs/swagger';

export class SingleAppointmentDto {
  @ApiProperty({ example: 12, description: 'Unique identifier of the appointment' })
  id: number;

  @ApiProperty({ example: '2025-09-12T06:40:00.000Z', description: 'Start time of the appointment in ISO 8601 format' })
  start_at: string;

  @ApiProperty({ example: '2025-09-12T07:00:00.000Z', description: 'End time of the appointment in ISO 8601 format' })
  end_at: string;

  @ApiProperty({ example: 'PENDING', description: 'Status of the appointment (e.g., PENDING, CONFIRMED, CANCELLED)' })
  status: string;

  @ApiProperty({ example: 20, description: 'Duration of the appointment in minutes' })
  duration_in_min: number;

  @ApiProperty({ example: 'IELTS Speaking Test', description: 'Notes associated with the appointment', nullable: true })
  notes: string | null;

  @ApiProperty({ example: '2025-09-12T06:18:46.825Z', description: 'Timestamp when the appointment was booked' })
  booked_at: string;

  @ApiProperty({ example: '36491896-01ef-461c-b28f-07f075ca8671', description: 'Unique token for the appointment' })
  token: string;

  @ApiProperty({ example: null, description: 'ID of the consultant', nullable: true })
  consultant_id: number | null;

  @ApiProperty({ example: 2, description: 'ID of the user who booked the appointment' })
  user_id: number;

  @ApiProperty({ example: null, description: 'Reason for cancellation', nullable: true })
  cancel_reason: string | null;

  @ApiProperty({ example: 17, description: 'ID of the related order' })
  order_id: number;

  @ApiProperty({ example: '2025-09-12T00:00:00.000Z', description: 'Date of the appointment' })
  slot_date: string;

  @ApiProperty({ example: '06:40', description: 'Time of the slot in HH:MM format' })
  slot_time: string;

  @ApiProperty({ example: 'Asia/Dhaka', description: 'Timezone of the user' })
  user_timezone: string;

  @ApiProperty({ example: '2025-09-12T06:18:46.825Z', description: 'Timestamp of creation' })
  created_at: string;

  @ApiProperty({ example: '2025-09-12T06:19:39.036Z', description: 'Timestamp of the last update' })
  updated_at: string;
}

export class MetaDto {
  @ApiProperty({ example: '2025-09-12T06:35:26.228Z', description: 'Timestamp when the response was generated' })
  generated_at: string;

  @ApiProperty({ example: 4, description: 'Total number of days in the data array' })
  total_days: number;
}

export class MyActiveAppointmentsResponseDto {
  @ApiProperty({ example: true, description: 'Indicates if the API request was successful' })
  success: boolean;

  @ApiProperty({ type: [SingleAppointmentDto], description: 'List of appointment objects' })
  data: SingleAppointmentDto[];

  @ApiProperty({ type: MetaDto, description: 'Metadata about the response' })
  meta: MetaDto;
}