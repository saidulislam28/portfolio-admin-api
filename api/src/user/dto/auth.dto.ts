// auth.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { USER_ROLE } from '@prisma/client';
import { IsEmail, IsEnum, IsIn, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsUrl, MinLength } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({ description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User password (min 6 characters)' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ description: 'User full name' })
  @IsOptional()
  @IsString()
  full_name?: string;

  @ApiProperty({ description: 'User phone number' })
  // @IsPhoneNumber()
  phone?: string;

  @ApiProperty({ description: 'Expected user level' })
  @IsString()
  expected_level: string;

  @ApiPropertyOptional({ 
    description: 'User role',
    enum: USER_ROLE,
    default: USER_ROLE.USER 
  })
  @IsOptional()
  @IsEnum(USER_ROLE)
  role?: USER_ROLE;
}

export class LoginUserDto {
  @ApiProperty({ description: 'User email address', example: 'user1@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User password', example: '123456' })
  @IsString()
  password: string;
}

export class SocialLoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'https://example.com/profile.jpg', required: false })
  @IsOptional()
  @IsUrl()
  profilePicture?: string;

  @ApiProperty({ enum: ['google', 'facebook'] })
  @IsIn(['google', 'facebook'])
  @IsNotEmpty()
  provider: string;

  @ApiProperty({ example: '1234567890' })
  @IsString()
  @IsNotEmpty()
  providerId: string;

  @ApiProperty({ example: 'social_platform_token' })
  @IsString()
  @IsNotEmpty()
  accessToken: string;
}

export class VerifyOtpDto {
  @ApiProperty({ description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'OTP code (6 digits)' })
  @IsNotEmpty()
  otp: number;
}

export class ResetPasswordDto {
  @ApiProperty({ description: 'Email or phone associated with account' })
  @IsNotEmpty()
  email_or_phone: string;

  @ApiProperty({ description: 'OTP code received via email' })
  @IsNotEmpty()
  otp: number;

  @ApiProperty({ description: 'New password (min 6 characters)' })
  @IsString()
  @MinLength(6)
  password: string;
}

export class ResendOtpDto {
  @ApiProperty({ description: 'User email address' })
  @IsEmail()
  email: string;
}

export class LoginResponseDto {
  @ApiProperty({ description: 'User ID' })
  id: number;

  @ApiProperty({ description: 'User email' })
  email: string;

  @ApiProperty({ description: 'User phone number' })
  phone: string;

  @ApiProperty({ description: 'User role', enum: USER_ROLE })
  role: USER_ROLE;

  @ApiProperty({ description: 'JWT access token' })
  token: string;

  @ApiPropertyOptional({ description: 'User full name' })
  full_name?: string;

  @ApiProperty({ description: 'Expected user level' })
  expected_level: string;

  @ApiProperty({ description: 'Whether user is verified' })
  is_verified: boolean;
}

export class RegisterResponseDto {
  @ApiProperty({ description: 'User ID' })
  id: number;

  @ApiProperty({ description: 'User email' })
  email: string;

  @ApiProperty({ description: 'User phone number' })
  phone: string;

  @ApiProperty({ description: 'User role', enum: USER_ROLE })
  role: USER_ROLE;

  @ApiPropertyOptional({ description: 'User full name' })
  full_name?: string;

  @ApiProperty({ description: 'Expected user level' })
  expected_level: string;

  @ApiProperty({ description: 'Whether user is verified' })
  is_verified: boolean;
}