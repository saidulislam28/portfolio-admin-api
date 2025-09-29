/* eslint-disable  */
// src/notifications/dto/get-notifications.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';

export class GetNotificationsDto {
  @ApiProperty({
    required: false,
    default: 1,
    description: 'Page number',
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({
    required: false,
    default: 10,
    description: 'Number of items per page',
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;

  @ApiProperty({
    required: false,
    enum: NotificationType,
    description: 'Filter by notification type',
  })
  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;

  @ApiProperty({
    required: false,
    description: 'Filter by read status',
  })
  @IsOptional()
  @Type(() => Boolean)
  isRead?: boolean;
}