/* eslint-disable import/no-unresolved */
import { Module } from '@nestjs/common';
import { EmailModule } from 'src/email/email.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';

import { ConsultantAuthController } from './controllers/consaltantAuth.controller';
import { ConsultantController } from './controllers/consultant.controller';
import { ConversationfeedbackController } from './controllers/conversation-feedback.controller';
import { MockTestFeedbackController } from './controllers/mock-test.controller';
import { ConsultantAuthService } from './services/consaltantAuth.service';
import { ConsultantService } from './services/consultant.service';
import { ConversationFeedbackService } from './services/conversation-feedback.service';
import { MockTestFeedbackService } from './services/mock-test.service';
import { AuthModule } from 'src/user/auth.module';
import { ConsultantAppointmentsController } from './controllers/consultant-appointments.controller';
import { ConsultantAppointmentsService } from './services/consultant-appointments.service';

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
    ConsultantAppointmentsController
  ],
  providers: [
    ConversationFeedbackService,
    PrismaService,
    MockTestFeedbackService,
    ConsultantService,
    ConsultantAuthService,
    ConsultantAppointmentsService
  ],
  exports: [ConsultantAuthService]

})
export class ConsultantAppModule { }
