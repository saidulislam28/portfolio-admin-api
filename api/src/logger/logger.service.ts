import { Injectable, LoggerService, LogLevel } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AppointmentLogger implements LoggerService {
  constructor(private readonly prisma: PrismaService) {}
    warn(message: any, ...optionalParams: any[]) {
        throw new Error('Method not implemented.');
    }
    verbose?(message: any, ...optionalParams: any[]) {
        throw new Error('Method not implemented.');
    }
    fatal?(message: any, ...optionalParams: any[]) {
        throw new Error('Method not implemented.');
    }
    setLogLevels?(levels: LogLevel[]) {
        throw new Error('Method not implemented.');
    }

  async log(message: string, appointmentId: number, meta?: Record<string, any>) {
    await this.write('info', message, appointmentId, meta);
  }

  async error(message: string, appointmentId: number, meta?: Record<string, any>) {
    await this.write('error', message, appointmentId, meta);
  }

  async debug(message: string, appointmentId: number, meta?: Record<string, any>) {
    await this.write('debug', message, appointmentId, meta);
  }

  private async write(
    level: 'info' | 'error' | 'debug',
    message: string,
    appointmentId: number,
    meta?: Record<string, any>,
  ) {
    // 1. Write to DB for audit trail
    await this.prisma.appointmentLog.create({
      data: {
        appointment_id: appointmentId,
        level,
        message,
        meta,
      },
    });

    // 2. Log structured JSON to console
    // TODO write winston
    // console.log(
    //   JSON.stringify({
    //     level,
    //     appointmentId,
    //     message,
    //     meta,
    //     timestamp: new Date().toISOString(),
    //   }),
    // );
  }
}
