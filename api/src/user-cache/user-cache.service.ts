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
   * Update user info if token or timezone has changed
   */
  async updateUserInfo(
    userId: number, 
    userType: 'user' | 'consultant', 
    token?: string, 
    timezone?: string
  ): Promise<CachedUserInfo | null> {
    try {
      // Get current cached info
      const cachedInfo = await this.getUserInfo(userId, userType);
      
      // Check if values are the same as cached
      const tokenSame = cachedInfo?.pushToken === token || (!cachedInfo?.pushToken && !token);
      const timezoneSame = cachedInfo?.timezone === timezone || (!timezone && cachedInfo?.timezone === 'UTC');
      
      if (cachedInfo && tokenSame && timezoneSame) {
        this.logger.debug(`No changes detected for ${userType} ${userId}, skipping update`);
        return cachedInfo;
      }

      this.logger.debug(`Changes detected for ${userType} ${userId}, updating database and cache`);

      // Update database
      const updatedData: { token?: string; timezone?: string } = {};
      if (token !== undefined) updatedData.token = token;
      if (timezone !== undefined) updatedData.timezone = timezone;

      let updatedUser;
      if (userType === 'user') {
        updatedUser = await this.prisma.user.update({
          where: { id: userId },
          data: updatedData,
          select: {
            id: true,
            timezone: true,
            token: true,
          },
        });
      } else {
        updatedUser = await this.prisma.consultant.update({
          where: { id: userId },
          data: updatedData,
          select: {
            id: true,
            timezone: true,
            token: true,
          },
        });
      }

      // Create updated cache info
      const updatedCacheInfo: CachedUserInfo = {
        id: updatedUser.id,
        timezone: updatedUser.timezone || 'UTC',
        pushToken: updatedUser.token || undefined,
        type: userType,
      };

      // Update cache
      await this.setUserInfo(updatedCacheInfo);
      
      this.logger.debug(`Successfully updated ${userType} ${userId} info`);
      return updatedCacheInfo;

    } catch (error) {
      this.logger.error(`Error updating user info for ${userType} ${userId}:`, error);
      return null;
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