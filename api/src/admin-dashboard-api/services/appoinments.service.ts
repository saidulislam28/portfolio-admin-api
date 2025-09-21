/* eslint-disable */
import { InjectQueue } from '@nestjs/bull';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AppointmentStatus } from '@prisma/client';
import { Queue } from 'bull';
import { QUEUE_JOBS, QUEUE_NAME } from 'src/common/constants';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AppointmentsService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue(QUEUE_NAME)
    private notificationQueue: Queue,
  ) { }

  async getAppointments() {
    const appointments = await this.prisma.appointment.findMany({
      include: {
        User: {
          select: {
            full_name: true,
            email: true,
            id: true,
            phone: true,
            profile_image: true,
            is_test_user: true,
          },
        },
        Consultant: {
          select: {
            full_name: true,
            email: true,
            id: true,
            skills: true,
            profile_image: true,
            is_test_user: true
          },
        },
        Order: true,
      },
    });
    return appointments;
  }

  async getAppointmentById(id: number) {
    const response = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        User: {
          select: {
            full_name: true,
            email: true,
            id: true,
            phone: true,
            timezone: true,
            is_test_user: true
          },
        },
        Consultant: {
          select: {
            full_name: true,
            email: true,
            id: true,
            skills: true,
            phone: true,
            hourly_rate: true,
            is_test_user: true
          },
        },
        Order: true,
        MockTestFeedback: true,
        ConversationFeedback: true,
        Rating: {
          select: {
            comment: true,
            id: true,
            rating: true
          }
        }
      },
    });
    return response;
  }

  async assignConsultant(id: number, consultant_id: number) {
    const appointment = await this.prisma.appointment.findUnique({
      where: {
        id,
      },
    });

    if (!appointment) {
      throw new HttpException('Appointment Not Found', HttpStatus.NOT_FOUND);
    }

    const updatedAppointment = await this.prisma.appointment.update({
      where: { id },
      data: {
        consultant_id: consultant_id,
        status: AppointmentStatus.CONFIRMED
      },
      include: {
        Consultant: {
          select: {
            full_name: true,
          },
        },
      },
    });

    if (!updatedAppointment) {
      throw new HttpException(
        'Assigned Consualtant Failed',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.notificationQueue.add(
      QUEUE_JOBS.NOTIFICATION.ASSIGN_APPOINTMENT,
      updatedAppointment,
    );
    return updatedAppointment;
  }
}
