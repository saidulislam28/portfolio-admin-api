import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { CreateAppointmentDto, CreateAppointmentsDto, GetSlotsQueryDto } from '../dtos/appointment.dto';
import { AppointmentsService } from '../services/appointments.service';
import { RolesGuard } from 'src/user-auth/jwt/roles.guard';
import { JwtAuthGuard } from 'src/user-auth/jwt/jwt-auth.guard';
import { HasRoles } from 'src/user-auth/jwt/has-roles.decorator';
import { Role } from 'src/user-auth/dto/role.enum';


@Controller('app/appointments')
@HasRoles(Role.User)
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) { }

  /**
   * GET /appointments/slots
   * Returns available slots for the next 3 weeks
   * 
   * Query params:
   * - timezone: User's timezone (optional, defaults to UTC)
   * 
   * Response format:
   * {
   *   "success": true,
   *   "data": [
   *     {
   *       "date": "2025-05-27",
   *       "day_name": "Tuesday",
   *       "slots": [
   *         {
   *           "time": "09:00",
   *           "time_12h": "9:00 AM",
   *           "is_booked": false,
   *           "available_slots": 8,
   *           "total_slots": 10
   *         },
   *         {
   *           "time": "09:20",
   *           "time_12h": "9:20 AM",
   *           "is_booked": true,
   *           "available_slots": 0,
   *           "total_slots": 10
   *         }
   *       ]
   *     }
   *   ],
   *   "meta": {
   *     "timezone": "America/New_York",
   *     "generated_at": "2025-05-27T10:30:00Z"
   *   }
   * }
   */
  @Get('slots')
  @UsePipes(new ValidationPipe({ transform: true }))
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

  /**
   * POST /appointments/bulk
   * Creates multiple appointments from an array
   * 
   * Request body:
   * {
   *   "appointments": [
   *     {
   *       "start_at": "2025-05-27T14:00:00Z",
   *       "end_at": "2025-05-27T14:20:00Z",
   *       "consultant_id": 1,
   *       "user_id": 123,
   *       "order_id": 456,
   *       "notes": "Follow-up consultation",
   *       "user_timezone": "America/New_York"
   *     }
   *   ]
   * }
   * 
   * Response format:
   * {
   *   "success": true,
   *   "data": [
   *     {
   *       "id": 1,
   *       "start_at": "2025-05-27T14:00:00.000Z",
   *       "end_at": "2025-05-27T14:20:00.000Z",
   *       "status": "CONFIRMED",
   *       "token": "abc123def456",
   *       "User": { ... },
   *       "Consultant": { ... },
   *       "Order": { ... }
   *     }
   *   ],
   *   "meta": {
   *     "created_count": 1,
   *     "created_at": "2025-05-27T10:30:00Z"
   *   }
   * }
   */
  @Post('bulk')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createAppointments(@Body() createAppointmentsDto: CreateAppointmentsDto) {
    try {
      const appointments = await this.appointmentsService.createAppointments(
        createAppointmentsDto.appointments
      );

      return {
        success: true,
        data: appointments,
        meta: {
          created_count: appointments.length,
          created_at: new Date().toISOString()
        }
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to create appointments',
          error: 'CREATE_APPOINTMENTS_ERROR'
        },
        error.status || HttpStatus.BAD_REQUEST
      );
    }
  }

  /**
   * POST /appointments
   * Creates a single appointment (convenience endpoint)
   */
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async createSingleAppointment(@Body() createAppointmentDto: CreateAppointmentDto) {
    try {
      const appointments = await this.appointmentsService.createAppointments([
        createAppointmentDto
      ]);

      return {
        success: true,
        data: appointments[0],
        meta: {
          created_at: new Date().toISOString()
        }
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to create appointment',
          error: 'CREATE_APPOINTMENT_ERROR'
        },
        error.status || HttpStatus.BAD_REQUEST
      );
    }
  }

  /**
   * GET /appointments/slots/today
   * Get today's slots only (for quick access)
   */
  @Get('slots/today')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getTodaySlots(@Query() query: GetSlotsQueryDto) {
    try {
      const allSlots = await this.appointmentsService.getAvailableSlots(query.timezone);
      const todaySlots = allSlots.find(day => {
        const today = new Date().toISOString().split('T')[0];
        return day.date === today;
      });

      return {
        success: true,
        data: todaySlots || null,
        meta: {
          timezone: query.timezone,
          generated_at: new Date().toISOString()
        }
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to fetch today\'s slots',
          error: 'FETCH_TODAY_SLOTS_ERROR'
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}