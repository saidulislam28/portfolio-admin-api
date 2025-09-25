/* eslint-disable */

import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { res } from 'src/common/response.helper';
import { ConversationFeedbackResponseDto, CreateConversationFeedbackDto } from '../dto/conversation-feedback.dto';
import { ConversationFeedbackService } from '../services/conversation-feedback.service';

import { JwtAuthGuard } from 'src/user-auth/jwt/jwt-auth.guard';
import { RolesGuard } from 'src/user-auth/jwt/roles.guard';
import { HasRoles } from 'src/user-auth/jwt/has-roles.decorator';
import { Role } from 'src/user-auth/dto/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@HasRoles(Role.Consultant)
@ApiTags('Consultant: Conversation Feedback')
@ApiBearerAuth()
@Controller('conversation-feedback')
export class ConversationfeedbackController {
  constructor(
    private readonly conversationFeedbackService: ConversationFeedbackService
  ) { }

  @Post()
  @ApiOperation({
    summary: 'Create conversation feedback',
    description: 'Creates feedback for a conversation session and sends it via email to the user.'
  })
  @ApiBody({
    type: CreateConversationFeedbackDto,
    description: 'Conversation feedback data'
  })
  @ApiCreatedResponse({
    type: ConversationFeedbackResponseDto,
    description: 'Feedback created successfully and email sent'
  })
  @ApiBadRequestResponse({ description: 'Appointment ID is required or invalid data' })
  @ApiNotFoundResponse({ description: 'Appointment not found or user email not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized - Invalid or missing authentication token' })
  @ApiForbiddenResponse({ description: 'Forbidden - Insufficient permissions' })
  async create(@Body() feedbackData: CreateConversationFeedbackDto, @Req() req) {
    const { id } = req.user;
    const response = await this.conversationFeedbackService.createFeedback(feedbackData, +id);
    return res.success(response);
  }
}