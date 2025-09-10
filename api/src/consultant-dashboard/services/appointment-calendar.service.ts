import { Injectable, Logger } from '@nestjs/common';
import { AppointmentStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

import { AppointmentDto, GetAppointmentsQueryDto } from '../dto/calendar-response.dto';

@Injectable()
export class AppointmentCalendarService {
  private readonly logger = new Logger(AppointmentCalendarService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getConsultantAppointments(
    consultantId: number,
    query: GetAppointmentsQueryDto,
  ): Promise<Record<string, AppointmentDto[]>> {
    try {
      const { date } = query;

      // Build where clause
      const whereClause: any = {
        consultant_id: consultantId,
        status: {
          in: [AppointmentStatus.CONFIRMED],
        },
      };

      // If date is provided, filter by that specific date using start_at
      if (date) {
        const targetDate = new Date(date);
        const nextDate = new Date(targetDate);
        nextDate.setDate(nextDate.getDate() + 1);

        whereClause.start_at = {
          gte: targetDate,
          lt: nextDate,
        };
      }

      // Fetch appointments from database — ordered by actual start time
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
        orderBy: {
          start_at: 'asc', // Only order by start_at — it includes full time precision
        },
      });

      // Group appointments by the DATE PART of start_at (e.g., "2025-04-05")
      const groupedAppointments = appointments.reduce(
        (acc, appointment) => {
          // Extract YYYY-MM-DD from start_at (UTC)
          const dateKey = appointment.start_at.toISOString().split('T')[0];

          if (!acc[dateKey]) {
            acc[dateKey] = [];
          }

          const transformedAppointment: AppointmentDto = {
            id: appointment.id,
            time: appointment.slot_time, // Still useful for display
            duration: appointment.duration_in_min,
            client: appointment.User?.full_name || 'Unknown Client',
            type: this.getServiceTypeDisplayName(
              appointment.Order?.service_type,
            ),
            status: this.getStatusDisplayName(appointment.status),
            notes: appointment.notes || undefined,
            start_at: appointment.start_at.toISOString(),
            end_at: appointment.end_at.toISOString(),
          };

          acc[dateKey].push(transformedAppointment);
          return acc;
        },
        {} as Record<string, AppointmentDto[]>,
      );

      return groupedAppointments;
    } catch (error) {
      this.logger.error('Error fetching consultant appointments:', error);
      throw error;
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