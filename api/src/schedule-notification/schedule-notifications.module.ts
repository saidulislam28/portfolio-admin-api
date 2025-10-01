import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppNotificationsModule } from 'src/app-notifications/app-notifications.module';
import { NotificationModule } from 'src/notifications/notifications.module';

import { PrismaService } from '../prisma/prisma.service';
import { EmailNotificationService } from './channels/email-notification.service';
import { PushNotificationService } from './channels/push-notification.service';
import { NotificationCronService } from './notification-cron.service';
import { NotificationSchedulerService } from './notification-scheduler.service';
import { ScheduleNotificationService } from './schedule-notification.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    NotificationModule,
    AppNotificationsModule,
  ],
  providers: [
    PrismaService,
    ScheduleNotificationService,
    NotificationSchedulerService,
    NotificationCronService,
    EmailNotificationService,
    PushNotificationService,
  ],
  exports: [ScheduleNotificationService],
})
export class ScheduleNotificationsModule {}
