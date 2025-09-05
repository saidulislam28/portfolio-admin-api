/* eslint-disable */
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse
} from '@nestjs/swagger';
import { res } from 'src/common/response.helper';
import { Role } from 'src/user-auth/dto/role.enum';
import { HasRoles } from 'src/user-auth/jwt/has-roles.decorator';
import { JwtAuthGuard } from 'src/user-auth/jwt/jwt-auth.guard';
import { RolesGuard } from 'src/user-auth/jwt/roles.guard';
import { AppointmentsService } from '../services/appoinments.service';
import { AppointmentListResponseDto, AppointmentResponseDto, AssignConsultantDto, AssignConsultantResponseDto } from '../dtos/appointments.dto';


@ApiTags('Admin: Appointments')
@ApiBearerAuth()
@HasRoles(Role.Admin)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) { }

  @Get()
  @ApiOperation({
    summary: 'Get all appointments',
    description: 'Retrieves a list of all appointments with user and consultant details.'
  })
  @ApiOkResponse({
    type: AppointmentListResponseDto,
    description: 'List of appointments retrieved successfully'
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing authentication token'
  })
  @ApiForbiddenResponse({
    description: 'Forbidden - Insufficient permissions (Admin role required)'
  })
  async getAppointments() {
    const response = await this.appointmentsService.getAppointments();
    return res.success(response);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get appointment by ID',
    description: 'Retrieves detailed information for a specific appointment by ID.'
  })
  @ApiParam({
    name: 'id',
    description: 'Appointment ID',
    type: Number,
    example: 1
  })
  @ApiOkResponse({
    type: AppointmentResponseDto,
    description: 'Appointment details retrieved successfully'
  })
  @ApiNotFoundResponse({
    description: 'Appointment not found'
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing authentication token'
  })
  @ApiForbiddenResponse({
    description: 'Forbidden - Insufficient permissions (Admin role required)'
  })
  async getOrderById(@Param('id', ParseIntPipe) id: number) {
    const response = await this.appointmentsService.getAppointmentById(id);
    return res.success(response);
  }

  @Patch(':id/assign-consultant')
  @ApiOperation({
    summary: 'Assign consultant to appointment',
    description: 'Assigns a consultant to a specific appointment and triggers notification.'
  })
  @ApiParam({
    name: 'id',
    description: 'Appointment ID',
    type: Number,
    example: 1
  })
  @ApiBody({
    type: AssignConsultantDto,
    description: 'Consultant assignment data'
  })
  @ApiOkResponse({
    type: AssignConsultantResponseDto,
    description: 'Consultant assigned successfully'
  })
  @ApiNotFoundResponse({
    description: 'Appointment not found'
  })
  @ApiBadRequestResponse({
    description: 'Failed to assign consultant'
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing authentication token'
  })
  @ApiForbiddenResponse({
    description: 'Forbidden - Insufficient permissions (Admin role required)'
  })
  assignConsultant(
    @Param('id') id: string,
    @Body() body: AssignConsultantDto,
  ) {
    return this.appointmentsService.assignConsultant(+id, body.consultant_id);
  }
}