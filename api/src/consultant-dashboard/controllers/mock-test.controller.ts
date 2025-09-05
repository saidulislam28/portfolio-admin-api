/* eslint-disable */
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse
} from '@nestjs/swagger';
import { res } from 'src/common/response.helper';
import { MockTestFeedbackService } from '../services/mock-test.service';
import { JwtAuthGuard } from 'src/user-auth/jwt/jwt-auth.guard';
import { RolesGuard } from 'src/user-auth/jwt/roles.guard';
import { CreateMockTestFeedbackDto, MockTestFeedbackListResponseDto, MockTestFeedbackResponseDto } from '../dto/mock-test-feedback.dto';

@ApiTags('Consultant: Mocktest Feedback')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('mocktest-feedback')
export class MockTestFeedbackController {
  constructor(
    private readonly mockTestFeedbackService: MockTestFeedbackService,
  ) { }

  @Get()
  @ApiOperation({
    summary: 'Get all mock test feedbacks',
    description: 'Retrieves a list of all mock test feedback records.'
  })
  @ApiOkResponse({
    type: MockTestFeedbackListResponseDto,
    description: 'List of mock test feedbacks retrieved successfully'
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing authentication token'
  })
  @ApiForbiddenResponse({
    description: 'Forbidden - Insufficient permissions'
  })
  async getAll() {
    const response = await this.mockTestFeedbackService.getAllFeedbacks();
    return res.success(response);
  }

  @Post()
  @ApiOperation({
    summary: 'Create mock test feedback',
    description: 'Creates feedback for a mock test session.'
  })
  @ApiBody({
    type: CreateMockTestFeedbackDto,
    description: 'Mock test feedback data'
  })
  @ApiCreatedResponse({
    type: MockTestFeedbackResponseDto,
    description: 'Mock test feedback created successfully'
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or missing required fields'
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
  async create(@Body() feedbackData: CreateMockTestFeedbackDto, @Req() req) {
    const { id } = req.user;
    const response = await this.mockTestFeedbackService.createFeedback(feedbackData, +id);
    return res.success(response);
  }
}