/* eslint-disable */
import { Injectable, Logger } from '@nestjs/common';

import {
  NotificationStatus,
  ScheduleNotification
} from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class ScheduleNotificationService {
  private readonly logger = new Logger(ScheduleNotificationService.name);

  constructor(private readonly prisma: PrismaService) { }

  async createNotification(
    createNotificationDto: CreateNotificationDto,
  ): Promise<ScheduleNotification> {
    return this.prisma.scheduleNotification.create({
      data: {
        user_id: createNotificationDto.userId,
        sendAt: createNotificationDto.sendAt,
        type: createNotificationDto.type,
        channel: createNotificationDto.channel,
        payload: createNotificationDto.payload,
        maxAttempts: createNotificationDto.maxAttempts,
      },
    });
  }

  async getPendingNotifications(limit = 100): Promise<ScheduleNotification[]> {
    return this.prisma.scheduleNotification.findMany({
      where: {
        status: NotificationStatus.PENDING,
        sendAt: {
          lte: new Date(),
        },
        attempts: {
          lt: this.prisma.scheduleNotification.fields.maxAttempts,
        },
      },
      orderBy: {
        sendAt: 'asc',
      },
      take: limit,
    });
  }

  async markNotificationAsSent(notificationId: number): Promise<ScheduleNotification> {
    return this.prisma.scheduleNotification.update({
      where: { id: notificationId },
      data: {
        status: NotificationStatus.SENT,
        attempts: { increment: 1 },
      },
    });
  }

  async markNotificationAsFailed(
    notificationId: number,
    errorMessage: string,
  ): Promise<ScheduleNotification> {
    return this.prisma.scheduleNotification.update({
      where: { id: notificationId },
      data: {
        status: NotificationStatus.FAILED,
        attempts: { increment: 1 },
      },
    });
  }

  async markNotificationForRetry(
    notificationId: number,
    errorMessage: string,
  ): Promise<ScheduleNotification> {
    return this.prisma.scheduleNotification.update({
      where: { id: notificationId },
      data: {
        status: NotificationStatus.RETRY,
        attempts: { increment: 1 },
      },
    });
  }

  async createNotificationLog(
    notification_id: number,
    status: NotificationStatus,
    error_message?: string,
    response_time?: number,
  ) {
    return this.prisma.notificationLog.create({
      data: {
        notification_id,
        status,
        error_message,
        response_time,
      },
    });
  }
}