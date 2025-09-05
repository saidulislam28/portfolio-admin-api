// src/orders/orders.controller.ts
import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiBearerAuth
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { JwtAuthGuard } from 'src/user-auth/jwt/jwt-auth.guard';
import { RolesGuard } from 'src/user-auth/jwt/roles.guard';
import { GroupedOrdersResponseDto } from '../dto/group-order.dto';
import { UserOrdersService } from '../services/group-order.service';

@ApiTags('User: User orders')
@ApiBearerAuth()
@Controller('user/orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserOrdersController {
    constructor(private readonly userOrdersService: UserOrdersService) { }

    @Get('/grouped-by-service-type')
    @ApiOperation({
        summary: 'Get user orders grouped by service type',
        description: 'Retrieves all orders for the authenticated user, grouped by service type (IELTS_ACADEMIC, CONVERSATION, etc.)'
    })
    @ApiResponse({
        status: 200,
        description: 'Orders retrieved successfully',
        type: GroupedOrdersResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - invalid or missing token',
    })
    @ApiResponse({
        status: 404,
        description: 'User not found',
    })
    async getUserOrdersGroupedByServiceType(
        @Req() req
    ): Promise<GroupedOrdersResponseDto> {
        const { id } = req.user;
        const response = await this.userOrdersService.getUserOrdersGroupedByServiceType(+id);
        return response;
    }

    // @Get('/:userId/grouped-by-service-type')
    // @ApiOperation({
    //     summary: 'Get specific user orders grouped by service type (Admin only)',
    //     description: 'Retrieves all orders for a specific user, grouped by service type. Requires admin privileges.'
    // })
    // @ApiParam({
    //     name: 'userId',
    //     description: 'ID of the user whose orders to retrieve',
    //     example: 1,
    //     type: Number,
    // })
    // @ApiResponse({
    //     status: 200,
    //     description: 'Orders retrieved successfully',
    //     type: GroupedOrdersResponseDto,
    // })
    // @ApiResponse({
    //     status: 401,
    //     description: 'Unauthorized - invalid or missing token',
    // })
    // @ApiResponse({
    //     status: 403,
    //     description: 'Forbidden - requires admin role',
    // })
    // @ApiResponse({
    //     status: 404,
    //     description: 'User not found',
    // })
    // async getUserOrdersByIdGroupedByServiceType(
    //     @Param('userId') userId: number
    // ): Promise<GroupedOrdersResponseDto> {
    //     // Note: You should add admin role validation here
    //     return this.userOrdersService.getUserOrdersGroupedByServiceType(userId);
    // }
}