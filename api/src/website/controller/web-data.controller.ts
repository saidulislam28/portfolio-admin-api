import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse,ApiTags } from '@nestjs/swagger';
import { CACHE_TTL } from 'src/common/constants';
import { res } from 'src/common/response.helper';
import { WebDataSettingService } from '../service/web-data.service';


@ApiTags('Website: Website Settings')
@UseInterceptors(CacheInterceptor)
@Controller('web-setting')
export class WebDataSettingsController {
  constructor(private readonly webDataSettingService: WebDataSettingService) {}

  @CacheTTL(CACHE_TTL.threeminute)
  @Get('web-data')
  @ApiOperation({ summary: 'Get all essential website data for the home page' })
  @ApiResponse({
    status: 200,
    description: 'Returns a complex object with all app-specific settings and data.',
  })
  async getHomeData() {
    const response = await this.webDataSettingService.getHomeData();
    return res.success(response);
  }
}