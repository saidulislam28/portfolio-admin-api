import {
  Controller,
  Get,
  HttpStatus,
  Query,
  UseGuards,
  ValidationPipe
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags} from '@nestjs/swagger';
import { Role } from 'src/user-auth/dto/role.enum';
import { HasRoles } from 'src/user-auth/jwt/has-roles.decorator';
import { JwtAuthGuard } from 'src/user-auth/jwt/jwt-auth.guard';
import { RolesGuard } from 'src/user-auth/jwt/roles.guard';

import { ConsultantReportsService } from './consultant-reports.service';
import {
  ConsultantReportQueryDto,
  ConsultantReportResponseDto
} from './dto/consultant-report.dto';

@ApiTags('Admin: Reports')
@ApiBearerAuth()
@HasRoles(Role.Admin)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/reports')
export class ConsultantReportsController {
  constructor(private readonly reportsService: ConsultantReportsService) {}

  @Get('consultant-appointments')
  @ApiOperation({
    summary: 'Get consultant appointment report',
    description: `
      Returns a detailed report of consultant appointments within a specified date range.
      The report includes:
      - Total appointments count for each consultant
      - Daily breakdown of appointments
      - Status-wise count for each day (INITIATED, PENDING, CONFIRMED, etc.)
      - Overall status summary for the entire period
      
      If consultantId is provided, the report will be filtered for that specific consultant only.
      Otherwise, it returns data for all active consultants.
    `
  })
  @ApiQuery({
    name: 'startDate',
    description: 'Start date for the report range (ISO 8601 format)',
    example: '2023-11-01T00:00:00.000Z'
  })
  @ApiQuery({
    name: 'endDate',
    description: 'End date for the report range (ISO 8601 format)',
    example: '2023-11-30T23:59:59.999Z'
  })
  @ApiQuery({
    name: 'consultantId',
    required: false,
    description: 'Optional consultant ID to filter the report',
    example: 1
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Consultant appointment report generated successfully',
    type: ConsultantReportResponseDto
  })
  @ApiBadRequestResponse({
    description: 'Invalid query parameters (e.g., invalid date format, negative consultant ID)',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { 
          type: 'array', 
          items: { type: 'string' },
          example: ['startDate must be a valid ISO 8601 date string']
        },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: { type: 'string', example: 'Internal server error' }
      }
    }
  })
  async getConsultantAppointmentReport(
    @Query(new ValidationPipe({ 
      transform: true, 
      whitelist: true,
      forbidNonWhitelisted: true 
    })) query: ConsultantReportQueryDto
  ): Promise<ConsultantReportResponseDto> {
    return this.reportsService.getConsultantAppointmentReport(query);
  }
}