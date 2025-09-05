import { Type, Transform } from 'class-transformer';
import { IsString, IsOptional, IsNumber, IsArray, ValidateNested, IsISO8601 } from 'class-validator';

// DTOs for validation
export class CreateAppointmentDto {
  @IsISO8601()
  start_at: string;

  @IsISO8601()
  end_at: string;

  @IsOptional()
  @IsNumber()
  consultant_id?: number;

  @IsOptional()
  @IsNumber()
  user_id?: number;

  @IsNumber()
  order_id: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsString()
  user_timezone: string;
}

export class CreateAppointmentsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAppointmentDto)
  appointments: CreateAppointmentDto[];
}

export class GetSlotsQueryDto {
  @IsOptional()
  @IsString()
  timezone?: string = 'UTC';
}
