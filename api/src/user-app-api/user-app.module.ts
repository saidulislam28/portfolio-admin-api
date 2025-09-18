/* eslint-disable */
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { QUEUE_NAME } from 'src/common/constants';
import { PrismaService } from 'src/prisma/prisma.service';
import { ScheduleNotificationsModule } from 'src/schedule-notification/schedule-notifications.module';
import { OrdersService } from 'src/user-dashboard/services/orders.service';
import { UserService } from 'src/user-dashboard/services/user.service';

import { AppSettingsController } from './controllers/app-setting.controller';
import { BookApiController } from './controllers/appBooks.controller';
import { RatingsController } from './controllers/appointment-rating.controller';
import { AppointmentsController } from './controllers/appointments.controller';
import { OrdersController } from './controllers/orders.controller';
import { PackagesController } from './controllers/package.controller';
import { PaymentController } from './controllers/payment.controller';
import { AppSettingService } from './services/app-setting.service';
import { BookApiService } from './services/appBooks.service';
import { RatingsService } from './services/appointment-rating.service';
import { AppointmentsService } from './services/appointments.service';
import { PackagesService } from './services/package.service';
import { PaymentService } from './services/payment.service';

@Module({
    imports: [ScheduleNotificationsModule, ConfigModule,
        BullModule.registerQueueAsync({ name: QUEUE_NAME, }),
    ],
    controllers: [AppointmentsController, BookApiController, PaymentController, PackagesController, AppSettingsController,
        OrdersController, RatingsController
    ],
    providers: [AppointmentsService, PrismaService, AppSettingService, BookApiService, PaymentService, PackagesService, OrdersService, UserService, RatingsService],
    exports: [AppointmentsService],
})
export class UserAppModule { }