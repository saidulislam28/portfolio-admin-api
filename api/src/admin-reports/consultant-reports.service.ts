import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { ConsultantReportQueryDto, ConsultantReportResponseDto } from './dto/consultant-report.dto';

interface DailyStatusCounts {
  initiated: number;
  pending: number;
  confirmed: number;
  cancelled: number;
  completed: number;
  no_show: number;
}

@Injectable()
export class ConsultantReportsService {
  constructor(private prisma: PrismaService) {}

  async getConsultantAppointmentReport(
    query: ConsultantReportQueryDto
  ): Promise<ConsultantReportResponseDto> {
    const { startDate, endDate, consultantId } = query;
    
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    // Base where clause
    const whereClause = {
      is_active: true,
      ...(consultantId && { id: consultantId })
    };

    // Get consultants with their appointments in the date range
    const consultantsWithAppointments = await this.prisma.consultant.findMany({
      where: whereClause,
      select: {
        id: true,
        full_name: true,
        email: true,
        Appointment: {
          where: {
            slot_date: {
              gte: startDateObj,
              lte: endDateObj
            }
          },
          select: {
            slot_date: true,
            status: true
          }
        }
      },
      orderBy: {
        full_name: 'asc'
      }
    });

    // Generate date range for complete daily reports
    const dateRange = this.generateDateRange(startDateObj, endDateObj);

    const consultantReports = consultantsWithAppointments.map(consultant => {
      // Group appointments by date and status
      const appointmentsByDate = consultant.Appointment.reduce((acc, appointment) => {
        const dateKey = appointment.slot_date.toISOString().split('T')[0];
        if (!acc[dateKey]) {
          acc[dateKey] = {
            initiated: 0,
            pending: 0,
            confirmed: 0,
            cancelled: 0,
            completed: 0,
            no_show: 0
          };
        }
        
        const status = appointment.status?.toLowerCase() || 'initiated';
        if (status in acc[dateKey]) {
          acc[dateKey][status as keyof DailyStatusCounts]++;
        }
        
        return acc;
      }, {} as Record<string, DailyStatusCounts>);

      // Calculate overall status counts
      const overallStatusCounts: DailyStatusCounts = {
        initiated: 0,
        pending: 0,
        confirmed: 0,
        cancelled: 0,
        completed: 0,
        no_show: 0
      };

      consultant.Appointment.forEach(appointment => {
        const status = appointment.status?.toLowerCase() || 'initiated';
        if (status in overallStatusCounts) {
          overallStatusCounts[status as keyof DailyStatusCounts]++;
        }
      });

      // Generate daily reports for all dates in range
      const dailyReports = dateRange.map(date => {
        const dateKey = date.toISOString().split('T')[0];
        const dayData = appointmentsByDate[dateKey] || {
          initiated: 0,
          pending: 0,
          confirmed: 0,
          cancelled: 0,
          completed: 0,
          no_show: 0
        };

        const totalAppointments = Object.values(dayData).reduce((sum, count) => sum + count, 0);

        return {
          date,
          totalAppointments,
          statusCounts: dayData
        };
      });

      return {
        consultantId: consultant.id,
        consultantName: consultant.full_name || 'Unknown',
        consultantEmail: consultant.email || '',
        totalAppointments: consultant.Appointment.length,
        overallStatusCounts,
        dailyReports
      };
    });

    return {
      startDate: startDateObj,
      endDate: endDateObj,
      totalConsultants: consultantReports.length,
      consultants: consultantReports
    };
  }

  private generateDateRange(startDate: Date, endDate: Date): Date[] {
    const dates: Date[] = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  }
}