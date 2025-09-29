/* eslint-disable */
import { Module } from '@nestjs/common';
import { EmailModule } from 'src/email/email.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthModule } from 'src/user/auth.module';

import { AppointmentsCalendarController } from './controllers/appointment-calendar.controller';
import { ConsultantAuthController } from './controllers/consaltantAuth.controller';
import { ConsultantController } from './controllers/consultant.controller';
import { ConsultantAppointmentsController } from './controllers/consultant-appointments.controller';
import { ConversationfeedbackController } from './controllers/conversation-feedback.controller';
import { MockTestFeedbackController } from './controllers/mock-test-feedback.controller';
import { AppointmentCalendarService } from './services/appointment-calendar.service';
import { ConsultantAuthService } from './services/consaltantAuth.service';
import { ConsultantService } from './services/consultant.service';
import { ConsultantAppointmentsService } from './services/consultant-appointments.service';
import { ConversationFeedbackService } from './services/conversation-feedback.service';
import { MockTestFeedbackService } from './services/mock-test-feedback.service';
import { NotificationsController } from './controllers/consultant-notification.controller';
import { NotificationsService } from './services/consultant-notification.service';

@Module({
  imports: [
    EmailModule,
    PrismaModule,
    AuthModule
  ],
  controllers: [
    ConversationfeedbackController,
    MockTestFeedbackController,
    ConsultantController,
    ConsultantAuthController,
    ConsultantAppointmentsController,
    AppointmentsCalendarController,
    NotificationsController
  ],
  providers: [
    ConversationFeedbackService,
    PrismaService,
    MockTestFeedbackService,
    ConsultantService,
    ConsultantAuthService,
    ConsultantAppointmentsService,
    AppointmentCalendarService,
    NotificationsService
  ],
  exports: [ConsultantAuthService]

})
export class ConsultantAppModule { }
