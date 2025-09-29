// src/notifications/dto/notification-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from '@prisma/client';

export class NotificationResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ required: false })
  title?: string;

  @ApiProperty({ required: false })
  message?: string;

  @ApiProperty({ default: false })
  isRead: boolean;

  @ApiProperty()
  user_id: number;

  @ApiProperty({ type: 'object', required: false })
  meta?: any;

  @ApiProperty({ enum: NotificationType })
  type: NotificationType;

  @ApiProperty({ required: false })
  consultant_id?: number;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}