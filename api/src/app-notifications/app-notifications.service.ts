import { BadRequestException,Injectable, Logger } from '@nestjs/common';
import { Notification, NotificationType,Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationResponseDto } from './dto/notification-response.dto';

@Injectable()
export class AppNotificationsService {
  private readonly logger = new Logger(AppNotificationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createNotification(
    createNotificationDto: CreateNotificationDto,
  ): Promise<NotificationResponseDto> {
    // Validate that exactly one of userId or consultantId is provided
    if (
      (createNotificationDto.userId === undefined || createNotificationDto.userId === null) &&
      (createNotificationDto.consultantId === undefined || createNotificationDto.consultantId === null)
    ) {
      throw new BadRequestException('Either userId or consultantId must be provided');
    }

    if (
      createNotificationDto.userId !== undefined &&
      createNotificationDto.userId !== null &&
      createNotificationDto.consultantId !== undefined &&
      createNotificationDto.consultantId !== null
    ) {
      throw new BadRequestException('Only one of userId or consultantId should be provided');
    }

    try {
      const notification = await this.prisma.notification.create({
        data: {
          title: createNotificationDto.title,
          message: createNotificationDto.message,
          user_id: createNotificationDto.userId ?? null,
          consultant_id: createNotificationDto.consultantId ?? null,
          meta: createNotificationDto.meta as Prisma.InputJsonValue,
          type: createNotificationDto.type ?? NotificationType.GENERAL,
        },
      });

      return this.mapToResponseDto(notification);
    } catch (error) {
      this.logger.error('Failed to create notification', error);
      throw error;
    }
  }

  // Helper methods for user notifications
  async createAppointmentReminderForUser(
    userId: number,
    message: string,
    meta?: any,
  ): Promise<NotificationResponseDto> {
    return this.createNotification({
      userId,
      message,
      type: NotificationType.APPOINTMENT_REMINDER,
      meta,
    });
  }

  async createPaymentReminderForUser(
    userId: number,
    message: string,
    meta?: any,
  ): Promise<NotificationResponseDto> {
    return this.createNotification({
      userId,
      message,
      type: NotificationType.PAYMENT_REMINDER,
      meta,
    });
  }

  async createGeneralNotificationForUser(
    userId: number,
    title: string,
    message: string,
    meta?: any,
  ): Promise<NotificationResponseDto> {
    return this.createNotification({
      userId,
      title,
      message,
      type: NotificationType.GENERAL,
      meta,
    });
  }

  // Helper methods for consultant notifications
  async createAppointmentReminderForConsultant(
    consultantId: number,
    message: string,
    meta?: any,
  ): Promise<NotificationResponseDto> {
    return this.createNotification({
      consultantId,
      message,
      type: NotificationType.APPOINTMENT_REMINDER,
      meta,
    });
  }

  async createPaymentReminderForConsultant(
    consultantId: number,
    message: string,
    meta?: any,
  ): Promise<NotificationResponseDto> {
    return this.createNotification({
      consultantId,
      message,
      type: NotificationType.PAYMENT_REMINDER,
      meta,
    });
  }

  async createGeneralNotificationForConsultant(
    consultantId: number,
    title: string,
    message: string,
    meta?: any,
  ): Promise<NotificationResponseDto> {
    return this.createNotification({
      consultantId,
      title,
      message,
      type: NotificationType.GENERAL,
      meta,
    });
  }

  private mapToResponseDto(notification: Notification): NotificationResponseDto {
    return {
      id: notification.id,
      title: notification.title,
      message: notification.message,
      isRead: notification.isRead,
      userId: notification.user_id,
      meta: notification.meta,
      type: notification.type,
      consultantId: notification.consultant_id,
      createdAt: notification.created_at,
      updatedAt: notification.updated_at,
    };
  }
}