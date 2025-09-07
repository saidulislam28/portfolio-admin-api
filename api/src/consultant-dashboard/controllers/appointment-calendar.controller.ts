import {
  Controller,
  Get,
  HttpStatus,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/user-auth/jwt/jwt-auth.guard';
import { RolesGuard } from 'src/user-auth/jwt/roles.guard';

import { GetAppointmentsQueryDto, GetAppointmentsResponseDto } from '../dto/calendar-response.dto';
import { AppointmentCalendarService } from '../services/appointment-calendar.service';

@ApiTags('Consultant: Appointments')
@Controller('consultant/appointment')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AppointmentsCalendarController {
  constructor(private readonly appointmentCalendarService: AppointmentCalendarService) { }

  @Get('calendar')
  @ApiOperation({
    summary: 'Get consultant appointments for calendar',
    description: "Retrieve all appointments for the authenticated consultant. Optionally filter by specific date. \
     This endpoint is used in the calendar tab of consultant app",
  })
  @ApiResponse({
    status: 200,
    description: 'Appointments retrieved successfully',
    type: GetAppointmentsResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid query parameters',
  })
  @ApiQuery({
    name: 'date',
    required: false,
    description: 'Filter by specific date (YYYY-MM-DD)',
    example: '2025-08-25',
  })
  async getAppointments(
    @Query() query: GetAppointmentsQueryDto,
    @Req() req: any,
  ): Promise<GetAppointmentsResponseDto> {
    const consultantId = req.user.id;
    const appointments = await this.appointmentCalendarService.getConsultantAppointments(
      +consultantId,
      query,
    );

    return {
      data: appointments,
      statusCode: HttpStatus.OK,
      message: 'Appointments retrieved successfully',
    };
  }

}
