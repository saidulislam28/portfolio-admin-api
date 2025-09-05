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



@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [
    SeederController,
    SettingsController,
    AppointmentStatusController,
    

  ],
  providers: [
    SeederService,
    SettingsService,
    AppointmentStatusService,
    

  ],
  exports: [],
})
export class AdminModule { }
