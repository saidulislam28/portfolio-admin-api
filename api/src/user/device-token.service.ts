import {
  Inject,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserCacheService } from 'src/user-cache/interfaces/user-cache.interface';
import { RegisterDeviceTokenDto } from './dto/device-token.dto';

@Injectable()
export class DeviceTokenService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
    @Inject('UserCacheService') private userCacheService: UserCacheService,
  ) { }

  async registerToken(payload: RegisterDeviceTokenDto) {
    if (payload.consultant_id) {
      const existingUser = await this.prisma.consultant.findUnique({
        where: { id: payload.consultant_id },
      });

      if (!existingUser) {
        throw new NotFoundException('Consultant not found');
      }

      await this.userCacheService.updateUserInfo(payload.consultant_id, 'consultant', payload.token, payload.timezone);
    }

    if (payload.user_id) {
      const existingUser = await this.prisma.user.findUnique({
        where: { id: payload.user_id },
      });

      if (!existingUser) {
        throw new NotFoundException('User not found');
      }

      await this.userCacheService.updateUserInfo(payload.user_id, 'user', payload.token, payload.timezone);
    }

    return {};
  }

}
