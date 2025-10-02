import { HttpException } from '@nestjs/common';
import { Injectable, BadRequestException, ForbiddenException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { USER_ROLE } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtSignService } from 'src/user-auth/jwt.sign.service';
import { ForgetPasswordDTO, OtpVerificationDto } from './dto/query.dto';
import { RegisterUserDto, LoginUserDto, ResetPasswordDto } from './dto/auth.dto';
import { use } from 'passport';
import { Role } from 'src/user-auth/dto/role.enum';

@Injectable()
export class AuthService {
  private transporter: nodemailer.Transporter;

  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
    private jwtSignService: JwtSignService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASSWORD'),
      },
    });
  }

  async registerUser(userData: RegisterUserDto) {
    const existingUser = await this.prismaService.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const hash = await bcrypt.hash(userData.password.toString(), 10);
    userData.password = hash;

    const user = await this.prismaService.user.create({
      data: userData,
    });

    delete user['password'];
    return user;
  }

  async createOtp(data: { email: string }) {
    const otp_code = crypto.randomInt(100000, 999999);
    const now = new Date();
    const expires_at = new Date(now.getTime() + 3 * 60 * 1000); // 3 minutes

    // Delete existing OTPs for this email
    await this.prismaService.otpVerification.deleteMany({
      where: { email: data.email },
    });

    return await this.prismaService.otpVerification.create({
      data: {
        email: data.email,
        otp: otp_code,
        expires_at,
      },
    });
  }

  async verifyOtp(data: OtpVerificationDto) {
    const check = await this.prismaService.otpVerification.findFirst({
      where: {
        otp: data.otp,
        email: data.email
      }
    });

    if (!check) {
      throw new HttpException('Invalid OTP', HttpStatus.NOT_FOUND);
    }

    const user = await this.prismaService.user.findFirst({ where: { email: data.email } });

    if (!user) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }

    await this.prismaService.otpVerification.delete({ where: { id: check.id } });

    const updatedUser = await this.prismaService.user.update({
      where: { id: user.id },
      data: { is_verified: true }
    });

    console.log("updated user>>>", updatedUser);

    const access_token = await this.jwtSignService.signJwt({
      id: updatedUser.id,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: Role.User,
    });

    delete updatedUser['password'];
    delete updatedUser['updated_at'];
    delete updatedUser['login_type'];

    return {
      verified: true,
      user: {
        ...updatedUser,
        token: access_token
      }
    };
  }

  async loginUser(data: LoginUserDto) {
    const normalizedEmail = data.email.trim().toLowerCase();

    const user = await this.prismaService.user.findFirst({
      where: {
        email: {
          equals: normalizedEmail,
          mode: 'insensitive',
        },
      },
    });

    if (user === null) {
      throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED);
    }

    if (!user.is_verified) {
      throw new HttpException(
        'This user is not verified',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const isPasswordMatch = await bcrypt.compare(data.password, user?.password);
    if (!isPasswordMatch) {
      throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED);
    }

    const access_token = await this.jwtSignService.signJwt({
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: Role.User,
    });

    delete user['password'];
    delete user['updated_at'];
    delete user['login_type'];

    return {
      ...user,
      token: access_token,
    };
  }

  async forgetPassword(data: ForgetPasswordDTO) {
    const user = await this.prismaService.user.findFirst({
      where: { email: data?.email_or_phone },
    });

    if (!user) {
      throw new HttpException('User Not found', HttpStatus.UNAUTHORIZED);
    }

    if (!user.is_verified) {
      throw new HttpException(
        'This user is not verified',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    return {
      success: true,
      email: user.email
    };
  }

  async resetPassword(data: ResetPasswordDto) {
    const user = await this.prismaService.user.findFirst({
      where: { email: data.email_or_phone }
    });

    if (user === null) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }

    const findOtp = await this.prismaService.otpVerification.findFirst({
      where: { email: data.email_or_phone, otp: data.otp }
    });

    if (findOtp === null) {
      throw new HttpException('OTP Not Valid', HttpStatus.BAD_REQUEST);
    }

    await this.prismaService.otpVerification.delete({ where: { id: findOtp.id } });

    const hash = await bcrypt.hash(data.password.toString(), 10);

    const updateUser = await this.prismaService.user.update({
      where: { id: user.id },
      data: { password: hash }
    });

    const access_token = await this.jwtSignService.signJwt({
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });

    delete user['password'];
    delete user['created_at'];
    delete user['updated_at'];
    delete user['login_type'];

    return {
      ...user,
      token: access_token,
    };
  }

  async resendOtp(email: string, clientIp: string) {
    // Check if user exists
    const user = await this.prismaService.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Check if user is already verified
    if (user.is_verified) {
      throw new BadRequestException('User is already verified');
    }

    const now = new Date();
    const thirtySecondsAgo = new Date(now.getTime() - 30 * 1000);

    // Check rate limiting by IP
    const ipAttempts = await this.prismaService.otpResendLog.findMany({
      where: {
        ip_address: clientIp,
        created_at: {
          gte: thirtySecondsAgo
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    if (ipAttempts.length >= 10) {
      throw new ForbiddenException('Too many requests from this IP. Please try again later.');
    }

    // Check user-specific rate limiting
    const userAttempts = await this.prismaService.otpResendLog.findMany({
      where: {
        email: email,
        created_at: {
          gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    // Check if user has exceeded maximum attempts (5 times)
    if (userAttempts.length >= 5) {
      throw new ForbiddenException('Maximum resend attempts reached. Please try again after 24 hours or contact support.');
    }

    // Check 30-second delay between requests
    if (userAttempts.length > 0) {
      const lastAttempt = userAttempts[0];
      const timeSinceLastAttempt = now.getTime() - lastAttempt.created_at.getTime();

      if (timeSinceLastAttempt < 30000) { // 30 seconds
        const remainingTime = Math.ceil((30000 - timeSinceLastAttempt) / 1000);
        throw new BadRequestException(`Please wait ${remainingTime} seconds before requesting another OTP.`);
      }
    }

    // Check if there's a valid OTP that hasn't expired yet
    const existingOtp = await this.prismaService.otpVerification.findFirst({
      where: {
        email: email,
        expires_at: {
          gt: now
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    let otpData;

    if (existingOtp) {
      // If there's a valid OTP, use it
      otpData = existingOtp;
    } else {
      // Generate new OTP
      const otp = Math.floor(100000 + Math.random() * 900000);
      const expiresAt = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes

      // Invalidate old OTPs
      await this.prismaService.otpVerification.updateMany({
        where: { email: email },
        data: { is_used: true }
      });

      // Create new OTP
      otpData = await this.prismaService.otpVerification.update({
        where: { email: email },
        data: {
          otp: otp,
          expires_at: expiresAt,
          is_used: false
        }
      });
    }

    // Log the resend attempt
    await this.prismaService.otpResendLog.create({
      data: {
        email: email,
        ip_address: clientIp,
        user_agent: '', // You can pass this from the request if needed
        created_at: now
      }
    });

    const remainingAttempts = 5 - (userAttempts.length + 1);
    const nextResendAvailableAt = new Date(now.getTime() + 30 * 1000);

    return {
      otp: otpData.otp,
      remaining_attempts: remainingAttempts,
      next_resend_available_at: nextResendAvailableAt
    };
  }
}