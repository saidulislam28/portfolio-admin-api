import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { res } from 'src/common/response.helper';
import { DeviceTokenService } from './device-token.service';
import {
  DeviceTokenResponseDto,
  RegisterDeviceTokenDto,
} from './dto/device-token.dto';

@ApiTags('User Device Tokens')
@Controller('user/device-tokens')
export class DeviceTokenController {
  constructor(private readonly deviceTokenService: DeviceTokenService) {}

  @Post()
  @ApiOperation({ summary: 'Register a device token for a user' })
  @ApiResponse({
    status: 201,
    description: 'Device token registered successfully',
    type: DeviceTokenResponseDto,
  })
  @ApiBody({
    type: RegisterDeviceTokenDto,
    description: 'Device token data',
  })
  @ApiResponse({
    status: 400,
    description: 'Missing token, user_id, or consultant_id',
  })
  async registerToken(
    @Body() dto: RegisterDeviceTokenDto,
  ): Promise<DeviceTokenResponseDto> {
    const result = await this.deviceTokenService.registerToken(dto);

    return res.success(result);
  }
}
