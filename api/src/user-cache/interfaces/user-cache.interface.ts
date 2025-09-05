export interface CachedUserInfo {
  id: number;
  timezone: string;
  pushToken?: string;
  type: 'user' | 'consultant';
}

export interface UserCacheService {
  getUserInfo(userId: number, userType: 'user' | 'consultant'): Promise<CachedUserInfo | null>;
  setUserInfo(userInfo: CachedUserInfo): Promise<void>;
  invalidateUserInfo(userId: number, userType: 'user' | 'consultant'): Promise<void>;
  bulkInvalidateUserInfo(userIds: Array<{ id: number; type: 'user' | 'consultant' }>): Promise<void>;
}
