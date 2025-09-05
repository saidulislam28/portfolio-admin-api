import { Injectable, Logger } from '@nestjs/common';
import { GetAppointmentsQueryDto } from '../dto/get-appointments.dto';
import { AppointmentDto } from '../dto/appointment-response.dto';
import { AppointmentStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ConsultantAppointmentsService {
  private readonly logger = new Logger(ConsultantAppointmentsService.name);

  constructor(private readonly prisma: PrismaService) { }

  async getConsultantAppointments(
    consultantId: number,
    query: GetAppointmentsQueryDto,
  ): Promise<Record<string, AppointmentDto[]>> {
    try {

      const consultantAppointment = await this.prisma.appointment.findMany({
        where: {
          consultant_id: consultantId
        }
      })

      // console.log("consultant appointment test", consultantAppointment)


      const { date } = query;

      // Build where clause
      const whereClause: any = {
        consultant_id: consultantId,
        status: {
          in: [AppointmentStatus.CONFIRMED, AppointmentStatus.COMPLETED, AppointmentStatus.PENDING]
        }
      };

      // If date is provided, filter by that specific date
      if (date) {
        const targetDate = new Date(date);
        const nextDate = new Date(targetDate);
        nextDate.setDate(nextDate.getDate() + 1);

        whereClause.slot_date = {
          gte: targetDate,
          lt: nextDate,
        };
      }

      // Fetch appointments from database
      const appointments = await this.prisma.appointment.findMany({
        where: whereClause,
        include: {
          User: {
            select: {
              id: true,
              full_name: true,
            },
          },
          Order: {
            select: {
              id: true,
              service_type: true,
            },
          },
        },
        orderBy: [
          { slot_date: 'asc' },
          { slot_time: 'asc' },
        ],
      });

      // console.log("appointment consultant", appointments)

      // Group appointments by date and transform data
      const groupedAppointments = appointments.reduce((acc, appointment) => {
        const dateKey = appointment.slot_date.toISOString().split('T')[0];

        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }

        const transformedAppointment: AppointmentDto = {
          id: appointment.id,
          time: appointment.slot_time,
          duration: appointment.duration_in_min,
          client: appointment.User?.full_name || 'Unknown Client',
          type: this.getServiceTypeDisplayName(appointment.Order?.service_type),
          status: this.getStatusDisplayName(appointment.status),
          notes: appointment.notes || undefined,
          start_at: appointment.start_at.toISOString(),
          end_at: appointment.end_at.toISOString(),
        };

        acc[dateKey].push(transformedAppointment);
        return acc;
      }, {} as Record<string, AppointmentDto[]>);

      // console.log("group appointment consultant", groupedAppointments)

      return groupedAppointments;
    } catch (error) {
      this.logger.error('Error fetching consultant appointments:', error);
      throw error;
    }
  }


  async getAppointmentDetails(consultantId, appointmentId) {

    try {
      const appointmentDetails = await this.prisma.appointment.findFirst({
        where: {
          consultant_id: consultantId,
          id: appointmentId
        },
        include: {
          Order: true,
          User: true,
          ConversationFeedback: true,
          MockTestFeedback: true,
          Consultant: true
        }
      })

      return appointmentDetails;
    } catch (error) {
      console.log(" error ", error)
    }
  }

  private getServiceTypeDisplayName(serviceType?: string): string {
    const serviceTypeMap: Record<string, string> = {
      book_purchase: 'Book Purchase',
      ielts_gt: 'IELTS GT',
      ielts_academic: 'IELTS Academic',
      spoken: 'Spoken English',
      speaking_mock_test: 'Speaking Mock Test',
      conversation: 'Conversation Practice',
      exam_registration: 'Exam Registration',
      study_abroad: 'Study Abroad Consultation',
    };

    return serviceTypeMap[serviceType || ''] || 'Consultation';
  }

  private getStatusDisplayName(status?: AppointmentStatus): string {
    const statusMap: Record<string, string> = {
      INITIATED: 'initiated',
      PENDING: 'pending',
      CONFIRMED: 'confirmed',
      CANCELLED: 'cancelled',
      COMPLETED: 'completed',
      NO_SHOW: 'no_show',
    };

    return statusMap[status || ''] || 'pending';
  }
}