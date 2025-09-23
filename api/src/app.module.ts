/* eslint-disable */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { BullModule } from '@nestjs/bull';
import { AdminAuthModule } from './admin-auth/admin-auth.module';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AttachmentsModule } from './attachments/attachments.module';
import { QUEUE_NAME } from './common/constants';
import configuration from './config';
import { CrudModule } from './crud/crud.module';
import { EmailModule } from './email/email.module';
import { PrismaModule } from './prisma/prisma.module';

import { UsersController } from './user-dashboard/controllers/user.controller';


import { AdminDashboardModule } from './admin-dashboard-api/admin-dashboard.module';
import { AdminReportModule } from './admin-reports/admin-reports.module';
import { AppAgoraModule } from './app-agora/app-agora.module';
import { ConSultantModule } from './consaltant/consultant.module';
import { ConsultantAppModule } from './consultant-dashboard/consultant-dashboard.module';
import { NotificationModule } from './notifications/notifications.module';
import { ScheduleNotificationsModule } from './schedule-notification/schedule-notifications.module';
import { UserAppModule } from './user-app-api/user-app.module';
import { UserDashboardModule } from './user-dashboard/user-dashboard.module';
import { AuthModule } from './user/auth.module';
import { JobsModule } from './jobs/jobs.module';
import { FcmModule } from './fcm/fcm.module';
import { UserDashBoardController } from './user/app-user-management.controller';
import { UserDashBoardService } from './user/app-user-management.service';
import { UserCacheModule } from './user-cache/user-cache.module';
import { TimezoneModule } from './timezone/timezone.module';
import { CommonModule } from './common/common.module';
import { CacheModule } from '@nestjs/cache-manager';
import { UserAuthModule } from './user-auth/user-auth.module';
import { WebsiteModule } from './website/website.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASS
      },
    }),
    BullModule.registerQueueAsync(
      {
        name: QUEUE_NAME,
      }
    ),
    CacheModule.register({
      ttl: 5 * 1000, // Cache expiration time in milliseconds (5 seconds)
      max: 100, // Maximum number of items in cache
      isGlobal: true, // Make the cache module available globally
    }),
    PrismaModule,
    CrudModule,
    AttachmentsModule,
    AdminModule,
    EmailModule,
    AdminAuthModule,
    ConSultantModule,
    AuthModule,
    NotificationModule,
    AppAgoraModule,
    ScheduleNotificationsModule,
    AdminDashboardModule,
    ConsultantAppModule,
    UserAppModule,
    AdminReportModule,
    UserDashboardModule,
    JobsModule,
    FcmModule,
    UserCacheModule,
    TimezoneModule,
    CommonModule,
    UserAuthModule,
    WebsiteModule
  ],
  controllers: [AppController, UsersController, UserDashBoardController],
  providers: [AppService, UserDashBoardService],
})
export class AppModule { }
