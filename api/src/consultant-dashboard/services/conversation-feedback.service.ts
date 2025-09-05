import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import EmailService from 'src/email/email.service';
import { PrismaService } from 'src/prisma/prisma.service';

import { generateFeedbackPDF } from '../utils/pdf';

@Injectable()
export class ConversationFeedbackService {
  constructor(private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) { }

  async createFeedback(data, id: number) {
    if (!data.appointment_id) {
      throw new BadRequestException('Appointment ID is required');
    }

    const feedbackData = {
      ...data,
      appointment_id: Number(data.appointment_id),
      consultant_id: id ? Number(id) : null,
    };

    const feedback = await this.prisma.conversationFeedback.create({
      data: feedbackData,
      include: {
        Appointment: {
          include: {
            User: {
              select: {
                email: true,
                full_name: true,
                id: true
              }
            }
          }
        },
        Consultant: {
          select: {
            full_name: true,
            email: true,
          }
        }
      }
    });

    console.log("feedback conversation user email", feedback.Appointment.User.email)

    if (!feedback) throw new NotFoundException('Order not found');
    if (!feedback.Appointment.User.email) throw new NotFoundException('User email not found');

    // const pdfBuffer = await generateFeedbackPDF(feedback);

    // const sendEmail = await this.emailService.sendFeedbackEmail(
    //   feedback.Appointment.User.email,
    //   feedback,
    //   pdfBuffer

    // );
    return feedback;

  }
}