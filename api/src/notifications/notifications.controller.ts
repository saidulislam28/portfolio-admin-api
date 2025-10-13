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

  @Post('consultant-start-call')
  @ApiOperation({ summary: 'Send push notification when consultant starts a call. Triggers call dialog on user app' })
  @ApiBody({ 
    type: SendCallingNotificationDto,
    description: 'Appointment ID for the call' 
  })
  @ApiResponse({ status: 200, description: 'Call start notification sent successfully.' })
  @ApiResponse({ status: 404, description: 'Appointment or user not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error during sending.' })
  async consultantStartCall(@Body() payload: SendCallingNotificationDto) {
    try {
      await this.notificationService.sendConsultantStartCallNotification(payload);
      return res.success(true);
    } catch (error) {
      console.log('Notification send error', error);
      return res.error('Error sending call notification');
    }
  }

  @Post('consultant-end-call')
  @ApiOperation({ summary: 'Send push notification when consultant ends a call' })
  @ApiBody({ 
    type: SendCallingNotificationDto,
    description: 'Appointment ID for the call' 
  })
  @ApiResponse({ status: 200, description: 'Call end notification sent successfully.' })
  @ApiResponse({ status: 404, description: 'Appointment or user not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error during sending.' })
  async consultantEndCall(@Body() payload: SendCallingNotificationDto) {
    try {
      await this.notificationService.sendConsultantEndCallNotification(payload);
      return res.success(true);
    } catch (error) {
      console.log('Notification send error', error);
      return res.error('Error sending call end notification');
    }
  }

  @Post('user-start-call')
  @ApiOperation({ summary: 'Send push notification when user starts a call. Triggers call dialog on consultant app' })
  @ApiBody({ 
    type: SendCallingNotificationDto,
    description: 'Appointment ID for the call' 
  })
  @ApiResponse({ status: 200, description: 'Call start notification sent successfully.' })
  @ApiResponse({ status: 404, description: 'Appointment or consultant not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error during sending.' })
  async userStartCall(@Body() payload: SendCallingNotificationDto) {
    try {
      await this.notificationService.sendUserStartCallNotification(payload);
      return res.success(true);
    } catch (error) {
      console.log('Notification send error', error);
      return res.error('Error sending call notification');
    }
  }

  @Post('user-end-call')
  @ApiOperation({ summary: 'Send push notification when user ends a call' })
  @ApiBody({ 
    type: SendCallingNotificationDto,
    description: 'Appointment ID for the call' 
  })
  @ApiResponse({ status: 200, description: 'Call end notification sent successfully.' })
  @ApiResponse({ status: 404, description: 'Appointment or consultant not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error during sending.' })
  async userEndCall(@Body() payload: SendCallingNotificationDto) {
    try {
      await this.notificationService.sendUserEndCallNotification(payload);
      return res.success(true);
    } catch (error) {
      console.log('Notification send error', error);
      return res.error('Error sending call end notification');
    }
  }




}