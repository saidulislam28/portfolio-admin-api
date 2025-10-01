import { NotificationType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CreateNotificationDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @ValidateIf((o) => o.consultantId === undefined)
  @IsInt()
  @Type(() => Number)
  userId?: number;

  @ValidateIf((o) => o.userId === undefined)
  @IsInt()
  @Type(() => Number)
  consultantId?: number;

  @IsOptional()
  @IsNotEmptyObject()
  meta?: any;

  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;
}