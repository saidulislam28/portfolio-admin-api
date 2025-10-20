/* eslint-disable */
import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { SeederController } from './controllers/seeder.controller';
import { SeederService } from './services/seeder.service';
import { SettingsController } from './controllers/settings.controller';
import { SettingsService } from './services/settings.service';
import { WebSettingsService } from './services/web-settings.service';
import { WebSettingsController } from './controllers/web-settings.controller';



@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [
    SeederController,
    SettingsController,
    WebSettingsController
  ],
  providers: [
    SeederService,
    SettingsService,
    WebSettingsService
  ],
  exports: [],
})
export class AdminModule { }
