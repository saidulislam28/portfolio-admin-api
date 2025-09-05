import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';

import { FeedbackCommentController } from './controllers/feedback-comments.controller';
import { FeedbackCommentService } from './services/feedback-comments.service';
import { ConsultantAppointmentsController } from './controllers/consultant-appointments.controller';
import { ConsultantAppointmentsService } from './services/consultant-appointments.service';

@Module({
    imports: [PrismaModule],
    controllers: [ FeedbackCommentController, ConsultantAppointmentsController],
    providers: [PrismaService, FeedbackCommentService, ConsultantAppointmentsService]
})
export class ConSultantModule { }
