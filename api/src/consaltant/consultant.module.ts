import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';

import { FeedbackCommentController } from './controllers/feedback-comments.controller';
import { FeedbackCommentService } from './services/feedback-comments.service';

@Module({
    imports: [PrismaModule],
    controllers: [ FeedbackCommentController],
    providers: [PrismaService, FeedbackCommentService]
})
export class ConSultantModule { }
