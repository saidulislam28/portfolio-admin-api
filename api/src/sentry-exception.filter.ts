import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import * as Sentry from '@sentry/node';

@Catch()
export class SentryExceptionFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    // Capture the exception using Sentry
    Sentry.captureException(exception);

    // Call the parent method to handle the exception
    super.catch(exception, host);
  }
}
