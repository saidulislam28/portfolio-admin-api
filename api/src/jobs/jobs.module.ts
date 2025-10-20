// import { BullAdapter } from '@bull-board/api/bullAdapter';
// import { BullBoardModule } from '@bull-board/nestjs';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { QUEUE_NAME } from '../common/constants';
import { FcmModule } from 'src/fcm/fcm.module';
import { TimezoneModule } from 'src/timezone/timezone.module';
import { UserCacheModule } from 'src/user-cache/user-cache.module';

@Module({
    imports: [
        BullModule.registerQueue({
            name: QUEUE_NAME,
        }),
        // BullBoardModule.forFeature({
        //     name: QUEUE_NAME,
        //     adapter: BullAdapter, //or use BullAdapter if you're using bull instead of bullMQ
        // }),
        FcmModule,
        TimezoneModule,
        UserCacheModule,
    ],
    providers: [
    ],
    controllers: [
    ],
    exports: [
    ]
})
export class JobsModule {
}