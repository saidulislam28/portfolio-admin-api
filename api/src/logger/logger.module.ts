import { Global, Module } from '@nestjs/common';
import { AppointmentLogger } from './logger.service';
import { PrismaService } from '../prisma/prisma.service';

@Global()
@Module({
  providers: [AppointmentLogger, PrismaService],
  exports: [AppointmentLogger],
})
export class LoggerModule {}
