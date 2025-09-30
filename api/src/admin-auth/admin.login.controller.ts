import { Body, Controller, HttpCode, HttpException, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { res } from '../common/response.helper';
import { AdminAuthService } from './admin.password-reset.service';
import { AdminLoginDto } from './dto/adminLogin.dto';
import { CreateAdminUserDto } from './dto/createAdminUser.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';

@ApiTags('Admin: Authentication')
@Controller('admin')
export class AdminLoginController {
  constructor(
    private readonly adminAuthService: AdminAuthService,
  ) { }

  @ApiOperation({ summary: 'Admin login', description: 'Authenticate admin user and return access token' })
  @ApiBody({ type: AdminLoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      example: {
        success: true,
        message: 'User login successful',
        data: {
          access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          user: {
            id: 1,
            email: 'admin@example.com',
            first_name: 'John',
            last_name: 'Doe',
            role: 'admin'
          }
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid credentials' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AuthGuard(['admin']))
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req, @Body() payload: AdminLoginDto) {
    const data = await this.adminAuthService.loginAdminUser(req.user);
    if (!data) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }
    return res.success(data, 'User login successful');
  }

  @ApiOperation({ summary: 'Forgot password', description: 'Send password reset code to email' })
  @ApiBody({
    description: 'Email address to send reset code',
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'admin@example.com'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Reset code sent if email exists',
    schema: {
      example: {
        success: true,
        message: 'We sent a reset code to the email if the email exists',
        data: {}
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid email format' })
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async sendPasswordResetCodeToEmail(@Request() req, @Body('email') email: string) {
    await this.adminAuthService.sendPasswordResetCodeToEmail(email);
    return res.success({}, 'We sent a reset code to the email if the email exists');
  }

  @ApiOperation({ summary: 'Reset password', description: 'Reset password using email and reset code' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password reset successful',
    schema: {
      example: {
        success: true,
        message: 'Password reset successful! Please login',
        data: {}
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid email or reset code' })
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Request() req, @Body('email') email: string,
    @Body('reset_code') reset_code: string,
    @Body('new_password') new_password: string) {
    const isSuccess = await this.adminAuthService.resetPassword(email, reset_code, new_password);
    if (!isSuccess) {
      throw new HttpException('Invalid email or code', HttpStatus.BAD_REQUEST);
    }
    return res.success({}, 'Password reset successful! Please login');
  }

  @ApiOperation({ summary: 'Create initial admin user', description: 'Create the first admin user (only works when no admin users exist)' })
  @ApiBody({ type: CreateAdminUserDto })
  @ApiResponse({
    status: 201,
    description: 'Admin user created successfully',
    schema: {
      example: {
        success: true,
        message: 'User created',
        data: {
          id: 1,
          email: 'admin@example.com',
          first_name: 'John',
          last_name: 'Doe',
          role: 'admin',
          created_at: '2024-01-01T00:00:00.000Z'
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Admin users already exist' })
  @ApiResponse({ status: 400, description: 'Failed to create user' })
  @Post('U39Oxv4w0fGVh3bVtxAVMlwGS3A3FaZP8PdyDn9y2UPujOfR10hBSPFaRO5ud6fQ')
  @HttpCode(HttpStatus.CREATED)
  async createAdminUser(@Request() req, @Body() payload: CreateAdminUserDto) {
    const data = await this.adminAuthService.createAdminUser(
      payload.email,
      payload.first_name,
      payload.last_name,
      payload.password,
    );
    if (!data) {
      throw new HttpException('Failed', HttpStatus.BAD_REQUEST);
    }
    return res.success(data, 'User created');
  }
}