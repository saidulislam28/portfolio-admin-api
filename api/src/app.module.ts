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



import { CacheModule } from '@nestjs/cache-manager';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AppAgoraModule } from './app-agora/app-agora.module';
import { CommonModule } from './common/common.module';
import { FcmModule } from './fcm/fcm.module';
import { JobsModule } from './jobs/jobs.module';
import { MetricsService } from './metrics/metrics.service';
import { TimezoneModule } from './timezone/timezone.module';
import { UserAppModule } from './user-app-api/user-app.module';
import { UserAuthModule } from './user-auth/user-auth.module';
import { UserCacheModule } from './user-cache/user-cache.module';
import { AuthModule } from './user/auth.module';
import { WebsiteModule } from './website/website.module';
// import { SentryExceptionFilter } from './common/filters/sentry-exception.filter';

import { HttpLoggingInterceptor } from './metrics/http-logging.interceptor';
import { MetricsController } from './metrics/metrics.controller';

// sentry
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';


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
    AuthModule,
    AppAgoraModule,
    UserAppModule,
    JobsModule,
    FcmModule,
    UserCacheModule,
    TimezoneModule,
    CommonModule,
    UserAuthModule,
    WebsiteModule,
  ],
  controllers: [AppController,  MetricsController],
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
