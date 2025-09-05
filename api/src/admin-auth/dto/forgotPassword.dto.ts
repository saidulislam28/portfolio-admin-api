import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Email address to send reset code',
    example: 'admin@example.com'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}