import { OnQueueError, Process, Processor } from '@nestjs/bull';
import { Inject,Logger } from '@nestjs/common';
import { Appointment, NotificationChannel, NotificationType } from '@prisma/client';
import { Job } from 'bull';
import { format, subMinutes } from 'date-fns';
import { QUEUE_JOBS, QUEUE_NAME } from 'src/common/constants';
import { FcmPushService } from 'src/fcm/fcm.push.service';
import { getPushTemplate } from 'src/notifications/templates/push-templates';
import { PrismaService } from 'src/prisma/prisma.service';

import { TimezoneService } from '../timezone/interfaces/timezone.interface';
import { UserCacheService } from '../user-cache/interfaces/user-cache.interface';

interface PushNotificationTemplate {
  title: string;
  body: string;
  data?: Record<string, any>;
}

@Processor(QUEUE_NAME)
export class PushNotificationProcessor {
  private readonly logger = new Logger(PushNotificationProcessor.name);
  constructor(
    private fcmPushService: FcmPushService,
    private prisma: PrismaService,
    @Inject('TimezoneService') private timezoneService: TimezoneService,
    @Inject('UserCacheService') private userCacheService: UserCacheService
  ) {}

  @OnQueueError()
  // onError(err: Error) {
  //   // console.log('Queue error', err);
  // }

  @Process(QUEUE_JOBS.NOTIFICATION.ASSIGN_APPOINTMENT)
  async sendPushNotificationAfterAssign(job: Job<{ data: Appointment }>) {
    const { user_id, consultant_id, start_at, Consultant, id }: any = job.data;

    this.logger.log(
      `Sending assignment push notification for appointment #${id}`,
    );

    try {
      // Validate required data
      if (!Consultant?.full_name) {
        this.logger.warn(`Consultant not found for appointment ${id}`);
        return;
      }

      if (!user_id || !consultant_id || !start_at) {
        this.logger.warn(`Missing required data for appointment ${id}`);
        return;
      }

      const consultantName = Consultant.full_name;
      const appointmentId = String(id);

      // Get cached user info for both user and consultant
      const [userInfo, consultantInfo] = await Promise.all([
        this.userCacheService.getUserInfo(Number(user_id), 'user'),
        this.userCacheService.getUserInfo(Number(consultant_id), 'consultant'),
      ]);

      // Format datetime for each user in their timezone
      const [userFormattedStartAt, consultantFormattedStartAt] = await Promise.all([
        this.timezoneService.formatDateTimeForUser(
          new Date(start_at),
          Number(user_id),
          'user'
        ),
        this.timezoneService.formatDateTimeForUser(
          new Date(start_at),
          Number(consultant_id),
          'consultant'
        ),
      ]);

      this.logger.debug(`Formatted times - User: ${userFormattedStartAt}, Consultant: ${consultantFormattedStartAt}`);

      // Generate templates with timezone-specific formatted times
      const userAssignTemplate = getPushTemplate('ASSIGN_USER', {
        consultantName,
        formattedStartAt: userFormattedStartAt,
        appointmentId,
      });

      const consultantAssignTemplate = getPushTemplate('ASSIGN_CONSULTANT', {
        consultantName,
        formattedStartAt: consultantFormattedStartAt,
        appointmentId,
      });

      const userReminderTemplate = getPushTemplate('REMINDER_USER', {
        consultantName,
        formattedStartAt: userFormattedStartAt,
        appointmentId,
      });

      const consultantReminderTemplate = getPushTemplate('REMINDER_CONSULTANT', {
        consultantName,
        formattedStartAt: consultantFormattedStartAt,
        appointmentId,
      });

      // Send immediate assignment notifications
      const notificationPromises: Promise<void>[] = [];

      if (userInfo?.pushToken) {
        notificationPromises.push(
          this.sendFcmNotification(
            [userInfo.pushToken],
            userAssignTemplate,
            `user ${user_id}`
          )
        );
      } else {
        this.logger.warn(`No push token found for user ${user_id}`);
      }

      if (consultantInfo?.pushToken) {
        notificationPromises.push(
          this.sendFcmNotification(
            [consultantInfo.pushToken],
            consultantAssignTemplate,
            `consultant ${consultant_id}`
          )
        );
      } else {
        this.logger.warn(`No push token found for consultant ${consultant_id}`);
      }

      // Wait for notifications to be sent
      await Promise.allSettled(notificationPromises);

      // Schedule reminder notifications (5 minutes before appointment)
      const reminderTime = subMinutes(new Date(start_at), 5);
      
      await this.scheduleReminderNotifications(
        Number(user_id),
        Number(consultant_id),
        userReminderTemplate,
        consultantReminderTemplate,
        reminderTime
      );

      this.logger.log(`Successfully processed appointment assignment for #${id}`);

    } catch (error) {
      this.logger.error(`Error processing appointment assignment for #${id}:`, error);
      throw error; // Re-throw to trigger job retry if configured
    }
  }

  /**
   * Send FCM notification with error handling
   */
  private async sendFcmNotification(
    tokens: string[],
    template: PushNotificationTemplate,
    recipientDescription: string
  ): Promise<void> {
    try {
      await this.fcmPushService.sendFcmPush(
        tokens,
        template.title,
        template.body,
        template.data
      );
      this.logger.debug(`FCM notification sent to ${recipientDescription}`);
    } catch (error) {
      this.logger.error(`Failed to send FCM notification to ${recipientDescription}:`, error);
      throw error;
    }
  }

  /**
   * Schedule reminder notifications in database
   */
  private async scheduleReminderNotifications(
    userId: number,
    consultantId: number,
    userTemplate: PushNotificationTemplate,
    consultantTemplate: PushNotificationTemplate,
    sendAt: Date
  ): Promise<void> {
    try {
      const schedulePromises = [
        this.prisma.scheduleNotification.create({
          data: {
            channel: NotificationChannel.PUSH,
            type: NotificationType.APPOINTMENT_REMINDER,
            user_id: userId,
            payload: {
              title: userTemplate.title,
              body: userTemplate.body,
              data: userTemplate.data || {},
            },
            sendAt,
          },
        }),
        this.prisma.scheduleNotification.create({
          data: {
            channel: NotificationChannel.PUSH,
            type: NotificationType.APPOINTMENT_REMINDER,
            consultant_id: consultantId,
            payload: {
              title: consultantTemplate.title,
              body: consultantTemplate.body,
              data: consultantTemplate.data || {},
            },
            sendAt,
          },
        }),
      ];

      await Promise.all(schedulePromises);
      this.logger.debug(`Scheduled reminder notifications for ${sendAt.toISOString()}`);
    } catch (error) {
      this.logger.error('Failed to schedule reminder notifications:', error);
      throw error;
    }
  }
}
