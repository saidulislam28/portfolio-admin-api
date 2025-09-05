import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { UserCacheServiceImpl } from '../user-cache.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('UserCacheService', () => {
  let service: UserCacheServiceImpl;
  let cacheManager: jest.Mocked<any>;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const mockCacheManager = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    };

    const mockPrismaService = {
      user: {
        findUnique: jest.fn(),
      },
      consultant: {
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserCacheServiceImpl,
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UserCacheServiceImpl>(UserCacheServiceImpl);
    cacheManager = module.get(CACHE_MANAGER);
    prismaService = module.get(PrismaService);
  });

  describe('getUserInfo', () => {
    it('should return cached user info when available', async () => {
      const cachedInfo = {
        id: 1,
        timezone: 'America/New_York',
        pushToken: 'token123',
        type: 'user' as const,
      };

      cacheManager.get.mockResolvedValue(cachedInfo);

      const result = await service.getUserInfo(1, 'user');

      expect(result).toEqual(cachedInfo);
      expect(cacheManager.get).toHaveBeenCalledWith('user_info:user:1');
      expect(prismaService.user.findUnique).not.toHaveBeenCalled();
    });

    it('should fetch from database when cache miss', async () => {
      const dbUser = {
        id: 1,
        timezone: 'America/New_York',
        token: 'token123',
      };

      cacheManager.get.mockResolvedValue(null);
      prismaService.user.findUnique.mockResolvedValue(dbUser);

      const result = await service.getUserInfo(1, 'user');

      expect(result).toEqual({
        id: 1,
        timezone: 'America/New_York',
        pushToken: 'token123',
        type: 'user',
      });
      expect(cacheManager.set).toHaveBeenCalled();
    });
  });
});
