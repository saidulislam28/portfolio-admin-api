import { Body, Controller, HttpException, HttpStatus, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiExtraModels, ApiOperation, ApiQuery, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { USER_ROLE } from '@prisma/client';
import { Request } from 'express';
import { res } from 'src/common/response.helper';
import EmailService from 'src/email/email.service';

import { AuthService } from './auth.service';
import {
  LoginResponseDto,
  LoginUserDto,
  RegisterResponseDto,
  RegisterUserDto,
  ResendOtpDto,
  ResetPasswordDto,
  VerifyOtpDto
} from './dto/auth.dto';
import { ForgetPasswordDTO } from './dto/query.dto';

@ApiTags('User: Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
  ) { }

  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Creates a new user account and sends verification OTP via email'
  })
  @ApiQuery({
    name: 'userRole',
    required: false,
    enum: USER_ROLE,
    description: 'User role (defaults to USER if not provided)'
  })
  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully, OTP sent to email',
    type: RegisterResponseDto
  })
  @ApiResponse({ status: 400, description: 'Bad request - User already exists or invalid data' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async register(
    @Body() userData: RegisterUserDto,
    @Query('userRole') userRole: string,
  ) {
    if (userRole === 'CONSULTANT') {
      userData.role = USER_ROLE.CONSULTANT;
    } else {
      userData.role = USER_ROLE.USER;
    }

    const createUser = await this.authService.registerUser(userData);
    const otp_req = await this.authService.createOtp({ email: createUser.email, });

    const text = `Welcome to Speaking Portal. Your verification OTP code is: ${otp_req.otp}`;
    try {
      await this.emailService.sendEmail(
        createUser.email,
        `OTP For Verification For Register`,
        text,
      );
    } catch (e) {
      // Log email error but don't fail the registration
      console.error('Email sending failed:', e);
    }

    return res.success({ ...createUser });
  }

  @Post('verify-otp')
  @ApiOperation({
    summary: 'Verify OTP',
    description: 'Verify the OTP code sent to user email for account verification'
  })
  @ApiBody({ type: VerifyOtpDto })
  @ApiResponse({
    status: 200,
    description: 'OTP verified successfully, user account activated',
    schema: {
      type: 'object',
      properties: {
        verified: { type: 'boolean' },
        user: { $ref: getSchemaPath(LoginResponseDto) }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid OTP or email' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async verifyOtp(@Body() body: VerifyOtpDto) {
    const response = await this.authService.verifyOtp(body);
    return res.success(response);
  }

  @Post('login')
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticate user and return JWT token'
  })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: LoginResponseDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid credentials' })
  @ApiResponse({ status: 406, description: 'Not acceptable - User not verified' })
  async loginUser(@Body() data: LoginUserDto) {
    const user = await this.authService.loginUser(data);
    return res.success(user);
  }

  @Post('forget-password')
  @ApiOperation({
    summary: 'Forget password',
    description: 'Initiate password reset process by sending OTP to registered email'
  })
  @ApiBody({ type: ForgetPasswordDTO })
  @ApiResponse({
    status: 200,
    description: 'OTP sent successfully for password reset',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        email: { type: 'string' },
        email_send: { type: 'boolean' },
        create_otp: { type: 'boolean' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - User not found' })
  @ApiResponse({ status: 406, description: 'Not acceptable - User not verified' })
  async forgetPassword(@Body() data: ForgetPasswordDTO) {
    const user = await this.authService.forgetPassword(data);
    const otp_req = await this.authService.createOtp({ email: user.email, });

    const text = `Welcome to Speaking Portal. Your verification OTP code is: ${otp_req.otp}`;
    const sendEmail = await this.emailService.sendEmail(
      user.email,
      `OTP For Verification For Forget password`,
      text,
    );

    return res.success({ ...user, email_send: !!sendEmail, create_otp: !!otp_req });
  }

  @Post('reset-password')
  @ApiOperation({
    summary: 'Reset password',
    description: 'Reset user password using OTP verification'
  })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password reset successful',
    type: LoginResponseDto
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid OTP' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async resetPassword(@Body() data: ResetPasswordDto) {
    const user = await this.authService.resetPassword(data);
    return res.success(user);
  }

  @UseGuards(ThrottlerGuard)
  @Post('resend-otp')
  @ApiOperation({
    summary: 'Resend OTP',
    description: 'Resend OTP code with rate limiting protection'
  })
  @ApiBody({ type: ResendOtpDto })
  @ApiResponse({
    status: 200,
    description: 'OTP resent successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        email: { type: 'string' },
        remaining_attempts: { type: 'number' },
        next_resend_available_at: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - User not found or already verified' })
  @ApiResponse({ status: 403, description: 'Forbidden - Rate limit exceeded' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async resendOtp(@Body() body: ResendOtpDto, @Req() req: Request) {
    const clientIp = req.ip || req.connection.remoteAddress || 'unknown';

    try {
      const response = await this.authService.resendOtp(body.email, clientIp);

      // Send email with new OTP
      const text = `Welcome to Speaking Portal. Your verification OTP code is: ${response.otp}`;
      await this.emailService.sendEmail(
        body.email,
        `Resend OTP For Verification`,
        text,
      );

      return res.success({
        message: 'OTP has been resent successfully',
        email: body.email,
        remaining_attempts: response.remaining_attempts,
        next_resend_available_at: response.next_resend_available_at
      });
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to resend OTP',
        error.status || HttpStatus.BAD_REQUEST
      );
    }
  }
}