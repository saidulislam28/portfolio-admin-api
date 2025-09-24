import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MetricsService } from './metrics.service';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  constructor(private metrics: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();
    const method = req.method;
    const route = context.getHandler().name || req.route?.path || req.path || 'unknown';

    const end = this.metrics.requestHistogram.startTimer({ method, route });
    const start = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const status = String(res.statusCode);
          this.metrics.requestsCounter.inc({ method, route, status_code: status });
          end({ status_code: status });
        },
        error: (err) => {
          this.metrics.errorsCounter.inc({ method, route, exception: err?.name ?? 'error' });
          end({ status_code: '500' });
        }
      })
    );
  }
}
