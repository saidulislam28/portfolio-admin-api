/* eslint-disable */
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
    ApiBody,
    ApiCreatedResponse,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags
} from '@nestjs/swagger';
import { res } from 'src/common/response.helper';

import { CreateFeedbackCommentDto, FeedbackCommentResponseDto } from '../dto/feedback.dto';
import { FeedbackCommentService } from '../services/feedback-comments.service';
import { JwtAuthGuard } from 'src/user-auth/jwt/jwt-auth.guard';
import { RolesGuard } from 'src/user-auth/jwt/roles.guard';
import { HasRoles } from 'src/user-auth/jwt/has-roles.decorator';
import { Role } from 'src/user-auth/dto/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@HasRoles(Role.Consultant)
@ApiTags('Consultant: Feedback Comments')
@Controller('feedback-comments')
// @HasRoles(Role.Admin)
export class FeedbackCommentController {
    constructor(
        private readonly feedbackCommentService: FeedbackCommentService,
    ) { }

    @Get()
    @ApiOperation({
        summary: 'Get all active feedback comments',
        description: 'Retrieves all active feedback comments sorted by sort_order in ascending order.'
    })
    @ApiOkResponse({
        type: [FeedbackCommentResponseDto],
        description: 'List of active feedback comments retrieved successfully'
    })
    @ApiInternalServerErrorResponse({ description: 'Internal server error while fetching feedback comments' })
    async getAll() {
        const response = await this.feedbackCommentService.getAllFeedbacks();
        return res.success(response);
    }
    @Get("mock-test")
    @ApiOperation({
        summary: 'Get all active mock test comments',
        description: 'Retrieves all active feedback comments sorted by sort_order in ascending order.'
    })
    @ApiOkResponse({
        type: [FeedbackCommentResponseDto],
        description: 'List of active feedback comments retrieved successfully'
    })
    @ApiInternalServerErrorResponse({ description: 'Internal server error while fetching feedback comments' })
    async getAllMockTestComments() {
        const response = await this.feedbackCommentService.getAllMocktestComments();
        return res.success(response);
    }
}