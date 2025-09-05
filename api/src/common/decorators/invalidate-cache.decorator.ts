import { SetMetadata } from '@nestjs/common';

export const INVALIDATE_CACHE_KEY = 'invalidate_cache';

export interface InvalidateCacheOptions {
  userIdParam?: string;
  userTypeParam?: string;
  condition?: (result: any, params: any) => boolean;
}

export const InvalidateCache = (options: InvalidateCacheOptions = {}) =>
  SetMetadata(INVALIDATE_CACHE_KEY, options);