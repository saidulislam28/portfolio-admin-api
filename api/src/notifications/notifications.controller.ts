// src/notification/notification.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { res } from 'src/common/response.helper';
import { OptionalJwtAuthGuard } from 'src/user-auth/jwt/optional-jwt-auth.guard';
import { SendAllUserDto, SendCallingNotificationDto, SendNotificationDto } from './dto/notification.dto';
import { NotificationService } from './notifications.service';

@UseGuards(OptionalJwtAuthGuard)
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) { }

  @Post('send')
  async sendToUser(@Body() sendNotificationDto: SendNotificationDto) {
    const response = await this.notificationService.sendNotification(sendNotificationDto);
    return res.success(response)
  }

  @Post('send-to-all')
  async sendToAll(@Body() sendNotificationDto: SendAllUserDto) {
    const response = await this.notificationService.sendToAllUsers(sendNotificationDto);
    return res.success(response)
  }

  @Get('user/:userId')
  async getUserNotifications(@Param('id', ParseIntPipe) user_id: number) {
    const response = await this.notificationService.getUserNotifications(user_id);
    return res.success(response)
  }

  @Patch('mark-as-read/:notificationId')
  async markAsRead(@Param('notificationId', ParseIntPipe) notificationId: number) {
    const response = await this.notificationService.markAsRead(notificationId);
    return res.success(response)
  }

  @Post("send/calling")
  async sendCallNotification(@Body() payload: SendCallingNotificationDto) {
    try {
      await this.notificationService.sendCallNotification(payload);
      return res.success(true);
    } catch (error) {
      console.log("Notification send",error)
      return res.error("Error");
    }
  }
}