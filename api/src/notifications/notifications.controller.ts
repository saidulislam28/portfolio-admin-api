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
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { res } from 'src/common/response.helper';
import { OptionalJwtAuthGuard } from 'src/user-auth/jwt/optional-jwt-auth.guard';
import {
  SendAllUserDto,
  SendCallingNotificationDto,
  SendNotificationDto,
} from './dto/notification.dto';
import { NotificationService } from './notifications.service';

@ApiTags('Notifications')
@UseGuards(OptionalJwtAuthGuard)
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('send')
  @ApiOperation({ summary: 'Send notification to specific users or roles' })
  @ApiBody({ type: SendNotificationDto })
  @ApiResponse({ status: 200, description: 'Notification sent successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async sendToUser(@Body() sendNotificationDto: SendNotificationDto) {
    const response = await this.notificationService.sendNotification(sendNotificationDto);
    return res.success(response);
  }

  @Post('send-to-all')
  @ApiOperation({ summary: 'Send notification to all users' })
  @ApiBody({ type: SendAllUserDto })
  @ApiResponse({ status: 200, description: 'Broadcast notification sent successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async sendToAll(@Body() sendNotificationDto: SendAllUserDto) {
    const response = await this.notificationService.sendToAllUsers(sendNotificationDto);
    return res.success(response);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all notifications for a specific user' })
  @ApiParam({
    name: 'userId',
    type: Number,
    description: 'ID of the user to fetch notifications for',
    example: 123,
  })
  @ApiResponse({ status: 200, description: 'List of notifications retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async getUserNotifications(@Param('userId', ParseIntPipe) user_id: number) {
    const response = await this.notificationService.getUserNotifications(user_id);
    return res.success(response);
  }

  @Patch('mark-as-read/:notificationId')
  @ApiOperation({ summary: 'Mark a notification as read' })
  @ApiParam({
    name: 'notificationId',
    type: Number,
    description: 'ID of the notification to mark as read',
    example: 456,
  })
  @ApiResponse({ status: 200, description: 'Notification marked as read.' })
  @ApiResponse({ status: 404, description: 'Notification not found.' })
  async markAsRead(@Param('notificationId', ParseIntPipe) notificationId: number) {
    const response = await this.notificationService.markAsRead(notificationId);
    return res.success(response);
  }

  @Post('start-call')
  @ApiOperation({ summary: 'Send a push notification to user when a consultant starts a call. This data push will be used to show the call \
    dialog on user app' })
  @ApiBody({ type: SendCallingNotificationDto })
  @ApiResponse({ status: 200, description: 'Calling notification sent successfully.' })
  @ApiResponse({ status: 500, description: 'Internal server error during sending.' })
  async sendCallNotification(@Body() payload: SendCallingNotificationDto) {
    try {
      await this.notificationService.sendCallNotification(payload);
      return res.success(true);
    } catch (error) {
      console.log('Notification send', error);
      return res.error('Error');
    }
  }
}