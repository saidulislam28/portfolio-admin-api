/* eslint-disable */
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { QUEUE_NAME } from 'src/common/constants';
import { PrismaService } from 'src/prisma/prisma.service';

import { AppSettingsController } from './controllers/app-setting.controller';
import { AppSettingService } from './services/app-setting.service';

@Module({
    imports: [ConfigModule,
        BullModule.registerQueueAsync({ name: QUEUE_NAME, }),
    ],
    controllers: [AppSettingsController,

    ],
    providers: [PrismaService, AppSettingService],
    exports: [],
})
export class UserAppModule { }