/* eslint-disable */
import { Controller, Get, UseGuards } from '@nestjs/common';
import {
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags
} from '@nestjs/swagger';
import { res } from 'src/common/response.helper';

import { LiveAppointmentsResponseDto } from '../dtos/live-appointment.dto';
import { LiveAppointmentService } from '../services/live-appointment.service';
import { HasRoles } from "src/user-auth/jwt/has-roles.decorator";
import { Role } from "src/user-auth/dto/role.enum";
import { JwtAuthGuard } from "src/user-auth/jwt/jwt-auth.guard";
import { RolesGuard } from "src/user-auth/jwt/roles.guard";

@HasRoles(Role.Admin)
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Admin: Live Appointments')
@Controller('live-appointments')
export class LiveAppointmentController {
    constructor(private readonly liveAppointmentService: LiveAppointmentService) { }

    @Get()
    @ApiOperation({
        summary: 'Get live appointments',
        description: 'Retrieves currently active appointments and today\'s appointment count. '
    })
    @ApiOkResponse({
        type: LiveAppointmentsResponseDto,
        description: 'Live appointments and today\'s count retrieved successfully'
    })
    @ApiInternalServerErrorResponse({ description: 'Internal server error while fetching live appointments' })
    async getLiveAppointments() {
        const response = await this.liveAppointmentService.getLiveAppointments();
        return res.success(response)
    }
}