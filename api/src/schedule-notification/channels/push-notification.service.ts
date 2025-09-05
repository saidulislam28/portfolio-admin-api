import { Injectable, Logger } from '@nestjs/common';
import { NotificationChannelService } from '../interfaces/notification-channel.interface';
import { ScheduleNotification } from '@prisma/client';
import { NotificationService } from 'src/notifications/notifications.service';

@Injectable()
export class PushNotificationService implements NotificationChannelService {
  private readonly logger = new Logger(PushNotificationService.name);
  constructor(private notificationService: NotificationService) {}

  async send(
    notification: ScheduleNotification,
  ): Promise<{ success: boolean; error?: string }> {
    if (notification.user_id) {
      try {
        const { user_id, payload }: any = notification;
        await this.notificationService.sendNotification({
          all_user: false,
          message: payload?.body,
          recipient_type: 'User',
          title: payload?.title,
          selected_users: [user_id],
        });
        return { success: true };
      } catch (error) {
        this.logger.error(`Failed to send push notification: ${error.message}`);
        return { success: false, error: error.message };
      }
    }

    if (notification.consultant_id) {
      try {
        const { consultant_id, payload }: any = notification;
        await this.notificationService.sendNotification({
          all_user: false,
          message: payload?.body,
          recipient_type: 'Consultant',
          title: payload?.title,
          selected_users: [consultant_id],
        });
        return { success: true };
      } catch (error) {
        this.logger.error(`Failed to send push notification: ${error.message}`);
        return { success: false, error: error.message };
      }
    }
  }
}
