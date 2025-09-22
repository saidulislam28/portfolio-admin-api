import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserUpdatedEvent } from 'src/common/events/user-updated.event';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDeviceTokenDto } from './dto/device-token.dto';

@Injectable()
export class DeviceTokenService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) { }

  async registerToken(payload: RegisterDeviceTokenDto) {
    if (payload.consultant_id) {
      const existingUser = await this.prisma.consultant.findUnique({
        where: { id: payload.consultant_id },
      });

      if (!existingUser) {
        throw new NotFoundException('Consultant not found');
      }

      await this.prisma.consultant.update({
        where: { id: payload.consultant_id },
        data: { token: payload.token, timezone: payload.timezone },
      });
      this.eventEmitter.emit(
        'user.updated',
        new UserUpdatedEvent(payload.consultant_id, 'consultant', ['token', 'timezone']),
      );
    }

    if (payload.user_id) {
      const existingUser = await this.prisma.user.findUnique({
        where: { id: payload.user_id },
      });

      if (!existingUser) {
        throw new NotFoundException('User not found');
      }

      await this.prisma.user.update({
        where: { id: payload.user_id },
        data: { token: payload.token, timezone: payload.timezone },
      });
      this.eventEmitter.emit(
        'user.updated',
        new UserUpdatedEvent(payload.user_id, 'user', ['token', 'timezone']),
      );
    }

    return {};
  }

}
