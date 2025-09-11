import { ApiProperty } from '@nestjs/swagger';

export class SlotTimeDto {
  @ApiProperty({ example: '09:00', description: '24-hour time format' })
  time: string;

  @ApiProperty({ example: '9:00 AM', description: '12-hour time format' })
  time_12h: string;

  @ApiProperty({ example: false, description: 'True if the slot is fully booked' })
  is_booked: boolean;

  @ApiProperty({ example: 8, description: 'Number of available slots' })
  available_slots: number;

  @ApiProperty({ example: 10, description: 'Total slots for this time' })
  total_slots: number;
}

export class DaySlotsDto {
  @ApiProperty({ example: '2025-05-27', description: 'The date in YYYY-MM-DD format' })
  date: string;

  @ApiProperty({ example: 'Tuesday', description: 'The name of the day' })
  day_name: string;

  @ApiProperty({ type: [SlotTimeDto], description: 'List of available slots for the day' })
  slots: SlotTimeDto[];
}

export class GetSlotsMetaDto {
  @ApiProperty({ example: 'America/New_York', description: 'The timezone used to generate the slots' })
  timezone: string;

  @ApiProperty({ example: '2025-05-27T10:30:00Z', description: 'Timestamp when the response was generated' })
  generated_at: string;

  @ApiProperty({ example: 21, description: 'Total number of days returned' })
  total_days: number;
}

export class GetSlotsResponseDto {
  @ApiProperty({ example: true, description: 'Indicates if the request was successful' })
  success: boolean;

  @ApiProperty({ type: [DaySlotsDto], description: 'List of days with their available slots' })
  data: DaySlotsDto[];

  @ApiProperty({ type: GetSlotsMetaDto, description: 'Metadata about the response' })
  meta: GetSlotsMetaDto;
}