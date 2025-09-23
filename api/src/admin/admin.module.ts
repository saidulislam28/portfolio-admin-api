/* eslint-disable */
import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { SeederController } from './controllers/seeder.controller';
import { SeederService } from './services/seeder.service';
import { SettingsController } from './controllers/settings.controller';
import { SettingsService } from './services/settings.service';
import { AppointmentStatusController } from './controllers/appointment-status.controller';
import { AppointmentStatusService } from './services/appointment-status.service';
import { WebSettingsService } from './services/web-settings.service';
import { WebSettingsController } from './controllers/web-settings.controller';



@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [
    SeederController,
    SettingsController,
    AppointmentStatusController,
    WebSettingsController
  ],
  providers: [
    SeederService,
    SettingsService,
    AppointmentStatusService,
    WebSettingsService
  ],
  exports: [],
})
export class AdminModule { }
