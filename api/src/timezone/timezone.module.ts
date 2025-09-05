import { Module } from '@nestjs/common';
import { TimezoneServiceImpl } from './timezone.service';
import { UserCacheModule } from '../user-cache/user-cache.module';

@Module({
  imports: [UserCacheModule],
  providers: [
    {
      provide: 'TimezoneService',
      useClass: TimezoneServiceImpl,
    },
  ],
  exports: ['TimezoneService'],
})
export class TimezoneModule {}