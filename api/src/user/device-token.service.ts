import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RECIPIENT_TYPE } from 'src/common/constants';
import { UserUpdatedEvent } from 'src/common/events/user-updated.event';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DeviceTokenService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async registerToken(user_id: number, token: string, recipient_type: string) {
    if (recipient_type === 'Consultant') {
      const existingUser = await this.prisma.consultant.findUnique({
        where: { id: user_id },
      });

      if (!existingUser) {
        throw new NotFoundException('Consultant not found');
      }

      await this.prisma.consultant.update({
        where: { id: user_id },
        data: { token },
      });
      this.eventEmitter.emit(
        'user.updated',
        new UserUpdatedEvent(user_id, 'consultant', ['token']),
      );
    }

    if (recipient_type === 'User') {
      const existingUser = await this.prisma.user.findUnique({
        where: { id: user_id },
      });

      if (!existingUser) {
        throw new NotFoundException('User not found');
      }

      await this.prisma.user.update({
        where: { id: user_id },
        data: { token },
      });
      this.eventEmitter.emit(
        'user.updated',
        new UserUpdatedEvent(user_id, 'user', ['token']),
      );
    }

    throw new BadRequestException('Invalid recipient type');
  }

}
