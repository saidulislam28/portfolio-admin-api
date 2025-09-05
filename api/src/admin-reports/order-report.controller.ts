import { Controller, Get, Query, UseGuards,ValidationPipe } from '@nestjs/common';
import { 
  ApiBearerAuth,
  ApiOperation, 
  ApiQuery,
  ApiResponse, 
  ApiTags, 
} from '@nestjs/swagger';
import { ServiceType } from '@prisma/client';
import { Role } from 'src/user-auth/dto/role.enum';
import { HasRoles } from 'src/user-auth/jwt/has-roles.decorator';
import { JwtAuthGuard } from 'src/user-auth/jwt/jwt-auth.guard';
import { RolesGuard } from 'src/user-auth/jwt/roles.guard';

import { 
  OrderReportsQueryDto, 
  OrderReportsResponseDto 
} from './dto/order-report.dto';
import { OrderReportsService } from './order-report.service';

@ApiTags('Admin: Reports')
@ApiBearerAuth()
@HasRoles(Role.Admin)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/reports/orders')
export class OrderReportsController {
  constructor(private readonly orderReportsService: OrderReportsService) {}

  @Get()
  @ApiOperation({
    summary: 'Generate comprehensive order reports',
     description: `Generate detailed order reports with comprehensive business analytics including:<br/><br/>
    <strong>Core Metrics:</strong><br/>
    • Total sales amount and order count<br/>
    • Revenue analysis (excluding cancelled orders)<br/>
    • Average order value calculations<br/>
    • Cancelled order tracking and impact<br/><br/>
    <strong>Payment Analysis:</strong><br/>
    • Cash on Delivery (COD) vs Online payment breakdown<br/>
    • Payment method distribution and amounts<br/><br/>
    <strong>Service Type Insights:</strong><br/>
    • Revenue breakdown by service categories<br/>
    • Performance metrics for each service type<br/>
    • Order volume analysis per service<br/><br/>
    <strong>Date Filtering:</strong><br/>
    • Single day reports using 'date' parameter<br/>
    • Date range reports using 'start_date' and 'end_date'<br/>
    • Service type filtering for focused analysis<br/><br/>
    <strong>Business Intelligence Features:</strong><br/>
    • Complete order listings with customer details<br/>
    • Cancelled order tracking with reasons<br/>
    • Payment method preferences analysis<br/>
    • Service performance comparisons<br/><br/>
    
    This endpoint is designed for business analysts, managers, and stakeholders who need comprehensive insights into order patterns, revenue trends, and customer behavior.`,
  })
  @ApiResponse({
    status: 200,
    description: 'Comprehensive order report generated successfully',
    type: OrderReportsResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid date format or missing required parameters',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { 
          type: 'string', 
          example: 'Either provide a single date or both start_date and end_date' 
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiQuery({
    name: 'date',
    required: false,
    type: String,
    description: 'Single date for daily report (YYYY-MM-DD). Cannot be used with date range parameters.',
    example: '2024-01-15',
  })
  @ApiQuery({
    name: 'start_date',
    required: false,
    type: String,
    description: 'Start date for range report (YYYY-MM-DD). Must be used with end_date.',
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'end_date',
    required: false,
    type: String,
    description: 'End date for range report (YYYY-MM-DD). Must be used with start_date.',
    example: '2024-01-31',
  })
  @ApiQuery({
    name: 'service_type',
    required: false,
    enum: ServiceType,
    description: 'Filter results by specific service type for focused analysis',
    example: ServiceType.ielts_academic,
  })
  async getOrderReports(
    @Query(new ValidationPipe({ transform: true })) query: OrderReportsQueryDto,
  ): Promise<OrderReportsResponseDto> {
    return await this.orderReportsService.generateOrderReport(query);
  }

  @Get('service-types')
  @ApiOperation({
    summary: 'Get available service types',
    description: 'Returns list of all available service types for filtering reports',
  })
  @ApiResponse({
    status: 200,
    description: 'List of available service types',
    schema: {
      type: 'object',
      properties: {
        service_types: {
          type: 'array',
          items: {
            type: 'string',
            enum: Object.values(ServiceType),
          },
        },
      },
    },
  })
  getServiceTypes() {
    return {
      service_types: Object.values(ServiceType),
    };
  }
}