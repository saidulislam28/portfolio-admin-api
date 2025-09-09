/* eslint-disable */

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AppointmentStatus, OrderPaymentStatus, PAYMENT_STATUS } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) { }

  async findAppointments(user_id: number) {

    const findAppointments = await this.prismaService.appointment.findMany({
      where: {
        user_id,
        status: { not: AppointmentStatus.INITIATED },
        Order: {
          // payment_status: OrderPaymentStatus.paid,
          // Payment: {
          //   some: {
          //     status: PAYMENT_STATUS.PAID,
          //   },
          // },
        },
      },
      include: {
        User: {
          select: { id: true, full_name: true, profile_image: true, is_test_user: true },
        },
        Order: {
          select: { service_type: true },
        },
        Consultant: {
          select: { id: true, full_name: true, email: true, phone: true, profile_image: true, is_test_user: true },
        }
      },
      orderBy: {
        start_at: 'asc',
      },
    });
    return findAppointments;
  }

  async getAppointmentListDetails(user_id: number, id: number) {
    const user = await this.prismaService.user.findFirst({
      where: { id: user_id },
    });
    if (!user) {
      throw new HttpException(
        { message: 'user not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    const appointment = await this.prismaService.appointment.findFirst({
      where: {
        user_id: user?.id,
        id: id,
        Order: {
          // payment_status: OrderPaymentStatus.paid,
          // Payment: {
          //   some: {
          //     status: PAYMENT_STATUS.PAID,
          //   },
          // },
        },
      },
      select: {
        id: true,
        start_at: true,
        end_at: true,
        status: true,
        duration_in_min: true,
        notes: true,
        token: true,
        created_at: true,
        Order: {
          select: {
            service_type: true,
          },
        },
        Consultant: {
          select: {
            id: true,
            full_name: true,
            email: true,
            phone: true,
            timezone: true,
            experience: true,
            profile_image: true,
            is_test_user: true,
            bio: true,
            is_verified: true,
          },
        },
        MockTestFeedback: true,
        ConversationFeedback: true,
      },
      // include: {

      // }
    });

    if (!appointment) {
      throw new HttpException(
        { message: 'Appointment Not Found' },
        HttpStatus.NOT_FOUND,
      );
    }

    return appointment;
  }
}
