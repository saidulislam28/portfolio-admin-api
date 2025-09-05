import { BullModule } from '@nestjs/bull';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { QUEUE_NAME } from 'src/common/constants';

import EmailService from './email.service';
import SmsService from "./sms.service";

@Global()
@Module({
  imports: [
    ConfigModule,
    BullModule.registerQueueAsync({
      name: QUEUE_NAME,
    }),
  ],
  controllers: [],
  providers: [
    EmailService,
    SmsService,
  ],
  exports: [
    EmailService,
    SmsService,
  ],
})
export class EmailModule { }