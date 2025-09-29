// src/notifications/dto/mark-as-read.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, Min } from 'class-validator';

export class MarkAsReadDto {
  @ApiProperty({
    description: 'Array of notification IDs to mark as read',
    example: [1, 2, 3],
  })
  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  notificationIds: number[];
}