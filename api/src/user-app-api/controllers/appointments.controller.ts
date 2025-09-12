import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { AppointmentsService } from '../services/appointments.service';
import { RolesGuard } from 'src/user-auth/jwt/roles.guard';
import { JwtAuthGuard } from 'src/user-auth/jwt/jwt-auth.guard';
import { HasRoles } from 'src/user-auth/jwt/has-roles.decorator';
import { Role } from 'src/user-auth/dto/role.enum';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetSlotsQueryDto } from '../dtos/appointment.dto';
import { GetSlotsResponseDto } from '../dtos/appointment-slots.dto';
import { MyActiveAppointmentsResponseDto } from '../dtos/my-active-appointments.dto';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { CACHE_TTL } from 'src/common/constants';

@ApiTags('User: Appointments Slots')
@ApiBearerAuth()
@Controller('app/appointments')
@HasRoles(Role.User)
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) { }

  @Get('slots')
  @ApiOperation({ summary: 'Get available appointment slots for the next 3 weeks' })
  @ApiResponse({ 
    status: 200, 
    description: 'Successfully retrieved available slots.', 
    type: GetSlotsResponseDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiQuery({ name: 'timezone', required: false, description: 'The user\'s timezone (e.g., America/New_York)' })
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(CACHE_TTL.thirtyseconds)
  async getAvailableSlots(@Query() query: GetSlotsQueryDto) {
    try {
      const slots = await this.appointmentsService.getAvailableSlots(query.timezone);

      return {
        success: true,
        data: slots,
        meta: {
          timezone: query.timezone,
          generated_at: new Date().toISOString(),
          total_days: slots.length
        }
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to fetch available slots',
          error: 'FETCH_SLOTS_ERROR'
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // get list of user's active appointments (PENDING or CONFIRMED) this will be used on app
  // to hide these slots to prevent same user booking same slot twice
  @Get('active')
  @ApiOperation({ summary: 'Get a list of the user\'s active appointments' })
  @ApiResponse({ 
    status: 200, 
    description: 'Successfully retrieved user\'s active appointments.',
    type: MyActiveAppointmentsResponseDto
   })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async getActiveAppointmentsByUser(@Req() req) {
    const { id: user_id } = req?.user;
    try {
      const slots = await this.appointmentsService.getActiveAppointmentsByUser(+user_id);

      return {
        success: true,
        data: slots,
        meta: {
          // This line was causing an error. `query` is not defined in this method.
          // You should remove it or replace it with a valid variable if available.
          // timezone: query.timezone, 
          generated_at: new Date().toISOString(),
          total_days: slots.length
        }
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to fetch available slots',
          error: 'FETCH_SLOTS_ERROR'
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  
}