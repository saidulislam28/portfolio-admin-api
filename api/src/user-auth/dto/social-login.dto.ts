import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum SocialProvider {
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
}

export class SocialLoginDto {
  @ApiProperty({ 
    enum: SocialProvider, 
    example: SocialProvider.GOOGLE,
    description: 'Social provider used for login'
  })
  @IsEnum(SocialProvider)
  provider: SocialProvider;

  @ApiProperty({
    description: 'OAuth access token or ID token from provider',
    example: 'ya29.a0AfH6SMD...'
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    description: 'Full name of the user from social profile',
    example: 'John Doe',
    required: false
  })
  @IsString()
  @IsOptional()
  full_name?: string;
  
  @ApiProperty({
    description: 'Email address from social provider',
    example: 'john.doe@example.com',
    required: false
  })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'URL to the user’s profile picture from social provider',
    example: 'https://lh3.googleusercontent.com/...',
    required: true
  })
  @IsString()
  @IsOptional()
  profile_image?: string;
}