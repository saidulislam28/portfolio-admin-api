/* eslint-disable */
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse
} from '@nestjs/swagger';
import { BookingService } from '../services/bookings.service';
import {
  BookingQueryDto,
  BookingResponseDto,
  BookingListResponseDto,
  UpdateBookingDto
} from '../dtos/booking.dto';
import { JwtAuthGuard } from 'src/user-auth/jwt/jwt-auth.guard';
import { RolesGuard } from 'src/user-auth/jwt/roles.guard';
import { HasRoles } from 'src/user-auth/jwt/has-roles.decorator';
import { Role } from 'src/user-auth/dto/role.enum';

@ApiTags('Admin: Bookings')
@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
@HasRoles(Role.Admin)
export class BookingController {
  constructor(private readonly bookingService: BookingService) { }

  @Get()
  @ApiOperation({
    summary: 'Get all bookings',
    description: 'Retrieves a list of bookings with optional search filtering.'
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search term to filter bookings by notes, token, consultant_id, or user_id',
    type: String,
    example: 'john'
  })
  @ApiOkResponse({
    type: BookingListResponseDto,
    description: 'List of bookings retrieved successfully'
  })
  @ApiBadRequestResponse({
    description: 'Invalid query parameters'
  })
  async findAll(@Query() query: BookingQueryDto) {
    console.log(query)
    return await this.bookingService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get booking by ID',
    description: 'Retrieves detailed information for a specific booking by ID.'
  })
  @ApiParam({
    name: 'id',
    description: 'Booking ID',
    type: Number,
    example: 1
  })
  @ApiOkResponse({
    type: BookingResponseDto,
    description: 'Booking details retrieved successfully'
  })
  @ApiNotFoundResponse({
    description: 'Booking not found'
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    // return await this.bookingService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update booking',
    description: 'Updates a specific booking by ID.'
  })
  @ApiParam({
    name: 'id',
    description: 'Booking ID',
    type: Number,
    example: 1
  })
  @ApiBody({
    type: UpdateBookingDto,
    description: 'Booking update data'
  })
  @ApiOkResponse({
    type: BookingResponseDto,
    description: 'Booking updated successfully'
  })
  @ApiNotFoundResponse({
    description: 'Booking not found'
  })
  @ApiBadRequestResponse({
    description: 'Invalid update data'
  })
  async updateOne(@Param("id", ParseIntPipe) id: number, @Body() updateData: UpdateBookingDto) {
    // return await this.bookingService.updateOne(id, updateData);
  }
}