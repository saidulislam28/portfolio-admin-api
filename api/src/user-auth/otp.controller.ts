import { Body, Controller, Post, Request } from '@nestjs/common';

import { res } from '../common/response.helper';
import SmsService from "../email/sms.service";
import { SendOtpDto } from "./dto/sendOtp.dto";
import { OtpService } from './otp.service';

@Controller('auth')
export class OtpController {
  constructor(
    private readonly otpService: OtpService,
    private readonly smsService: SmsService,
  ) { }

  @Post('send-otp')
  async sendOtp(@Request() req, @Body() payload: SendOtpDto) {

    const otp_req = await this.otpService.createOtp(payload?.phone);

    const testUser = await this.otpService.getTestUser(payload?.phone);
    if (testUser) {
      return res.success({ otp: otp_req?.otp }, 201)
    }
    const text = `Welcome to ${process.env.APP_NAME}. Your OTP is: ${otp_req.otp}`

    if (process.env.NODE_ENV !== 'development') {
      await this.smsService.sendSMS(payload.phone, text);
    }

    return res.success({}, 201)
  }

}
