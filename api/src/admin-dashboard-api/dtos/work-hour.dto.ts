// consultant-schedule.dto.ts

import {
  IsInt,
  IsString,
  IsBoolean,
  IsOptional,
  IsDateString,
  Min,
  Max,
  Matches,
  IsArray,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Base Work Hour DTO
export class WorkHourDto {
  @ApiProperty({
    description: 'Day of week (1=Monday, 2=Tuesday, ..., 7=Sunday)',
    minimum: 1,
    maximum: 7,
    example: 1,
  })
  @IsInt()
  @Min(1)
  @Max(7)
  day_of_week: number;

  @ApiProperty({
    description: 'Start time in 24-hour format (HH:mm)',
    example: '09:00',
    pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
  })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'start_time must be in HH:mm format',
  })
  start_time: string;

  @ApiProperty({
    description: 'End time in 24-hour format (HH:mm)',
    example: '17:00',
    pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
  })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'end_time must be in HH:mm format',
  })
  end_time: string;

  @ApiPropertyOptional({
    description: 'Whether this work hour is active',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean = true;
}

// Create Work Hour DTO
export class CreateWorkHourDto extends WorkHourDto {
  @ApiProperty({
    description: 'Consultant ID',
    example: 1,
  })
  // @IsInt()
  // @Min(1)
  consultant_id: number;
}

// Update Work Hour DTO
export class UpdateWorkHourDto {
  @ApiPropertyOptional({
    description: 'Day of week (1=Monday, 2=Tuesday, ..., 7=Sunday)',
    minimum: 1,
    maximum: 7,
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(7)
  day_of_week?: number;

  @ApiPropertyOptional({
    description: 'Start time in 24-hour format (HH:mm)',
    example: '09:00',
    pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
  })
  @IsOptional()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'start_time must be in HH:mm format',
  })
  start_time?: string;

  @ApiPropertyOptional({
    description: 'End time in 24-hour format (HH:mm)',
    example: '17:00',
    pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
  })
  @IsOptional()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'end_time must be in HH:mm format',
  })
  end_time?: string;

  @ApiPropertyOptional({
    description: 'Whether this work hour is active',
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

// Bulk Create Work Hours DTO
export class CreateBulkWorkHoursDto {
  @ApiProperty({
    description: 'Consultant ID',
    example: 1,
  })
  // @IsInt()
  // @Min(1)
  consultant_id: number;

  @ApiProperty({
    description: 'Array of work hours',
    type: [WorkHourDto],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => WorkHourDto)
  work_hours: WorkHourDto[];
}

// Off Day DTO
export class CreateOffDayDto {
  @ApiProperty({
    description: 'Consultant ID',
    example: 1,
  })
  // @IsInt()
  // @Min(1)
  consultant_id: number;

  @ApiProperty({
    description: 'Off date in ISO format (YYYY-MM-DD)',
    example: '2024-12-25',
  })
  @IsDateString()
  off_date: string;

  @ApiPropertyOptional({
    description: 'Reason for being off',
    example: 'Christmas Holiday',
  })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiPropertyOptional({
    description: 'Whether this off day is recurring',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  is_recurring?: boolean = false;
}

// Update Off Day DTO
export class UpdateOffDayDto {
  @ApiPropertyOptional({
    description: 'Off date in ISO format (YYYY-MM-DD)',
    example: '2024-12-25',
  })
  @IsOptional()
  @IsDateString()
  off_date?: string;

  @ApiPropertyOptional({
    description: 'Reason for being off',
    example: 'Christmas Holiday',
  })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiPropertyOptional({
    description: 'Whether this off day is recurring',
  })
  @IsOptional()
  @IsBoolean()
  is_recurring?: boolean;
}

// Bulk Create Off Days DTO
export class CreateBulkOffDaysDto {
  @ApiProperty({
    description: 'Consultant ID',
    example: 1,
  })
  // @IsInt()
  // @Min(1)
  consultant_id: number;

  @ApiProperty({
    description: 'Array of off dates in ISO format',
    example: ['2024-12-25', '2024-01-01'],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsDateString({}, { each: true })
  off_dates: string[];

  @ApiPropertyOptional({
    description: 'Reason for being off (applies to all dates)',
    example: 'Holiday Period',
  })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiPropertyOptional({
    description: 'Whether these off days are recurring',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  is_recurring?: boolean = false;
}

// Query DTOs
export class GetWorkHoursQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by day of week',
    minimum: 1,
    maximum: 7,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  @Max(7)
  day_of_week?: number;

  @ApiPropertyOptional({
    description: 'Filter by active status',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  is_active?: boolean;
}

export class GetOffDaysQueryDto {
  @ApiPropertyOptional({
    description: 'Start date for filtering (YYYY-MM-DD)',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiPropertyOptional({
    description: 'End date for filtering (YYYY-MM-DD)',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDateString()
  end_date?: string;

  @ApiPropertyOptional({
    description: 'Filter by recurring status',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  is_recurring?: boolean;
}

// Response DTOs
export class WorkHourResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  consultant_id: number;

  @ApiProperty({ example: 1, description: '1=Monday, 7=Sunday' })
  day_of_week: number;

  @ApiProperty({ example: '09:00' })
  start_time: string;

  @ApiProperty({ example: '17:00' })
  end_time: string;

  @ApiProperty({ example: true })
  is_active: boolean;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

export class OffDayResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  consultant_id: number;

  @ApiProperty({ example: '2024-12-25' })
  off_date: string;

  @ApiPropertyOptional({ example: 'Christmas Holiday' })
  reason?: string;

  @ApiProperty({ example: false })
  is_recurring: boolean;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

export class ConsultantScheduleResponseDto {
  @ApiProperty({ type: [WorkHourResponseDto] })
  work_hours: WorkHourResponseDto[];

  @ApiProperty({ type: [OffDayResponseDto] })
  off_days: OffDayResponseDto[];
}

// Validation Pipe DTOs
export class ConsultantParamDto {
  @ApiProperty({
    description: 'Consultant ID',
    example: 1,
  })
  @Transform(({ value }) => parseInt(value))
  // @IsInt()
  // @Min(1)
  consultant_id: number;
}

export class WorkHourParamDto extends ConsultantParamDto {
  @ApiProperty({
    description: 'Work Hour ID',
    example: 1,
  })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  work_hour_id: number;
}

export class OffDayParamDto extends ConsultantParamDto {
  @ApiProperty({
    description: 'Off Day ID',
    example: 1,
  })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  off_day_id: number;
}