/* eslint-disable */
import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { RatingsService } from '../services/appointment-rating.service';
import { CreateRatingDto, RatingResponseDto } from '../dtos/appointment-rating.dto';
import { res } from 'src/common/response.helper';
import { HasRoles } from 'src/user-auth/jwt/has-roles.decorator';
import { Role } from 'src/user-auth/dto/role.enum';
import { JwtAuthGuard } from 'src/user-auth/jwt/jwt-auth.guard';
import { RolesGuard } from 'src/user-auth/jwt/roles.guard';



@ApiTags('User App: Appointment rating given by user!')
@Controller('user/ratings')
@HasRoles(Role.User)
@UseGuards(JwtAuthGuard, RolesGuard)
export class RatingsController {
    constructor(private readonly ratingsService: RatingsService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new rating for a completed appointment' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Rating created successfully',
        type: RatingResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Appointment not found',
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Appointment not completed or already rated',
    })
    @ApiBody({ type: CreateRatingDto })
    async create(@Body() createRatingDto: CreateRatingDto, @Req() req) {
        console.log("req user", req?.user, createRatingDto);
        const { id: user_id } = req?.user;
        const response = await this.ratingsService.createRating(createRatingDto, +user_id);
        return res.success(response)
    }

    @Get('consultant/:id')
    @ApiOperation({ summary: 'Get all ratings for a consultant' })
    @ApiParam({ name: 'id', description: 'Consultant ID', type: Number })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'List of ratings for the consultant',
        type: [RatingResponseDto],
    })
    async findByConsultant(
        @Param('id', ParseIntPipe) consultantId: number,
    ) {
        const response = await this.ratingsService.getRatingsByConsultant(consultantId);
        return res.success(response)
    }

    @Get('appointment/:id')
    @ApiOperation({ summary: 'Get rating for a specific appointment' })
    @ApiParam({ name: 'id', description: 'Appointment ID', type: Number })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Rating for the appointment',
        type: RatingResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Rating not found for this appointment',
    })
    findByAppointment(
        @Param('id', ParseIntPipe) appointmentId: number,
    ): Promise<RatingResponseDto> {
        return this.ratingsService.getRatingByAppointment(appointmentId);
    }

    @Get('consultant/:id/average')
    @ApiOperation({ summary: 'Get average rating and count for a consultant' })
    @ApiParam({ name: 'id', description: 'Consultant ID', type: Number })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Average rating and count',
        schema: {
            type: 'object',
            properties: {
                average: { type: 'number', example: 4.5 },
                count: { type: 'number', example: 10 },
            },
        },
    })
    getAverageRating(
        @Param('id', ParseIntPipe) consultantId: number,
    ): Promise<{ average: number; count: number }> {
        return this.ratingsService.getConsultantAverageRating(consultantId);
    }
}