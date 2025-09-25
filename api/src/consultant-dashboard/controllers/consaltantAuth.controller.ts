/* eslint-disable */
import { Body, Controller, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiParam,
  ApiOkResponse
} from '@nestjs/swagger';
import { res } from 'src/common/response.helper';
import EmailService from 'src/email/email.service';

import { ConsultantResponseDto, ForgetPasswordDTO, LoginDto, OtpVerificationDto, registrationDTO, ResetPasswordDto, UpdateConsultantDto } from '../dto/consultant.dto';
import { ConsultantAuthService } from '../services/consaltantAuth.service';

@ApiTags('Consultant: Auth')
@Controller('consultant-auth')
export class ConsultantAuthController {
  constructor(
    private readonly consultantAuthService: ConsultantAuthService,
    private readonly emailService: EmailService,
  ) { }

  @Post('register')
  @ApiOperation({
    summary: 'Register a new consultant',
    description: 'Registers a new consultant account and sends verification OTP via email.'
  })
  @ApiBody({
    type: registrationDTO,
    description: 'Consultant registration data'
  })
  @ApiCreatedResponse({
    type: ConsultantResponseDto,
    description: 'Consultant registered successfully, OTP sent via email'
  })
  @ApiBadRequestResponse({
    description: 'User already exists or invalid input data'
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error during registration'
  })
  async register(
    @Body() userData: registrationDTO,
  ) {
    const createUser = await this.consultantAuthService.registerUser(userData);
    const otp_req = await this.consultantAuthService.createOtp({ email: createUser.email, });
    const text = `Welcome to Speaking Portal. Your verification OTP code is: ${otp_req.otp}`;
    const sendEamil = await this.emailService.sendEmail(
      createUser.email,
      `Otp For Verification For Register`,
      text,
    );
    return res.success({ ...createUser, email_send: !!sendEamil, create_otp: !!otp_req });
  }

  @Post('verify-otp')
  @ApiOperation({
    summary: 'Verify OTP',
    description: 'Verifies the OTP sent to consultant email for account verification.'
  })
  @ApiBody({
    type: OtpVerificationDto,
    description: 'OTP verification data'
  })
  @ApiOkResponse({
    description: 'OTP verified successfully, consultant account activated'
  })
  @ApiNotFoundResponse({
    description: 'Invalid OTP or consultant not found'
  })
  @ApiBadRequestResponse({
    description: 'Invalid OTP format'
  })
  async verifyOtp(@Body() body: OtpVerificationDto) {
    const response = await this.consultantAuthService.verifyOtp(body);
    return res.success(response)
  }

  @Post('login')
  @ApiOperation({
    summary: 'Consultant login',
    description: 'Authenticates consultant and returns JWT token.'
  })
  @ApiBody({
    type: LoginDto,
    description: 'Consultant login credentials'
  })
  @ApiOkResponse({
    type: ConsultantResponseDto,
    description: 'Login successful, returns consultant data with JWT token'
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials or consultant not verified'
  })
  @ApiNotFoundResponse({
    description: 'Consultant not found'
  })
  async loginUser(@Body() data: LoginDto) {
    const user = await this.consultantAuthService.loginUser(data);
    return res.success(user);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update consultant profile',
    description: 'Updates consultant profile information.'
  })
  @ApiParam({
    name: 'id',
    description: 'Consultant ID',
    type: Number,
    example: 1
  })
  @ApiBody({
    type: UpdateConsultantDto,
    description: 'Consultant update data'
  })
  @ApiOkResponse({
    type: ConsultantResponseDto,
    description: 'Consultant profile updated successfully'
  })
  @ApiNotFoundResponse({
    description: 'Consultant not found'
  })
  @ApiBadRequestResponse({
    description: 'Invalid update data'
  })
  async UpdateUser(@Body() data: UpdateConsultantDto, @Param("id", ParseIntPipe) id: number) {
    const user = await this.consultantAuthService.updateUser(id, data);
    return res.success(user);
  }

  @Post('forget-password')
  @ApiOperation({
    summary: 'Forget password',
    description: 'Initiates password reset process by sending OTP to consultant email.'
  })
  @ApiBody({
    type: ForgetPasswordDTO,
    description: 'Email or phone for password reset'
  })
  @ApiOkResponse({
    description: 'Password reset OTP sent successfully'
  })
  @ApiNotFoundResponse({
    description: 'Consultant not found'
  })
  @ApiBadRequestResponse({
    description: 'Consultant not verified'
  })
  async forgetPassword(@Body() data: ForgetPasswordDTO) {
    const user = await this.consultantAuthService.forgetPassword(data);
    const otp_req = await this.consultantAuthService.createOtp({ email: user.email, });
    const text = `Welcome to Speaking Portal. Your verification OTP code is: ${otp_req.otp}`;
    const sendEamil = await this.emailService.sendEmail(
      user.email,
      `Otp For Verification For Forget password`,
      text,
    );
    return res.success({ ...user, email_send: !!sendEamil, create_otp: !!otp_req });
  }

  @Post('reset-password')
  @ApiOperation({
    summary: 'Reset password',
    description: 'Resets consultant password using verified OTP.'
  })
  @ApiBody({
    type: ResetPasswordDto,
    description: 'Password reset data including OTP and new password'
  })
  @ApiOkResponse({
    type: ConsultantResponseDto,
    description: 'Password reset successful, returns updated consultant data with new token'
  })
  @ApiNotFoundResponse({
    description: 'Consultant not found or invalid OTP'
  })
  @ApiBadRequestResponse({
    description: 'Invalid OTP or password requirements not met'
  })
  async resetPassword(@Body() data: ResetPasswordDto) {
    const user = await this.consultantAuthService.resetPassword(data);
    return res.success(user);
  }
}