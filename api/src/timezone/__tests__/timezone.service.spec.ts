import { Test, TestingModule } from '@nestjs/testing';
import { TimezoneServiceImpl } from '../timezone.service';
import { UserCacheService } from '../../user-cache/interfaces/user-cache.interface';

describe('TimezoneService', () => {
  let service: TimezoneServiceImpl;
  let userCacheService: jest.Mocked<UserCacheService>;

  beforeEach(async () => {
    const mockUserCacheService = {
      getUserInfo: jest.fn(),
      setUserInfo: jest.fn(),
      invalidateUserInfo: jest.fn(),
      bulkInvalidateUserInfo: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TimezoneServiceImpl,
        {
          provide: 'UserCacheService',
          useValue: mockUserCacheService,
        },
      ],
    }).compile();

    service = module.get<TimezoneServiceImpl>(TimezoneServiceImpl);
    userCacheService = module.get('UserCacheService');
  });

  describe('formatDateTimeForUser', () => {
    it('should format UTC time to user timezone', async () => {
      const utcDate = new Date('2024-01-15T10:00:00.000Z');
      const userId = 1;
      const userType = 'user';

      userCacheService.getUserInfo.mockResolvedValue({
        id: 1,
        timezone: 'America/New_York',
        pushToken: 'token123',
        type: 'user',
      });

      const result = await service.formatDateTimeForUser(
        utcDate,
        userId,
        userType,
        "hh:mm a 'on' MMMM d, yyyy"
      );

      expect(result).toContain('05:00 AM on January 15, 2024');
      expect(userCacheService.getUserInfo).toHaveBeenCalledWith(1, 'user');
    });

    it('should fallback to UTC when user timezone is not found', async () => {
      const utcDate = new Date('2024-01-15T10:00:00.000Z');
      
      userCacheService.getUserInfo.mockResolvedValue(null);

      const result = await service.formatDateTimeForUser(
        utcDate,
        1,
        'user',
        "hh:mm a 'on' MMMM d, yyyy"
      );

      expect(result).toContain('10:00 AM on January 15, 2024');
    });

    it('should handle invalid timezone gracefully', async () => {
      const utcDate = new Date('2024-01-15T10:00:00.000Z');
      
      userCacheService.getUserInfo.mockResolvedValue({
        id: 1,
        timezone: 'Invalid/Timezone',
        type: 'user',
      });

      const result = await service.formatDateTimeForUser(
        utcDate,
        1,
        'user',
        "hh:mm a 'on' MMMM d, yyyy"
      );

      // Should fallback to UTC
      expect(result).toContain('10:00 AM on January 15, 2024');
    });
  });

  describe('convertToUserTimezone', () => {
    it('should convert UTC to user timezone', async () => {
      const utcDate = new Date('2024-01-15T10:00:00.000Z');
      
      userCacheService.getUserInfo.mockResolvedValue({
        id: 1,
        timezone: 'Asia/Tokyo',
        type: 'user',
      });

      const result = await service.convertToUserTimezone(utcDate, 1, 'user');
      
      // Tokyo is UTC+9
      expect(result.getHours()).toBe(19); // 10 + 9 = 19
    });
  });
});