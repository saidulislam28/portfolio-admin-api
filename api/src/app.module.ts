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


import { CacheModule } from '@nestjs/cache-manager';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AdminDashboardModule } from './admin-dashboard-api/admin-dashboard.module';
import { AdminReportModule } from './admin-reports/admin-reports.module';
import { AppAgoraModule } from './app-agora/app-agora.module';
import { CommonModule } from './common/common.module';
import { ConSultantModule } from './consaltant/consultant.module';
import { ConsultantAppModule } from './consultant-dashboard/consultant-dashboard.module';
import { FcmModule } from './fcm/fcm.module';
import { JobsModule } from './jobs/jobs.module';
import { MetricsService } from './metrics/metrics.service';
import { NotificationModule } from './notifications/notifications.module';
import { ScheduleNotificationsModule } from './schedule-notification/schedule-notifications.module';
import { TimezoneModule } from './timezone/timezone.module';
import { UserAppModule } from './user-app-api/user-app.module';
import { UserAuthModule } from './user-auth/user-auth.module';
import { UserCacheModule } from './user-cache/user-cache.module';
import { UserDashboardModule } from './user-dashboard/user-dashboard.module';
import { AuthModule } from './user/auth.module';
import { WebsiteModule } from './website/website.module';
// import { SentryExceptionFilter } from './common/filters/sentry-exception.filter';

import { HttpLoggingInterceptor } from './metrics/http-logging.interceptor';
import { MetricsController } from './metrics/metrics.controller';

// sentry
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';
import { AppNotificationsModule } from './app-notifications/app-notifications.module';


@Module({
  imports: [
    SentryModule.forRoot(),
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
    WebsiteModule,
    AppNotificationsModule
  ],
  controllers: [AppController, UsersController, MetricsController],
  providers: [
    AppService,
    MetricsService,
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpLoggingInterceptor,
    },
  ],
})
export class AppModule { }
