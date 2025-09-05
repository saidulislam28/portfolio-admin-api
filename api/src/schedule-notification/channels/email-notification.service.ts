import { Injectable, Logger } from '@nestjs/common';
import { NotificationChannelService } from '../interfaces/notification-channel.interface';
import { ScheduleNotification } from '@prisma/client';
import EmailService from 'src/email/email.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EmailNotificationService implements NotificationChannelService {
    private readonly logger = new Logger(EmailNotificationService.name);

    constructor(
        private emailService: EmailService,
        private prisma: PrismaService
    ) { }

    async send(notification: ScheduleNotification): Promise<{ success: boolean; error?: string }> {
        try {
            const { user_id, payload }: any = notification;
            const user = await this.prisma.user.findFirst({ where: { id: user_id } });

            if (!user) {
                throw new Error("User not found: " + user_id);
            }
            await this.emailService.sendEmail(user.email, payload?.title, payload?.body);

            return { success: true };
        } catch (error) {
            this.logger.error(`Failed to send email notification: ${error.message}`);
            return { success: false, error: error.message };
        }
    }
}