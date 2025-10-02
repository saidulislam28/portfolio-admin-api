import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserProfileDto {
  @ApiPropertyOptional({ description: 'User name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'User email' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'User phone number' })
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ description: 'Profile image URL' })
  @IsOptional()
  @IsString()
  profile_image?: string;
}

export class UpdateUserPasswordDto {
  @ApiProperty({ description: 'Current password' })
  @IsString()
  current_password: string;

  @ApiProperty({ description: 'New password' })
  @IsString()
  new_password: string;
}

export class UserProfileResponseDto {
  @ApiProperty({ description: 'User ID' })
  id: number;

  @ApiProperty({ description: 'User name' })
  name: string;

  @ApiProperty({ description: 'User email' })
  email: string;

  @ApiPropertyOptional({ description: 'User phone number' })
  phone?: string;

  @ApiPropertyOptional({ description: 'Profile image URL' })
  profile_image?: string;

  @ApiProperty({ description: 'User creation date' })
  created_at: Date;

  @ApiProperty({ description: 'User last update date' })
  updated_at: Date;
}