import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'User email address',
    example: 'admin@example.com'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Password reset code received via email',
    example: '123456'
  })
  @IsString()
  @IsNotEmpty()
  reset_code: string;

  @ApiProperty({
    description: 'New password (min 6 characters)',
    example: 'newSecurePassword123',
    minLength: 6
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  new_password: string;
}