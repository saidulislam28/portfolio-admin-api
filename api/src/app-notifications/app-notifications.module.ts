import { Module } from '@nestjs/common';

import { AppNotificationsService } from './app-notifications.service';

@Module({
  providers: [AppNotificationsService],
  exports: [AppNotificationsService],
})
export class AppNotificationsModule {}