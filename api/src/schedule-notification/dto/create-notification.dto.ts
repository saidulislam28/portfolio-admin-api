import { NotificationChannel, NotificationType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsObject } from 'class-validator';

export class CreateNotificationDto {
    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @IsDate()
    @Type(() => Date)
    sendAt: Date;

    @IsEnum(NotificationType)
    type: NotificationType;

    @IsEnum(NotificationChannel)
    channel: NotificationChannel;

    @IsObject()
    payload: Record<string, any>;

    @IsNotEmpty()
    maxAttempts?: number = 3;
}