import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { UserCacheServiceImpl } from './user-cache.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        // store: redisStore,
        // host: configService.get('REDIS_HOST', 'localhost'),
        // port: configService.get('REDIS_PORT', 6379),
        // password: configService.get('REDIS_PASSWORD'),
        // db: configService.get('REDIS_DB', 0),
        // ttl: 60 * 60 * 24, // 24 hours
      }),
      inject: [ConfigService],
    }),
    PrismaModule,
  ],
  providers: [
    {
      provide: 'UserCacheService',
      useClass: UserCacheServiceImpl,
    },
  ],
  exports: ['UserCacheService'],
})
export class UserCacheModule {}