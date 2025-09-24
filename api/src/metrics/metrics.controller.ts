import { Controller, Get, Header, Response } from '@nestjs/common';
import { MetricsService } from './metrics.service';

@Controller()
export class MetricsController {
  constructor(private metrics: MetricsService) {}

  @Get('metrics')
  @Header('Content-Type', 'text/plain; version=0.0.4')
  async getMetrics(@Response() res) {
    res.send(await this.metrics.metrics());
  }
}
