import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, IsPositive } from 'class-validator';

export class ConsultantReportQueryDto {
  @ApiProperty({
    description: 'Start date for the report range (ISO 8601 format)',
    example: '2023-11-01T00:00:00.000Z'
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'End date for the report range (ISO 8601 format)',
    example: '2023-11-30T23:59:59.999Z'
  })
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional({
    description: 'Optional consultant ID to filter the report for a specific consultant',
    example: 1
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  consultantId?: number;
}

export class AppointmentStatusCountDto {
  @ApiProperty({
    description: 'Number of initiated appointments',
    example: 5
  })
  initiated: number;

  @ApiProperty({
    description: 'Number of pending appointments',
    example: 10
  })
  pending: number;

  @ApiProperty({
    description: 'Number of confirmed appointments',
    example: 15
  })
  confirmed: number;

  @ApiProperty({
    description: 'Number of cancelled appointments',
    example: 2
  })
  cancelled: number;

  @ApiProperty({
    description: 'Number of completed appointments',
    example: 8
  })
  completed: number;

  @ApiProperty({
    description: 'Number of no-show appointments',
    example: 1
  })
  no_show: number;
}

export class DayReportDto {
  @ApiProperty({
    description: 'Date in ISO format',
    example: '2023-11-15T00:00:00.000Z'
  })
  date: Date;

  @ApiProperty({
    description: 'Total number of appointments for this day',
    example: 41
  })
  totalAppointments: number;

  @ApiProperty({
    description: 'Breakdown of appointments by status',
    type: AppointmentStatusCountDto
  })
  statusCounts: AppointmentStatusCountDto;
}

export class ConsultantReportDto {
  @ApiProperty({
    description: 'Consultant ID',
    example: 1
  })
  consultantId: number;

  @ApiProperty({
    description: 'Consultant full name',
    example: 'Dr. John Smith'
  })
  consultantName: string;

  @ApiProperty({
    description: 'Consultant email',
    example: 'john.smith@example.com'
  })
  consultantEmail: string;

  @ApiProperty({
    description: 'Total appointments across all dates',
    example: 123
  })
  totalAppointments: number | unknown;

  @ApiProperty({
    description: 'Overall status breakdown for all appointments',
    type: AppointmentStatusCountDto
  })
  overallStatusCounts: AppointmentStatusCountDto;

  @ApiProperty({
    description: 'Daily breakdown of appointments',
    type: [DayReportDto]
  })
  dailyReports: DayReportDto[];
}

export class ConsultantReportResponseDto {
  @ApiProperty({
    description: 'Date range start',
    example: '2023-11-01T00:00:00.000Z'
  })
  startDate: Date;

  @ApiProperty({
    description: 'Date range end',
    example: '2023-11-30T23:59:59.999Z'
  })
  endDate: Date;

  @ApiProperty({
    description: 'Total number of consultants in the report',
    example: 5
  })
  totalConsultants: number;

  @ApiProperty({
    description: 'List of consultant reports',
    type: [ConsultantReportDto]
  })
  consultants: ConsultantReportDto[];
}