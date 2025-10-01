import { Injectable, Logger } from '@nestjs/common';
import {
  NotificationChannel,
  ScheduleNotification,
} from '@prisma/client';
import { AppNotificationsService } from 'src/app-notifications/app-notifications.service';

import { EmailNotificationService } from './channels/email-notification.service';
import { PushNotificationService } from './channels/push-notification.service';
import { ScheduleNotificationService } from './schedule-notification.service';

type PushPayload = {
  body: string;
  title?: string;
};

@Injectable()
export class NotificationSchedulerService {
  private readonly logger = new Logger(NotificationSchedulerService.name);
  private readonly channelServices: Record<NotificationChannel, any>;

  constructor(
    private readonly notificationService: ScheduleNotificationService,
    private readonly emailService: EmailNotificationService,
    private readonly pushService: PushNotificationService,
    private readonly appNotificationsService: AppNotificationsService,
    // private readonly smsService: SmsNotificationService,
  ) {
    this.channelServices = {
      EMAIL: emailService,
      PUSH: pushService,
      SMS: '',
      // Add more channels here as needed
    };
  }

  async processPendingNotifications(batchSize = 100): Promise<void> {
    const pendingNotifications: ScheduleNotification[] =
      await this.notificationService.getPendingNotifications(batchSize);

    if (pendingNotifications.length === 0) {
      return;
    }

    this.logger.log(
      `Found ${pendingNotifications.length} pending notifications to process.`,
    );

    // Process notifications in parallel with a limit of concurrency
    await Promise.all(
      pendingNotifications.map((notification) =>
        this.processNotification(notification),
      ),
    );

    this.logger.log('Finished processing batch of pending notifications.');
  }

  private async processNotification(
    notification: ScheduleNotification,
  ): Promise<void> {
    const startTime = Date.now();
    let result: { success: boolean; error?: string };

    // TODO instead of sending synchronously, add to a queue processor

    try {
      const channelService = this.channelServices[notification.channel];
      if (!channelService) {
        throw new Error(`No handler found for channel ${notification.channel}`);
      }

      result = await channelService.send(notification);

      if (result.success) {
        await this.notificationService.markNotificationAsSent(notification.id);
        // create app notifications
        const payload = notification?.payload as PushPayload;

        if (notification.consultant_id) {
          await this.appNotificationsService.createGeneralNotificationForConsultant(
            Number(notification.consultant_id),
            payload?.title,
            payload?.body,
          );
        }
        if (notification.user_id) {
          await this.appNotificationsService.createGeneralNotificationForUser(
            Number(notification.user_id),
            payload?.title,
            payload?.body,
          );
        }
      } else {
        await this.handleFailedNotification(notification, result.error);
      }
    } catch (error) {
      this.logger.error(
        `Unexpected error processing notification ${notification.id}: ${error.message}`,
      );
      await this.handleFailedNotification(notification, error.message);
      result = { success: false, error: error.message };
    } finally {
      const responseTime = Date.now() - startTime;
      await this.notificationService.createNotificationLog(
        notification.id,
        result.success ? 'SENT' : 'FAILED',
        result.error,
        responseTime,
      );
    }
  }

  private async handleFailedNotification(
    notification: any,
    errorMessage: string,
  ): Promise<void> {
    const attemptsLeft = notification.maxAttempts - notification.attempts - 1;

    if (attemptsLeft > 0) {
      this.logger.warn(
        `Notification ${notification.id} failed (${attemptsLeft} attempts left). Will retry. Error: ${errorMessage}`,
      );
      await this.notificationService.markNotificationForRetry(
        notification.id,
        errorMessage,
      );
    } else {
      this.logger.error(
        `Notification ${notification.id} failed after maximum attempts. Marking as failed. Error: ${errorMessage}`,
      );
      await this.notificationService.markNotificationAsFailed(
        notification.id,
        errorMessage,
      );
    }
  }
}
