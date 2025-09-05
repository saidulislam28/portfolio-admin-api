import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { QUEUE_NAME } from 'src/common/constants';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationController } from './notifications.controller';
import { NotificationService } from './notifications.service';


@Module({
    imports: [
        ConfigModule,
        BullModule.registerQueueAsync({
            name: QUEUE_NAME,
        }),
    ],
    controllers: [NotificationController],
    providers: [NotificationService, PrismaService],
    exports: [NotificationService]
})
export class NotificationModule { }