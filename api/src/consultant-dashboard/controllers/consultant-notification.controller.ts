/* eslint-disable */
// src/notifications/notifications.controller.ts
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Patch,
    Post,
    Query,
    Req,
    UseGuards
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/user-auth/jwt/jwt-auth.guard';
import { DeleteNotificationsDto } from '../dto/delete-notifications.dto';
import { MarkAsReadDto } from '../dto/mark-as-read.dto';
import { PaginatedNotificationsDto } from '../dto/paginated-notifications.dto';
import { RolesGuard } from 'src/user-auth/jwt/roles.guard';
import { HasRoles } from 'src/user-auth/jwt/has-roles.decorator';
import { Role } from 'src/user-auth/dto/role.enum';
import { NotificationsService } from '../services/consultant-notification.service';
import { GetNotificationsDto } from '../dto/get-notifications.dto';


@ApiTags('Consultant Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@HasRoles(Role.Consultant)
@Controller('constultant-notifications')
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

    @Patch('mark-as-read')
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
    @Post('delete')
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
        console.log("deleted idsss", dto);
        const { id } = req.user;
        return this.notificationsService.deleteNotifications(+id, dto);
    }
}