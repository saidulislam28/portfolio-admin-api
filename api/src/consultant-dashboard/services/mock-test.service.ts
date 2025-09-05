/* eslint-disable */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'; // Adjust path as needed
import { MockFeedbackPdfGenerate } from '../utils/mock-pdf';
import EmailService from 'src/email/email.service';

@Injectable()
export class MockTestFeedbackService {
  constructor(private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) { }

  async getAllFeedbacks() {
    return this.prisma.mockTestFeedback.findMany({
      orderBy: { createdAt: 'asc' },
    });
  }

  async createFeedback(data, id: number) {


    console.log("data>>>", data)


    if (!data.appointment_id) {
      throw new BadRequestException('Appointment ID is required');
    }
    try {

      const feedbackData = {
        ...data,
        appointment_id: Number(data.appointment_id),
        consultant_id: id ? Number(id) : null
      };


      // return console.log("joy bangla data", data)
      const feedback = await this.prisma.mockTestFeedback.create({
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
      // return

      console.log("feedback mocktest user email>>", feedback?.Appointment?.User?.email)

      if (!feedback) throw new NotFoundException('Order not found');
      if (!feedback.Appointment.User.email) throw new NotFoundException('User email not found');
      const pdfBuffer = await MockFeedbackPdfGenerate(feedback);
      const sendEmail = await this.emailService.sendFeedbackEmail(
        feedback.Appointment.User.email,
        feedback,
        pdfBuffer
      );


      return sendEmail;


    } catch (error) {
      console.log(error)
    }
  }
}
