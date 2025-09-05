import { Module } from '@nestjs/common';
import { FcmPushService } from './fcm.push.service';

@Module({
  providers: [
    FcmPushService,
  ],
  exports: [
    FcmPushService,
  ],
})
export class FcmModule {}
