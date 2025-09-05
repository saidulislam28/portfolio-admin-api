// consultant-schedule.controller.ts

import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    HttpCode,
    HttpStatus,
    UseGuards,
    ParseIntPipe,
    Patch,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiQuery,
    ApiBearerAuth,
    ApiBody,
} from '@nestjs/swagger';
import {
    CreateWorkHourDto,
    UpdateWorkHourDto,
    CreateBulkWorkHoursDto,
    CreateOffDayDto,
    UpdateOffDayDto,
    CreateBulkOffDaysDto,
    GetWorkHoursQueryDto,
    GetOffDaysQueryDto,
    WorkHourResponseDto,
    OffDayResponseDto,
    ConsultantScheduleResponseDto,
    ConsultantParamDto,
    WorkHourParamDto,
    OffDayParamDto,
} from '../dtos/work-hour.dto';
import { ConsultantScheduleService } from '../services/consultant-schedule.service';

@ApiTags('Admin: Consultant Schedule')
@ApiBearerAuth()
@Controller('consultants/:consultant_id')
export class ConsultantScheduleController {
    constructor(private readonly scheduleService: ConsultantScheduleService) { }

    // Work Hours Endpoints

    @Post('work-hours')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Create work hour for consultant',
        description: 'Add a new work hour shift for a specific day of the week'
    })
    @ApiParam({
        name: 'consultant_id',
        description: 'Consultant ID',
        // type: 'integer',
    })
    @ApiBody({ type: CreateWorkHourDto })
    @ApiResponse({
        status: 201,
        description: 'Work hour created successfully',
        type: WorkHourResponseDto,
    })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    @ApiResponse({ status: 404, description: 'Consultant not found' })
    @ApiResponse({ status: 409, description: 'Conflicting work hour already exists' })
    async createWorkHour(
        @Param() params: ConsultantParamDto,
        @Body() createWorkHourDto: CreateWorkHourDto,
    ): Promise<WorkHourResponseDto> {

        console.log("param", params.consultant_id)

        createWorkHourDto.consultant_id = params.consultant_id;
        return this.scheduleService.createWorkHour(createWorkHourDto);
    }

    @Post('work-hours/bulk')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Create multiple work hours',
        description: 'Add multiple work hour shifts at once'
    })
    @ApiParam({
        name: 'consultant_id',
        description: 'Consultant ID',
        type: 'integer',
    })
    @ApiBody({ type: CreateBulkWorkHoursDto })
    @ApiResponse({
        status: 201,
        description: 'Work hours created successfully',
        type: [WorkHourResponseDto],
    })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    @ApiResponse({ status: 404, description: 'Consultant not found' })
    async createBulkWorkHours(
        @Param() params: ConsultantParamDto,
        @Body() createBulkWorkHoursDto: CreateBulkWorkHoursDto,
    ): Promise<WorkHourResponseDto[]> {
        createBulkWorkHoursDto.consultant_id = params.consultant_id;
        return this.scheduleService.createBulkWorkHours(createBulkWorkHoursDto);
    }

    @Get('work-hours')
    @ApiOperation({
        summary: 'Get consultant work hours',
        description: 'Retrieve all work hours for a consultant with optional filtering'
    })
    @ApiParam({
        name: 'consultant_id',
        description: 'Consultant ID',
        type: 'integer',
    })
    @ApiQuery({
        name: 'day_of_week',
        required: false,
        description: 'Filter by day of week (1-7)',
        type: 'integer',
    })
    @ApiQuery({
        name: 'is_active',
        required: false,
        description: 'Filter by active status',
        type: 'boolean',
    })
    @ApiResponse({
        status: 200,
        description: 'Work hours retrieved successfully',
        type: [WorkHourResponseDto],
    })
    @ApiResponse({ status: 404, description: 'Consultant not found' })
    async getWorkHours(
        @Param() params: ConsultantParamDto,
        @Query() query: GetWorkHoursQueryDto,
    ): Promise<WorkHourResponseDto[]> {
        return this.scheduleService.getWorkHours(params.consultant_id, query);
    }

    @Patch('work-hours/:work_hour_id')
    @ApiOperation({
        summary: 'Update work hour',
        description: 'Update an existing work hour'
    })
    @ApiParam({
        name: 'consultant_id',
        description: 'Consultant ID',
        type: 'integer',
    })
    @ApiParam({
        name: 'work_hour_id',
        description: 'Work Hour ID',
        type: 'integer',
    })
    @ApiBody({ type: UpdateWorkHourDto })
    @ApiResponse({
        status: 200,
        description: 'Work hour updated successfully',
        type: WorkHourResponseDto,
    })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    @ApiResponse({ status: 404, description: 'Work hour not found' })
    async updateWorkHour(
        @Param() params: WorkHourParamDto,
        @Body() updateWorkHourDto: UpdateWorkHourDto,
    ): Promise<WorkHourResponseDto> {
        return this.scheduleService.updateWorkHour(params.work_hour_id, updateWorkHourDto);
    }

    @Delete('work-hours/:work_hour_id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({
        summary: 'Delete work hour',
        description: 'Delete an existing work hour'
    })
    @ApiParam({
        name: 'consultant_id',
        description: 'Consultant ID',
        type: 'integer',
    })
    @ApiParam({
        name: 'work_hour_id',
        description: 'Work Hour ID',
        type: 'integer',
    })
    @ApiResponse({ status: 204, description: 'Work hour deleted successfully' })
    @ApiResponse({ status: 404, description: 'Work hour not found' })
    async deleteWorkHour(@Param() params: WorkHourParamDto): Promise<void> {
        return this.scheduleService.deleteWorkHour(params.work_hour_id);
    }

    // Off Days Endpoints

    @Post('off-days')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Create off day for consultant',
        description: 'Add a specific date when consultant is not available'
    })
    @ApiParam({
        name: 'consultant_id',
        description: 'Consultant ID',
        type: 'integer',
    })
    @ApiBody({ type: CreateOffDayDto })
    @ApiResponse({
        status: 201,
        description: 'Off day created successfully',
        type: OffDayResponseDto,
    })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    @ApiResponse({ status: 404, description: 'Consultant not found' })
    @ApiResponse({ status: 409, description: 'Off day already exists for this date' })
    async createOffDay(
        @Param() params: ConsultantParamDto,
        @Body() createOffDayDto: CreateOffDayDto,
    ): Promise<OffDayResponseDto> {
        createOffDayDto.consultant_id = params.consultant_id;
        return this.scheduleService.createOffDay(createOffDayDto);
    }

    @Post('off-days/bulk')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Create multiple off days',
        description: 'Add multiple off days at once'
    })
    @ApiParam({
        name: 'consultant_id',
        description: 'Consultant ID',
        type: 'integer',
    })
    @ApiBody({ type: CreateBulkOffDaysDto })
    @ApiResponse({
        status: 201,
        description: 'Off days created successfully',
        type: [OffDayResponseDto],
    })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    @ApiResponse({ status: 404, description: 'Consultant not found' })
    async createBulkOffDays(
        @Param() params: ConsultantParamDto,
        @Body() createBulkOffDaysDto: CreateBulkOffDaysDto,
    ): Promise<OffDayResponseDto[]> {
        createBulkOffDaysDto.consultant_id = params.consultant_id;
        return this.scheduleService.createBulkOffDays(createBulkOffDaysDto);
    }

    @Get('off-days')
    @ApiOperation({
        summary: 'Get consultant off days',
        description: 'Retrieve all off days for a consultant with optional date range filtering'
    })
    @ApiParam({
        name: 'consultant_id',
        description: 'Consultant ID',
        type: 'integer',
    })
    @ApiQuery({
        name: 'start_date',
        required: false,
        description: 'Filter from this date (YYYY-MM-DD)',
        type: 'string',
    })
    @ApiQuery({
        name: 'end_date',
        required: false,
        description: 'Filter until this date (YYYY-MM-DD)',
        type: 'string',
    })
    @ApiQuery({
        name: 'is_recurring',
        required: false,
        description: 'Filter by recurring status',
        type: 'boolean',
    })
    @ApiResponse({
        status: 200,
        description: 'Off days retrieved successfully',
        type: [OffDayResponseDto],
    })
    @ApiResponse({ status: 404, description: 'Consultant not found' })
    async getOffDays(
        @Param() params: ConsultantParamDto,
        @Query() query: GetOffDaysQueryDto,
    ): Promise<OffDayResponseDto[]> {
        return this.scheduleService.getOffDays(params.consultant_id, query);
    }

    @Patch('off-days/:off_day_id')
    @ApiOperation({
        summary: 'Update off day',
        description: 'Update an existing off day'
    })
    @ApiParam({
        name: 'consultant_id',
        description: 'Consultant ID',
        type: 'integer',
    })
    @ApiParam({
        name: 'off_day_id',
        description: 'Off Day ID',
        type: 'integer',
    })
    @ApiBody({ type: UpdateOffDayDto })
    @ApiResponse({
        status: 200,
        description: 'Off day updated successfully',
        type: OffDayResponseDto,
    })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    @ApiResponse({ status: 404, description: 'Off day not found' })
    async updateOffDay(
        @Param() params: OffDayParamDto,
        @Body() updateOffDayDto: UpdateOffDayDto,
    ): Promise<OffDayResponseDto> {
        return this.scheduleService.updateOffDay(params.off_day_id, updateOffDayDto);
    }

    @Delete('off-days/:off_day_id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({
        summary: 'Delete off day',
        description: 'Delete an existing off day'
    })
    @ApiParam({
        name: 'consultant_id',
        description: 'Consultant ID',
        type: 'integer',
    })
    @ApiParam({
        name: 'off_day_id',
        description: 'Off Day ID',
        type: 'integer',
    })
    @ApiResponse({ status: 204, description: 'Off day deleted successfully' })
    @ApiResponse({ status: 404, description: 'Off day not found' })
    async deleteOffDay(@Param() params: OffDayParamDto): Promise<void> {
        return this.scheduleService.deleteOffDay(params.off_day_id);
    }

    // Combined Endpoints

    @Get('schedule')
    @ApiOperation({
        summary: 'Get complete consultant schedule',
        description: 'Get both work hours and off days for a consultant'
    })
    @ApiParam({
        name: 'consultant_id',
        description: 'Consultant ID',
        type: 'integer',
    })
    @ApiResponse({
        status: 200,
        description: 'Schedule retrieved successfully',
        type: ConsultantScheduleResponseDto,
    })
    @ApiResponse({ status: 404, description: 'Consultant not found' })
    async getCompleteSchedule(
        @Param() params: ConsultantParamDto,
    ): Promise<ConsultantScheduleResponseDto> {
        return this.scheduleService.getCompleteSchedule(params.consultant_id);
    }

    @Delete('schedule')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({
        summary: 'Clear consultant schedule',
        description: 'Delete all work hours and off days for a consultant'
    })
    @ApiParam({
        name: 'consultant_id',
        description: 'Consultant ID',
        type: 'integer',
    })
    @ApiResponse({ status: 204, description: 'Schedule cleared successfully' })
    @ApiResponse({ status: 404, description: 'Consultant not found' })
    async clearSchedule(@Param() params: ConsultantParamDto): Promise<void> {
        return this.scheduleService.clearSchedule(params.consultant_id);
    }

    // Utility Endpoints

    @Get('availability/:date')
    @ApiOperation({
        summary: 'Check consultant availability for specific date',
        description: 'Check if consultant is available on a specific date considering work hours and off days'
    })
    @ApiParam({
        name: 'consultant_id',
        description: 'Consultant ID',
        type: 'integer',
    })
    @ApiParam({
        name: 'date',
        description: 'Date to check (YYYY-MM-DD)',
        type: 'string',
    })
    @ApiResponse({
        status: 200,
        description: 'Availability information',
        schema: {
            type: 'object',
            properties: {
                available: { type: 'boolean' },
                date: { type: 'string' },
                day_of_week: { type: 'number' },
                work_hours: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/WorkHourResponseDto' }
                },
                is_off_day: { type: 'boolean' },
                off_day_reason: { type: 'string', nullable: true }
            }
        }
    })
    async checkAvailability(
        @Param() params: ConsultantParamDto,
        @Param('date') date: string,
    ) {
        return this.scheduleService.checkAvailability(params.consultant_id, date);
    }
}