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
import { RolesGuard } from 'src/user-auth/jwt/roles.guard';
import { JwtAuthGuard } from 'src/user-auth/jwt/jwt-auth.guard';

@ApiTags('Admin: Live Appointments')
@Controller('live-appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
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