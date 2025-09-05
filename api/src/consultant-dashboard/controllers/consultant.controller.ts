/* eslint-disable */
// src/users/users.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
  ApiBody,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiCreatedResponse
} from '@nestjs/swagger';
import { res } from 'src/common/response.helper';
import { JwtAuthGuard } from 'src/user-auth/jwt/jwt-auth.guard';
import { RolesGuard } from 'src/user-auth/jwt/roles.guard';

import { ConsultantService } from '../services/consultant.service';
import {
  ConsultantQueryDto,
  CreateConsultantDto,
  UpdateConsultantDto,
  ConsultantResponseDto,
  ConsultantListResponseDto,
  AppointmentListQueryDto,
  UpdateAppointmentStatusDto,
  UpdateAppointmentNotesDto,
  AppointmentResponseDto,
  AppointmentListResponseDto
} from '../dto/consultant.dto';

@ApiTags('Consultant: Consultants')
@ApiBearerAuth()
@Controller('consultant')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ConsultantController {
  constructor(private readonly consultantService: ConsultantService) { }

  @Post()
  @ApiOperation({
    summary: 'Create a new consultant',
    description: 'Creates a new consultant account with the provided details.'
  })
  @ApiBody({
    type: CreateConsultantDto,
    description: 'Consultant creation data'
  })
  @ApiCreatedResponse({
    type: ConsultantResponseDto,
    description: 'Consultant created successfully'
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data'
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing authentication token'
  })
  @ApiForbiddenResponse({
    description: 'Forbidden - Insufficient permissions'
  })
  async create(@Body() data: CreateConsultantDto) {
    const response = await this.consultantService.createUser(data);
    return res.success(response);
  }

  @Get('list')
  @ApiOperation({
    summary: 'Get consultants list',
    description: 'Retrieves a list of consultants with optional filtering and search capabilities.'
  })
  @ApiQuery({
    name: 'searchText',
    required: false,
    description: 'Search text for filtering consultants by name, email, or phone',
    type: String
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    description: 'Filter by active status (true/false)',
    type: Boolean
  })
  @ApiQuery({
    name: 'isVerified',
    required: false,
    description: 'Filter by verification status (true/false)',
    type: Boolean
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Start date for filtering by creation date (YYYY-MM-DD)',
    type: String
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'End date for filtering by creation date (YYYY-MM-DD)',
    type: String
  })
  @ApiOkResponse({
    type: ConsultantListResponseDto,
    description: 'Consultants list retrieved successfully'
  })
  @ApiBadRequestResponse({
    description: 'Invalid query parameters'
  })
  async findAll(@Query() query: ConsultantQueryDto) {
    if (query.searchText == 'null' || query.searchText == 'undefined' || !query.searchText) {
      query.searchText = null;
    }
    if (query.isActive == null || query.isActive == undefined || !query.isActive) {
      query.isActive = null;
    }
    if (query.isVerified == null || query.isVerified == undefined || !query.isVerified) {
      query.isVerified = null;
    }
    if (query.startDate == 'null' || query.startDate == 'undefined' || !query.startDate) {
      query.startDate = null;
    }
    if (query.endDate == 'null' || query.endDate == 'undefined' || !query.endDate) {
      query.endDate = null;
    }

    const response = await this.consultantService.getUsers(query);
    return res.success(response);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get consultant by ID',
    description: 'Retrieves detailed information for a specific consultant by their ID.'
  })
  @ApiParam({
    name: 'id',
    description: 'Consultant ID',
    type: Number,
    example: 1
  })
  @ApiOkResponse({
    type: ConsultantResponseDto,
    description: 'Consultant details retrieved successfully'
  })
  @ApiNotFoundResponse({
    description: 'Consultant not found'
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const response = await this.consultantService.getUserById(id);
    return res.success(response);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update consultant',
    description: 'Updates consultant information by ID.'
  })
  @ApiParam({
    name: 'id',
    description: 'Consultant ID',
    type: String,
    example: '1'
  })
  @ApiBody({
    type: UpdateConsultantDto,
    description: 'Consultant update data'
  })
  @ApiOkResponse({
    type: ConsultantResponseDto,
    description: 'Consultant updated successfully'
  })
  @ApiNotFoundResponse({
    description: 'Consultant not found'
  })
  @ApiBadRequestResponse({
    description: 'Invalid update data'
  })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateConsultantDto) {
    const response = await this.consultantService.updateUser(id, updateUserDto);
    return res.success(response);
  }
}