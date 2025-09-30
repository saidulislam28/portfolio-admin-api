import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OrderPaymentStatus, PAYMENT_STATUS } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ConsultantService {
  constructor(private readonly prismaService: PrismaService) { }

  async getUsers(query) {
    const where: any = { created_at: {} };

    if (query.searchText) {
      where.OR = [
        {
          full_name: {
            contains: query.searchText,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: query.searchText,
            mode: 'insensitive',
          },
        },
        {
          phone: {
            contains: query.searchText,
            mode: 'insensitive',
          },
        },
      ];
    }

    if (query.isActive) {
      where.is_active = query.isActive === 'true';
    }

    if (query.isVerified) {
      where.is_verified = query.isVerified === 'true';
    }

    if (query.startDate) {
      where.created_at.gte = new Date(query.startDate);
    }
    if (query.endDate) {
      where.created_at.lte = new Date(query.endDate);
    }

    return this.prismaService.consultant.findMany({
      where,
      // skip: query.skip,
      // take: query.limit,
    });
  }

  async getUserById(id) {
    return this.prismaService.consultant.findFirst({
      where: { id },
      include: {
        Appointment: true,
      },
    });
  }

  async createUser(userData) {
    return this.prismaService.user.create({ data: userData });
  }

  async updateUser(id, userData) {
    return this.prismaService.user.update({ where: { id }, data: userData });
  }

  async deleteUser(id) {
    const blog = await this.prismaService.book.findMany({
      where: {
        price: { lte: 20, gte: 20 },
      },
    });

    return this.prismaService.user.delete({ where: { id } });
  }

  async getAppointmentList(consultant_id: number, type: string) {
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
    const whereClause: any = {
      consultant_id,
      start_at: {},
    };

    if (type === 'past') {
      whereClause.start_at.lte = now;
    } else {
      whereClause.start_at.gte = now;
    }

    const totalUpComing = await this.prismaService.appointment.count({
      where: { consultant_id, start_at: { gte: now } },
    });
    const totalPast = await this.prismaService.appointment.count({
      where: { consultant_id, start_at: { lte: now } },
    });

    const appointment = await this.prismaService.appointment.findMany({
      where: whereClause,
      orderBy: { created_at: 'desc' },
      include: {
        User: {
          select: { id: true, full_name: true, profile_image: true, phone: true, email: true, is_test_user: true },
        },
        Order: {
          select: { service_type: true },
        },
        MockTestFeedback: {
          select: {
            appointment_id: true
          }
        },
        ConversationFeedback: {
          select: {
            appointment_id: true
          }
        }
      },
    });

    return {
      appointment,
      totalUpComing,
      totalPast,
    };
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
          select: { id: true, full_name: true, profile_image: true, is_test_user: true },
        },
        Order: {
          select: { service_type: true },
        },
      },
    });
  }

  async getAppointmentListDetails(consultant_id: number, id: number) {
    const findConsultant = await this.prismaService.consultant.findFirst({
      where: { id: consultant_id, is_active: true, is_verified: true, },
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
        Order: {
          payment_status: OrderPaymentStatus.paid,
          Payment: {
            some: {
              status: PAYMENT_STATUS.PAID
            }
          }
        }
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
            service_type: true
          }
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
            is_test_user: true
          }
        }
      }
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
      where: { id: consultant_id, is_active: true, is_verified: true, },
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


    const updateData = await this.prismaService.appointment.update({ where: { id: Number(appointment.id) }, data: payload })
    if (!updateData) {
      throw new HttpException(
        { message: 'Something Went wrong! try again' },
        HttpStatus.EARLYHINTS,
      );
    };

    return updateData;
  }
  async updateAppointMentNote(consultant_id: number, id: number, payload) {
    const findConsultant = await this.prismaService.consultant.findFirst({
      where: { id: consultant_id, is_active: true, is_verified: true, },
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


    const updateData = await this.prismaService.appointment.update({ where: { id: Number(appointment.id) }, data: payload })
    if (!updateData) {
      throw new HttpException(
        { message: 'Something Went wrong! try again' },
        HttpStatus.EARLYHINTS,
      );
    };

    console.log("updated ", updateData)

    return updateData;
  }
}
