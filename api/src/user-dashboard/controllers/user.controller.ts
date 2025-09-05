/* eslint-disable */
import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiParam,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse
} from '@nestjs/swagger';
import { res } from 'src/common/response.helper';
import { JwtAuthGuard } from 'src/user-auth/jwt/jwt-auth.guard';
import { RolesGuard } from 'src/user-auth/jwt/roles.guard';
import { UserService } from '../services/user.service';
import { AppointmentDetailResponseDto, AppointmentsResponseDto } from '../dto/user.dto';
import { HasRoles } from 'src/user-auth/jwt/has-roles.decorator';
import { Role } from 'src/user-auth/dto/role.enum';

@ApiTags('User: Appointments')
@ApiBearerAuth()
@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
@HasRoles(Role.User)
export class UsersController {
  constructor(private readonly usersService: UserService) { }

  @Get('appointments')
  @ApiOperation({ 
    summary: 'Get user appointments', 
    description: 'Retrieves all appointments for the authenticated user, categorized into upcoming, live, and past appointments.' 
  })
  @ApiOkResponse({ 
    type: AppointmentsResponseDto,
    description: 'Appointments retrieved successfully' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Unauthorized - Invalid or missing authentication token' 
  })
  @ApiForbiddenResponse({ 
    description: 'Forbidden - Insufficient permissions' 
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Internal server error' 
  })
  async findAppointments(@Req() req) {
    const { id: user_id } = req?.user;
    const response = await this.usersService.findAppointments(+user_id);
    return res.success(response);
  }

  @Get('appointments/:id')
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
    type: AppointmentDetailResponseDto,
    description: 'Appointment details retrieved successfully' 
  })
  @ApiNotFoundResponse({ 
    description: 'Appointment not found' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Unauthorized - Invalid or missing authentication token' 
  })
  @ApiForbiddenResponse({ 
    description: 'Forbidden - Insufficient permissions' 
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Internal server error' 
  })
  async getAppointmentDetail(@Req() req, @Param() param) {
    const { id: user_id } = req?.user;
    const response = await this.usersService.getAppointmentListDetails(
      +user_id,
      +param?.id,
    );
    return res.success(response);
  }
}