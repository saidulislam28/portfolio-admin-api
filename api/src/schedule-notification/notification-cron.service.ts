import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationSchedulerService } from './notification-scheduler.service';

@Injectable()
export class NotificationCronService {
  private readonly logger = new Logger(NotificationCronService.name);

  constructor(
    private readonly schedulerService: NotificationSchedulerService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    this.logger.debug('Running notification scheduler cron job');
    try {
      await this.schedulerService.processPendingNotifications();
    } catch (error) {
      this.logger.error(`Error in notification cron job: ${error.message}`);
    }
  }
}