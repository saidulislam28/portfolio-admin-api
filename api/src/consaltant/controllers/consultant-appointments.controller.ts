import {
  Controller,
  Get,
  Query,
  UseGuards,
  Req,
  HttpStatus,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import {
  GetAppointmentsQueryDto,
} from '../dto/get-appointments.dto';
import { ConsultantAppointmentsService } from '../services/consultant-appointments.service';
import { RolesGuard } from 'src/user-auth/jwt/roles.guard';
import { JwtAuthGuard } from 'src/user-auth/jwt/jwt-auth.guard';
import { GetAppointmentsResponseDto } from '../dto/appointment-response.dto';
import { res } from 'src/common/response.helper';

@ApiTags('Consultant: List Appointments')
@Controller('consultant/appointments-list')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ConsultantAppointmentsController {
  constructor(private readonly appointmentsService: ConsultantAppointmentsService) { }

  @Get()
  @ApiOperation({
    summary: 'Get consultant appointments',
    description: 'Retrieve all appointments for the authenticated consultant. Optionally filter by specific date.',
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
    // Extract consultant ID from JWT token
    const consultantId = req.user.id; // Assuming your JWT payload has user.id
    console.log("consultant id", consultantId)
    const appointments = await this.appointmentsService.getConsultantAppointments(
      +consultantId,
      query,
    );

    return {
      data: appointments,
      statusCode: HttpStatus.OK,
      message: 'Appointments retrieved successfully',
    };
  }

  @Get(":id")
  async getAppointmentDetails(
    @Req() req,
    @Param('id', ParseIntPipe) id: number
  ) {
    const consultantId = req.user.id;
    const response = await this.appointmentsService.getAppointmentDetails(+consultantId, +id)
    return res.success(response)

  }

}
