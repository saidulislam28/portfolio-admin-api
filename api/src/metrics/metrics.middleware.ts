import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { MetricsService } from './metrics.service';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  constructor(private metrics: MetricsService) {}

  use(req: Request, res: Response, next: Function) {
    const route = req.route?.path || req.path || 'unknown';
    const method = req.method;
    const end = this.metrics.requestHistogram.startTimer({ method, route });
    res.on('finish', () => {
      const status = String(res.statusCode);
      this.metrics.requestsCounter.inc({ method, route, status_code: status });
      end({ status_code: status });
      if (res.statusCode >= 500) {
        this.metrics.errorsCounter.inc({ method, route, exception: 'server_error' });
      }
    });
    next();
  }
}
