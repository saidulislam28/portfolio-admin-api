import { IsOptional, IsDateString, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class GetAppointmentsQueryDto {
  @ApiPropertyOptional({
    description: 'Filter appointments by specific date (YYYY-MM-DD format)',
    example: '2025-08-25',
    type: String,
  })
  @IsOptional()
  @IsDateString()
  date?: string;
}