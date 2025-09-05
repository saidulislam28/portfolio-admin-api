/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable import/no-unresolved */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'; // Adjust path as needed

@Injectable()
export class FeedbackCommentService {
    constructor(private readonly prisma: PrismaService) { }

    async getAllFeedbacks() {
        return this.prisma.feedbackComments.findMany({
            where: { is_active: true },
            orderBy: { sort_order: 'asc' },
        });
    }
    async getAllMocktestComments() {
        return this.prisma.mockTestComments.findMany({
            where: { is_active: true },
            orderBy: { sort_order: 'asc' },
        });
    }

}
