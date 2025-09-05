import { ApiProperty } from '@nestjs/swagger';

export class AppointmentDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '09:00' })
  time: string;

  @ApiProperty({ example: 60 })
  duration: number;

  @ApiProperty({ example: 'John Smith' })
  client: string;

  @ApiProperty({ example: 'Consultation' })
  type: string;

  @ApiProperty({ example: 'confirmed' })
  status: string;

  @ApiProperty({ example: 'Some notes about the appointment', required: false })
  notes?: string;

  @ApiProperty({ example: '2025-08-25T09:00:00.000Z' })
  start_at: string;

  @ApiProperty({ example: '2025-08-25T10:00:00.000Z' })
  end_at: string;
}

export class AppointmentsByDateDto {
  @ApiProperty({ 
    type: [AppointmentDto],
    description: 'List of appointments for the date'
  })
  appointments: AppointmentDto[];
}

export class GetAppointmentsResponseDto {
  @ApiProperty({
    type: 'object',
    additionalProperties: {
      type: 'array',
      items: { $ref: '#/components/schemas/AppointmentDto' }
    },
    description: 'Appointments grouped by date (YYYY-MM-DD)',
    example: {
      '2025-08-25': [
        {
          id: 1,
          time: '09:00',
          duration: 60,
          client: 'John Smith',
          type: 'Consultation',
          status: 'confirmed',
          notes: 'Initial consultation',
          start_at: '2025-08-25T09:00:00.000Z',
          end_at: '2025-08-25T10:00:00.000Z'
        }
      ]
    }
  })
  data: Record<string, AppointmentDto[]>;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Appointments retrieved successfully' })
  message: string;
}