import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse,ApiTags } from '@nestjs/swagger';
import { CACHE_TTL } from 'src/common/constants';
import { res } from 'src/common/response.helper';

import { GetHomeDataResponseDto } from '../dtos/app-setting.dto';
import { AppSettingService } from '../services/app-setting.service';

@ApiTags('User: App Settings')
@UseInterceptors(CacheInterceptor)
@Controller('app-setting')
export class AppSettingsController {
  constructor(private readonly appSettingService: AppSettingService) {}

  @CacheTTL(CACHE_TTL.threeminute)
  @Get('app-data')
  @ApiOperation({ summary: 'Get all essential app data for the home screen' })
  @ApiResponse({
    status: 200,
    description: 'Returns a complex object with all app-specific settings and data.',
    type: GetHomeDataResponseDto,
  })
  async getHomeData() {
    const response = await this.appSettingService.getHomeData();
    return res.success(response);
  }
}