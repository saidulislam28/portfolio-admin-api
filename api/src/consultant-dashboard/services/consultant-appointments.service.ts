import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  AppointmentStatus,
  OrderPaymentStatus,
  PAYMENT_STATUS,
} from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ConsultantAppointmentsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAppointmentList(consultant_id: number) {
    console.log('came hrre', consultant_id);
    // const findConsultant = await this.prismaService.consultant.findFirst({
    //   where: { id: consultant_id, is_active: true, is_verified: true },
    // });

    // if (!findConsultant) {
    //   throw new HttpException(
    //     { message: 'consultant not found' },
    //     HttpStatus.NOT_FOUND,
    //   );
    // }

    // const now = new Date();
    // const whereClause: any = {
    //   consultant_id,
    //   start_at: {},
    // };

    // if (type === 'past') {
    //   whereClause.start_at.lte = now;
    // } else {
    //   whereClause.start_at.gte = now;
    // }

    // const totalUpComing = await this.prismaService.appointment.count({
    //   where: { consultant_id, start_at: { gte: now } },
    // });
    // const totalPast = await this.prismaService.appointment.count({
    //   where: { consultant_id, start_at: { lte: now } },
    // });

    // const appointment = await this.prismaService.appointment.findMany({
    //   where: whereClause,
    //   orderBy: { created_at: 'desc' },
    //   include: {
    //     User: {
    //       select: { id: true, full_name: true, profile_image: true, phone: true, email: true, is_test_user: true },
    //     },
    //     Order: {
    //       select: { service_type: true },
    //     },
    //     MockTestFeedback: {
    //       select: {
    //         appointment_id: true
    //       }
    //     },
    //     ConversationFeedback: {
    //       select: {
    //         appointment_id: true
    //       }
    //     }
    //   },
    // });

    const findAppointments = await this.prismaService.appointment.findMany({
      where: {
        consultant_id,
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
          select: {
            id: true,
            full_name: true,
            profile_image: true,
            is_test_user: true,
          },
        },
        Order: {
          select: { service_type: true },
        },
        Consultant: {
          select: {
            id: true,
            full_name: true,
            email: true,
            phone: true,
            profile_image: true,
            is_test_user: true,
          },
        },
      },
      orderBy: {
        start_at: 'asc',
      },
    });

    return findAppointments;
  }

  async getLiveAppointmentList(consultant_id: number) {
    const findConsultant = await this.prismaService.consultant.findFirst({
      where: { id: consultant_id, is_active: true, is_verified: true },
    });
    if (!findConsultant) {
      throw new HttpException(
        { message: 'consultant not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    const now = new Date();
    const twelveHoursLater = new Date(now.getTime() + 12 * 60 * 60 * 1000);

    const whereClause: any = {
      consultant_id,
      start_at: {
        gte: now,
        lte: twelveHoursLater,
      },
    };

    return await this.prismaService.appointment.findMany({
      where: whereClause,
      orderBy: { created_at: 'desc' },
      include: {
        User: {
          select: {
            id: true,
            full_name: true,
            profile_image: true,
            is_test_user: true,
          },
        },
        Order: {
          select: { service_type: true },
        },
      },
    });
  }

  async getAppointmentListDetails(consultant_id: number, id: number) {
    const findConsultant = await this.prismaService.consultant.findFirst({
      where: { id: consultant_id, is_active: true, is_verified: true },
    });
    if (!findConsultant) {
      throw new HttpException(
        { message: 'consultant not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    const appointment = await this.prismaService.appointment.findFirst({
      where: {
        consultant_id: findConsultant?.id,
        id: id,
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
        User: {
          select: {
            id: true,
            full_name: true,
            email: true,
            phone: true,
            timezone: true,
            expected_level: true,
            profile_image: true,
            is_test_user: true,
          },
        },
        consultant_id: true,
      },
    });

    if (!appointment) {
      throw new HttpException(
        { message: 'Appointment Not Found' },
        HttpStatus.NOT_FOUND,
      );
    }

    return appointment;
  }

  async updateAppointment(consultant_id: number, id: number, payload) {
    const findConsultant = await this.prismaService.consultant.findFirst({
      where: { id: consultant_id, is_active: true, is_verified: true },
    });
    if (!findConsultant) {
      throw new HttpException(
        { message: 'consultant not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    const appointment = await this.prismaService.appointment.findFirst({
      where: {
        consultant_id: findConsultant?.id,
        id: id,
        // Order: {
        //   payment_status: OrderPaymentStatus.paid,
        //   Payment: {
        //     some: {
        //       status: PAYMENT_STATUS.PAID
        //     }
        //   }
        // }
      },
    });

    if (!appointment) {
      throw new HttpException(
        { message: 'Appointment Not Found' },
        HttpStatus.NOT_FOUND,
      );
    }

    const updateData = await this.prismaService.appointment.update({
      where: { id: Number(appointment.id) },
      data: payload,
    });
    if (!updateData) {
      throw new HttpException(
        { message: 'Something Went wrong! try again' },
        HttpStatus.EARLYHINTS,
      );
    }

    return updateData;
  }
  async updateAppointMentNote(consultant_id: number, id: number, payload) {
    const findConsultant = await this.prismaService.consultant.findFirst({
      where: { id: consultant_id, is_active: true, is_verified: true },
    });
    if (!findConsultant) {
      throw new HttpException(
        { message: 'consultant not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    const appointment = await this.prismaService.appointment.findFirst({
      where: {
        // consultant_id: findConsultant?.id,
        id: id,
        // Order: {
        //   payment_status: OrderPaymentStatus.paid,
        //   Payment: {
        //     some: {
        //       status: PAYMENT_STATUS.PAID
        //     }
        //   }
        // }
      },
    });

    if (!appointment) {
      throw new HttpException(
        { message: 'Appointment Not Found' },
        HttpStatus.NOT_FOUND,
      );
    }
    console.log('Updating appointment ID:', appointment?.id);

    const updateData = await this.prismaService.appointment.update({
      where: { id: Number(appointment.id) },
      data: payload,
    });
    if (!updateData) {
      throw new HttpException(
        { message: 'Something Went wrong! try again' },
        HttpStatus.EARLYHINTS,
      );
    }

    console.log('updated ', updateData);

    return updateData;
  }
}
