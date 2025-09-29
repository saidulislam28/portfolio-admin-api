/* eslint-disable  */
// src/notifications/notifications.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetNotificationsDto } from '../dto/get-notifications.dto';
import { MarkAsReadDto } from '../dto/mark-as-read.dto';
import { DeleteNotificationsDto } from '../dto/delete-notifications.dto';


@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) { }

  async getUserNotifications(userId: number, dto: GetNotificationsDto) {

    const { page, limit, type, isRead } = dto;
    const skip = (page - 1) * limit;

    const where = {
      user_id: userId,
      ...(type && { type }),
      ...(isRead !== undefined && { isRead }),
    };

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          created_at: 'desc',
        },
        include: {
          Consultant: {
            select: {
              id: true,
              full_name: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.notification.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      data: notifications,
      total,
      page,
      limit,
      totalPages,
      hasNext,
      hasPrev,
    };
  }

  async markAsRead(userId: number, dto: MarkAsReadDto) {
    const { notificationIds } = dto;

    // Verify that all notifications belong to the user
    const notifications = await this.prisma.notification.findMany({
      where: {
        id: { in: notificationIds },
        user_id: userId,
      },
      select: { id: true },
    });

    const foundIds = notifications.map(notification => notification.id);
    const notFoundIds = notificationIds.filter(id => !foundIds.includes(id));

    if (notFoundIds.length > 0) {
      throw new NotFoundException(
        `Notifications not found or don't belong to user: ${notFoundIds.join(', ')}`,
      );
    }

    await this.prisma.notification.updateMany({
      where: {
        id: { in: notificationIds },
        user_id: userId,
      },
      data: {
        isRead: true,
        updated_at: new Date(),
      },
    });

    return {
      message: 'Notifications marked as read successfully',
      count: notificationIds.length,
    };
  }

  async deleteNotifications(userId: number, dto: DeleteNotificationsDto) {
    const { notificationIds } = dto;

    // Verify that all notifications belong to the user
    const notifications = await this.prisma.notification.findMany({
      where: {
        id: { in: notificationIds },
        user_id: userId,
      },
      select: { id: true },
    });

    const foundIds = notifications.map(notification => notification.id);
    const notFoundIds = notificationIds.filter(id => !foundIds.includes(id));

    if (notFoundIds.length > 0) {
      throw new NotFoundException(
        `Notifications not found or don't belong to user: ${notFoundIds.join(', ')}`,
      );
    }

    await this.prisma.notification.deleteMany({
      where: {
        id: { in: notificationIds },
        user_id: userId,
      },
    });

    return {
      message: 'Notifications deleted successfully',
      count: notificationIds.length,
    };
  }
}