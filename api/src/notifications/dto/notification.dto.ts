import { USER_ROLE } from '@prisma/client';
import {
  IsArray,
  IsNotEmpty,
  IsString,
  ArrayNotEmpty,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RECIPIENT_TYPE } from 'src/common/constants';

export class SendNotificationDto {
  @ApiProperty({
    description: 'The title of the notification',
    example: 'New Message',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'The body/message content of the notification',
    example: 'You have a new message from John.',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    description: 'Recipient type: either "User" or "Consultant"',
    enum: RECIPIENT_TYPE,
    example: 'User',
  })
  @IsEnum(RECIPIENT_TYPE)
  recipient_type: 'User' | 'Consultant';

  @ApiPropertyOptional({
    description: 'List of specific user IDs to send notification to (if not sending to all)',
    type: [Number],
    example: [1, 2, 3],
  })
  @IsOptional()
  @IsArray()
  selected_users?: number[];

  @ApiProperty({
    description: 'Whether to send notification to all users (overrides selected_users if true)',
    type: Boolean,
    example: false,
  })
  @IsBoolean()
  all_user: boolean;
}

export class SendAllUserDto {
  @ApiProperty({
    description: 'Title of the broadcast notification',
    example: 'System Maintenance',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Message body of the broadcast notification',
    example: 'The system will be down for maintenance at 2 AM.',
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}

export class SendCallingNotificationDto {
  @ApiProperty({
    description: 'ID of the appointment',
    example: 123,
  })
  @IsNumber()
  @IsNotEmpty()
  appointment_id: number;
}