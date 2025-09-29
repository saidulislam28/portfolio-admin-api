/* eslint-disable */
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { res } from 'src/common/response.helper';
import { Role } from 'src/user-auth/dto/role.enum';
import { HasRoles } from 'src/user-auth/jwt/has-roles.decorator';
import { JwtAuthGuard } from 'src/user-auth/jwt/jwt-auth.guard';
import { RolesGuard } from 'src/user-auth/jwt/roles.guard';
import {
  AppointmentListResponseDto,
  AppointmentResponseDto,
  UpdateAppointmentNotesDto,
  UpdateAppointmentStatusDto
} from '../dto/consultant.dto';
import { ConsultantAppointmentsService } from '../services/consultant-appointments.service';

@UseGuards(JwtAuthGuard, RolesGuard)
// @HasRoles(Role.Consultant)
@ApiTags('Consultant: Appointments')
@ApiBearerAuth()
@Controller('consultant')
export class ConsultantAppointmentsController {
  constructor(private readonly consultantService: ConsultantAppointmentsService) { }

  @Get('appointment/list')
  @ApiOperation({
    summary: 'Get consultant appointments list',
    description: 'Retrieves appointments for the authenticated consultant, optionally filtered by type.'
  })
  @ApiOkResponse({
    type: AppointmentListResponseDto,
    description: 'Appointments list retrieved successfully'
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing authentication token'
  })
  async getAppointmentList(@Req() req) {
    const { id: consultant_id } = req?.user;
    const response = await this.consultantService.getAppointmentList(+consultant_id);
    return res.success(response)
  }

  @Get('live/appointments')
  @ApiOperation({
    summary: 'Get live appointments',
    description: 'Retrieves live appointments (within next 12 hours) for the authenticated consultant.'
  })
  @ApiOkResponse({
    type: AppointmentListResponseDto,
    description: 'Live appointments retrieved successfully'
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing authentication token'
  })
  async getLiveAppointmentList(@Req() req) {
    const { id: consultant_id } = req?.user;
    const response = await this.consultantService.getLiveAppointmentList(+consultant_id);
    return res.success(response)
  }

  @Get("appointment-detail/:id")
  @ApiOperation({
    summary: 'Get appointment details',
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
  async getAppointMentDetail(@Req() req, @Param() param: { id: string }) {
    const { id: consultant_id } = req?.user;
    const response = await this.consultantService.getAppointmentListDetails(+consultant_id, +param?.id);
    return res.success(response)
  }

  @Patch('appointment/:id')
  @ApiOperation({
    summary: 'Update appointment status',
    description: 'Updates the status of a specific appointment.'
  })
  @ApiParam({
    name: 'id',
    description: 'Appointment ID',
    type: Number,
    example: 1
  })
  @ApiBody({
    type: UpdateAppointmentStatusDto,
    description: 'Appointment status update data'
  })
  @ApiOkResponse({
    type: AppointmentResponseDto,
    description: 'Appointment status updated successfully'
  })
  @ApiNotFoundResponse({
    description: 'Appointment not found'
  })
  @ApiBadRequestResponse({
    description: 'Invalid status value'
  })
  async updateAppointMent(@Req() req, @Param() param: { id: string }, @Body() payload: UpdateAppointmentStatusDto) {
    const { id: consultant_id } = req?.user;
    const response = await this.consultantService.updateAppointment(+consultant_id, +param?.id, { status: payload?.status });
    return res.success(response)
  }

  @Patch('appointment/note/:id')
  @ApiOperation({
    summary: 'Update appointment notes',
    description: 'Updates the notes for a specific appointment.'
  })
  @ApiParam({
    name: 'id',
    description: 'Appointment ID',
    type: Number,
    example: 1
  })
  @ApiBody({
    type: UpdateAppointmentNotesDto,
    description: 'Appointment notes update data'
  })
  @ApiOkResponse({
    type: AppointmentResponseDto,
    description: 'Appointment notes updated successfully'
  })
  @ApiNotFoundResponse({
    description: 'Appointment not found'
  })
  async updateAppointMentNote(@Req() req, @Param() param: { id: string }, @Body() payload: UpdateAppointmentNotesDto) {
    const { id: consultant_id } = req?.user;
    const response = await this.consultantService.updateAppointment(+consultant_id, +param?.id, { notes: payload?.notes });
    return res.success(response)
  }
}