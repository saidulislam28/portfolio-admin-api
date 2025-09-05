import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { INVALIDATE_CACHE_KEY, InvalidateCacheOptions } from '../decorators/invalidate-cache.decorator';
import { UserUpdatedEvent } from '../events/user-updated.event';

@Injectable()
export class CacheInvalidationInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    private eventEmitter: EventEmitter2,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const invalidateOptions = this.reflector.get<InvalidateCacheOptions>(
      INVALIDATE_CACHE_KEY,
      context.getHandler(),
    );

    if (!invalidateOptions) {
      return next.handle();
    }

    return next.handle().pipe(
      tap((result) => {
        const request = context.switchToHttp().getRequest();
        const { params, body } = request;

        // Determine if we should invalidate cache
        if (invalidateOptions.condition && !invalidateOptions.condition(result, { params, body })) {
          return;
        }

        // Extract user ID and type
        const userId = this.extractUserId(params, body, invalidateOptions.userIdParam);
        const userType = this.extractUserType(params, body, invalidateOptions.userTypeParam);

        if (userId && userType) {
          // Emit event for cache invalidation
          this.eventEmitter.emit(
            'user.updated',
            new UserUpdatedEvent(userId, userType, ['timezone', 'token']),
          );
        }
      }),
    );
  }

  private extractUserId(params: any, body: any, userIdParam?: string): number | null {
    const param = userIdParam || 'id';
    const id = params?.[param] || body?.[param] || body?.id;
    return id ? Number(id) : null;
  }

  private extractUserType(params: any, body: any, userTypeParam?: string): 'user' | 'consultant' | null {
    const param = userTypeParam || 'type';
    return params?.[param] || body?.[param] || body?.type || null;
  }
}