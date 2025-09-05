import { Module, Global } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CacheInvalidationInterceptor } from './interceptors/cache-invalidation.interceptor';
import { CacheInvalidationListener } from './listeners/cache-invalidation.listener';
import { UserCacheModule } from '../user-cache/user-cache.module';

@Global()
@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: false,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 10,
      verboseMemoryLeak: false,
      ignoreErrors: false,
    }),
    UserCacheModule,
  ],
  providers: [
    CacheInvalidationInterceptor,
    CacheInvalidationListener,
  ],
  exports: [
    CacheInvalidationInterceptor,
    EventEmitterModule,
  ],
})
export class CommonModule {}