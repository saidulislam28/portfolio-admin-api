/* eslint-disable */
import { Body, Controller, Get, Patch, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiBody } from "@nestjs/swagger";
import { res } from "src/common/response.helper";
import { Role } from "src/user-auth/dto/role.enum";
import { HasRoles } from "src/user-auth/jwt/has-roles.decorator";
import { JwtAuthGuard } from "src/user-auth/jwt/jwt-auth.guard";
import { RolesGuard } from "src/user-auth/jwt/roles.guard";

import { UserDashBoardService } from "./app-user-management.service";
import { UpdateUserPasswordDto, UpdateUserProfileDto, UserProfileResponseDto } from "./dto/user.profile.dto";

@ApiTags('User: User Profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@HasRoles(Role.User)
@Controller('user-profile')
export class UserDashBoardController {
    constructor(
        private readonly userDashboardService: UserDashBoardService
    ) { }

    @Get('user')
    @ApiOperation({ summary: 'Get user profile', description: 'Retrieve the authenticated user profile information' })
    @ApiResponse({
        status: 200,
        description: 'User profile retrieved successfully',
        type: UserProfileResponseDto
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async userProfile(@Req() req) {
        const { id } = req.user;
        const response = await this.userDashboardService.getUser(+id)
        return res.success(response);
    }

    @Patch('update')
    @ApiOperation({ summary: 'Update user profile', description: 'Update the authenticated user profile information' })
    @ApiBody({ type: UpdateUserProfileDto })
    @ApiResponse({
        status: 200,
        description: 'User profile updated successfully',
        type: UserProfileResponseDto
    })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async updateUserProfile(
        @Req() req: any,
        @Body() data: UpdateUserProfileDto
    ) {

        const { id } = req.user;
        const response = await this.userDashboardService.updateUserProfile(
            data,
            +id,
        );

        return { success: true, data: response };
    }

    @Patch('update-password')
    @ApiOperation({ summary: 'Update user password', description: 'Update the authenticated user password' })
    @ApiBody({ type: UpdateUserPasswordDto })
    @ApiResponse({
        status: 200,
        description: 'Password updated successfully',
        type: UserProfileResponseDto
    })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized - Current password incorrect' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async updateUserPassword(
        @Req() req: any,
        @Body() data: UpdateUserPasswordDto
    ) {
        const { id } = req.user;
        const response = await this.userDashboardService.updateUserPassword(data, Number(id));
        return res.success(response);
    }
}