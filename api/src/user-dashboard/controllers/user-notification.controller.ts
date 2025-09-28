// src/notifications/notifications.controller.ts
import {
    Controller,
    Get,
    Put,
    Delete,
    Body,
    Query,
    UseGuards,
    HttpCode,
    HttpStatus,
    Req,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/user-auth/jwt/jwt-auth.guard';
import { NotificationsService } from '../services/user-notification.service';
import { PaginatedNotificationsDto } from '../dto/paginated-notifications.dto';
import { GetNotificationsDto } from '../dto/get-notifications.dto';
import { MarkAsReadDto } from '../dto/mark-as-read.dto';
import { DeleteNotificationsDto } from '../dto/delete-notifications.dto';


@ApiTags('notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Get()
    @ApiOperation({
        summary: 'Get user notifications',
        description: 'Returns paginated notifications for the authenticated user, sorted by latest first.',
    })
    @ApiResponse({
        status: 200,
        description: 'Notifications retrieved successfully',
        type: PaginatedNotificationsDto,
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getUserNotifications(
        @Req() req: any,
        @Query() dto: GetNotificationsDto,
    ) {
        const { id } = req.user;
        return this.notificationsService.getUserNotifications(id, dto);
    }

    @Put('mark-as-read')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Mark notifications as read',
        description: 'Marks multiple notifications as read by their IDs. All notifications must belong to the authenticated user.',
    })
    @ApiResponse({
        status: 200,
        description: 'Notifications marked as read successfully',
        schema: {
            example: {
                message: 'Notifications marked as read successfully',
                count: 3,
            },
        },
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'One or more notifications not found' })
    async markAsRead(
        @Req() req: any,
        @Body() dto: MarkAsReadDto,
    ) {
        const { id } = req.user;
        return this.notificationsService.markAsRead(id, dto);
    }

    @Delete()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Delete notifications',
        description: 'Deletes multiple notifications by their IDs. All notifications must belong to the authenticated user.',
    })
    @ApiResponse({
        status: 200,
        description: 'Notifications deleted successfully',
        schema: {
            example: {
                message: 'Notifications deleted successfully',
                count: 2,
            },
        },
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'One or more notifications not found' })
    async deleteNotifications(
        @Req() req: any,
        @Body() dto: DeleteNotificationsDto,
    ) {
         const { id } = req.user;
        return this.notificationsService.deleteNotifications(id, dto);
    }
}