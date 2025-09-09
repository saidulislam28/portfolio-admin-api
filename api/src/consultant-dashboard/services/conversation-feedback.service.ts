import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import EmailService from 'src/email/email.service';
import { PrismaService } from 'src/prisma/prisma.service';

import { generateFeedbackPDF } from '../utils/pdf';
import { AppointmentStatus } from '@prisma/client';

@Injectable()
export class ConversationFeedbackService {
  constructor(private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) { }

  async createFeedback(data, id: number) {
    if (!data.appointment_id) {
      throw new BadRequestException('Appointment ID is required');
    }

    const { mark_assignment_complete, ...payload } = data;


    const feedbackData = {
      ...payload,
      appointment_id: Number(payload.appointment_id),
      consultant_id: id ? Number(id) : null,
    };

    console.log("feedback data conversation", feedbackData)

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

    if (mark_assignment_complete) {
      await this.prisma.appointment.update({
        where: { id: feedback.Appointment.id },
        data: { status: AppointmentStatus.COMPLETED }
      })
    }

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