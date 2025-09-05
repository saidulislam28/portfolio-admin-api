import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { ScheduleNotification } from '@prisma/client';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { ScheduleNotificationService } from './schedule-notification.service';

@Controller('c')
export class ScheduleNotificationsController {
    constructor(private readonly notificationService: ScheduleNotificationService) { }

    @Post()
    @ApiCreatedResponse({ description: 'Notification scheduled successfully' })
    async create(@Body() createNotificationDto: CreateNotificationDto): Promise<ScheduleNotification> {
        return this.notificationService.createNotification(createNotificationDto);
        // return res.success(response);
    }
}