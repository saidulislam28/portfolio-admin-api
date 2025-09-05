import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject,Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';

import { PrismaService } from '../prisma/prisma.service';
import { CachedUserInfo, UserCacheService } from './interfaces/user-cache.interface';

@Injectable()
export class UserCacheServiceImpl implements UserCacheService {
  private readonly logger = new Logger(UserCacheServiceImpl.name);
  private readonly CACHE_TTL = 60 * 60 * 24; // 24 hours in seconds
  private readonly CACHE_PREFIX = 'user_info';

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private prisma: PrismaService,
  ) {}

  /**
   * Get user info from cache or database
   */
  async getUserInfo(userId: number, userType: 'user' | 'consultant'): Promise<CachedUserInfo | null> {
    try {
      const cacheKey = this.getCacheKey(userId, userType);
      
      // Try to get from cache first
      let cachedInfo = await this.cacheManager.get<CachedUserInfo>(cacheKey);
      
      if (cachedInfo) {
        this.logger.debug(`Cache hit for ${userType} ${userId}`);
        return cachedInfo;
      }

      // Cache miss - fetch from database
      this.logger.debug(`Cache miss for ${userType} ${userId}, fetching from database`);
      const dbInfo = await this.fetchFromDatabase(userId, userType);
      
      if (dbInfo) {
        // Cache the result
        await this.setUserInfo(dbInfo);
        return dbInfo;
      }

      return null;
    } catch (error) {
      this.logger.error(`Error getting user info for ${userType} ${userId}:`, error);
      // Fallback to database on cache error
      return this.fetchFromDatabase(userId, userType);
    }
  }

  /**
   * Set user info in cache
   */
  async setUserInfo(userInfo: CachedUserInfo): Promise<void> {
    try {
      const cacheKey = this.getCacheKey(userInfo.id, userInfo.type);
      await this.cacheManager.set(cacheKey, userInfo, this.CACHE_TTL);
      this.logger.debug(`Cached info for ${userInfo.type} ${userInfo.id}`);
    } catch (error) {
      this.logger.error(`Error caching user info for ${userInfo.type} ${userInfo.id}:`, error);
    }
  }

  /**
   * Invalidate user info from cache
   */
  async invalidateUserInfo(userId: number, userType: 'user' | 'consultant'): Promise<void> {
    try {
      const cacheKey = this.getCacheKey(userId, userType);
      await this.cacheManager.del(cacheKey);
      this.logger.debug(`Invalidated cache for ${userType} ${userId}`);
    } catch (error) {
      this.logger.error(`Error invalidating cache for ${userType} ${userId}:`, error);
    }
  }

  /**
   * Bulk invalidate multiple user infos
   */
  async bulkInvalidateUserInfo(userIds: Array<{ id: number; type: 'user' | 'consultant' }>): Promise<void> {
    try {
      const promises = userIds.map(({ id, type }) => this.invalidateUserInfo(id, type));
      await Promise.all(promises);
      this.logger.debug(`Bulk invalidated cache for ${userIds.length} users`);
    } catch (error) {
      this.logger.error('Error in bulk cache invalidation:', error);
    }
  }

  /**
   * Fetch user info from database
   */
  private async fetchFromDatabase(userId: number, userType: 'user' | 'consultant'): Promise<CachedUserInfo | null> {
    try {
      if (userType === 'user') {
        const user = await this.prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            timezone: true,
            token: true,
          },
        });

        if (!user) return null;

        return {
          id: user.id,
          timezone: user.timezone || 'UTC',
          pushToken: user.token || undefined,
          type: 'user',
        };
      } else {
        const consultant = await this.prisma.consultant.findUnique({
          where: { id: userId },
          select: {
            id: true,
            timezone: true,
            token: true,
          },
        });

        if (!consultant) return null;

        return {
          id: consultant.id,
          timezone: consultant.timezone || 'UTC',
          pushToken: consultant.token || undefined,
          type: 'consultant',
        };
      }
    } catch (error) {
      this.logger.error(`Database fetch error for ${userType} ${userId}:`, error);
      return null;
    }
  }

  /**
   * Generate cache key
   */
  private getCacheKey(userId: number, userType: 'user' | 'consultant'): string {
    return `${this.CACHE_PREFIX}:${userType}:${userId}`;
  }

  /**
   * Warm up cache for multiple users
   */
  async warmUpCache(userIds: Array<{ id: number; type: 'user' | 'consultant' }>): Promise<void> {
    try {
      const promises = userIds.map(({ id, type }) => this.getUserInfo(id, type));
      await Promise.all(promises);
      this.logger.debug(`Warmed up cache for ${userIds.length} users`);
    } catch (error) {
      this.logger.error('Error warming up cache:', error);
    }
  }
}