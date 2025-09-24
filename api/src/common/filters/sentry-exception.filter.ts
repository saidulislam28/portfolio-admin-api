import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { MetricsService } from '../../metrics/metrics.service';
import { SentryExceptionCaptured } from '@sentry/nestjs';

@Catch()
export class SentryExceptionFilter implements ExceptionFilter {
  constructor(private metrics: MetricsService) {}

  @SentryExceptionCaptured()
  catch(exception: unknown, host: ArgumentsHost) {
    console.log('caughtssss')
    // const ctx = host.switchToHttp();
    // const res = ctx.getResponse();
    // const req = ctx.getRequest();
    // const status =
    //   exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    // // increment error metric
    // const route = req.route?.path || req.path || 'unknown';
    // const method = req.method;
    // this.metrics.errorsCounter.inc({ method, route, exception: exception?.constructor?.name ?? 'Error' });

    // if (!res.headersSent) {
    //   res.status(status).json({
    //     statusCode: status,
    //     message: status === 500 ? 'Internal server error' : (exception as any).message,
    //   });
    // }
  }
}
