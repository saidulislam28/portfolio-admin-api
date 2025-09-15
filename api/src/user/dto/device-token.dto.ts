import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiProperty } from '@nestjs/swagger';

/**
 * DTO: Request payload for registering device token
 */
export class RegisterDeviceTokenDto {
  @ApiProperty({ description: 'The device token string', example: '1231213' })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ description: 'ID of the user who owns the token', example: 2 })
  @IsNumber()
  @IsOptional()
  user_id: number;

  // either user_id or consultant_id only one will be passed
  @ApiProperty({ description: 'ID of the consultant who owns the token', example: 3 })
  @IsNumber()
  @IsOptional()
  consultant_id: number;
}

/**
 * DTO: Response object for success
 */
export class DeviceTokenResponseDto {
  @ApiProperty({ description: 'Success status' })
  success: boolean;

  @ApiProperty({ description: 'The registered token details or metadata' })
  data: any;
}
