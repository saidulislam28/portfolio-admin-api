/* eslint-disable */
import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DateTime } from 'luxon';
import { DaySlots, TimeSlot } from '../dtos/types';
import { CreateAppointmentDto } from '../dtos/appointment.dto';
import { AppointmentStatus, NotificationChannel, NotificationType } from '@prisma/client';
import { ScheduleNotificationService } from 'src/schedule-notification/schedule-notification.service';
import { TimeZoneHelper } from 'src/common/timezone.helper';


@Injectable()
export class AppointmentsService {
  private readonly logger = new Logger(AppointmentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: ScheduleNotificationService,
  ) { }

  async getAvailableSlots(userTimezone: string = 'UTC') {
    const today = DateTime.now().setZone(userTimezone).startOf('day');
    const endDate = today.plus({ weeks: 3 });

    // Get total number of active consultants
    const totalConsultants = await this.prisma.consultant.count({
      where: { is_active: true }
    });

    if (totalConsultants === 0) {
      throw new BadRequestException('No active consultants available');
    }

    // Get app settings (or use defaults)
    const settings = await this.getAppSettings();

    const result: DaySlots[] = [];
    let currentDate = today;

    while (currentDate < endDate) {
      // Skip weekends if not in working days
      // if (settings.working_days.includes(currentDate.weekday)) {

      // }
      const daySlots = await this.getDaySlotsWithAvailability(
        currentDate,
        userTimezone,
        totalConsultants,
        settings
      );

      result.push(daySlots);
      currentDate = currentDate.plus({ days: 1 });
    }

    return result;
  }

  /**
   * Get slots for a specific day with availability information
   */
  private async getDaySlotsWithAvailability(
    date: DateTime,
    userTimezone: string,
    totalConsultants: number,
    settings: any
  ) {
    const dateStr = date.toISODate();
    const dayName = date.toFormat('EEEE');

    // Generate time slots for the day
    const timeSlots = this.generateTimeSlots(
      settings.working_hours_start,
      settings.working_hours_end,
      settings.slot_duration_minutes
    );

    // Get existing appointments for this date (in UTC)
    const startOfDayUTC = date.startOf('day');
    const endOfDayUTC = date.endOf('day');


    // console.log({ startOfDayUTC, endOfDayUTC })

    const existingAppointments = await this.prisma.appointment.groupBy({
      by: ['slot_time'],
      where: {
        slot_date: {
          gte: startOfDayUTC.toJSDate(),
          lt: endOfDayUTC.toJSDate()
        },
        status: {
          not: 'CANCELLED'
        }
      },
      _count: {
        id: true
      }
    });

    // Create appointment count map
    const appointmentCounts = new Map<string, number>();
    existingAppointments.forEach(appointment => {
      // console.log(TimeZoneHelper.utcToLocal(appointment.slot_time, userTimezone))
      appointmentCounts.set(TimeZoneHelper.utcToLocal(appointment.slot_time, userTimezone), appointment._count.id);
    });

    // let mapValue = "";

    // for (let [key, value] of appointmentCounts) {
    //   mapValue += (`${key}: ${value}, `);
    // }

    // console.log({ mapValue, date })
    // Filter out past slots for today
    const now = DateTime.now().setZone(userTimezone);
    const isToday = date.hasSame(now, 'day');

    const slots: TimeSlot[] = timeSlots
      .filter(slot => {
        if (!isToday) return true;

        // Parse slot time and compare with current time
        const [hours, minutes] = slot.time.split(':').map(Number);
        const slotDateTime = date.set({ hour: hours, minute: minutes });
        return slotDateTime > now;
      })
      .map(slot => {
        // console.log("slot.time: ", slot.time, appointmentCounts.get("03:00"))
        const bookedCount = appointmentCounts.get(slot.time) || 0;
        // const bookedCount = appointmentCounts.get("03:00") || 0;
        // console.log(" ", { bookedCount })
        const availableSlots = totalConsultants - bookedCount;

        return {
          time: slot.time,
          time_12h: slot.time_12h,
          is_booked: availableSlots === 0,
          available_slots: Math.max(0, availableSlots),
          total_slots: totalConsultants
        };
      });

    return {
      date: dateStr,
      day_name: dayName,
      slots
    };
  }

  /**
   * Generate time slots between start and end time
   */
  private generateTimeSlots(
    startTime: string,
    endTime: string,
    intervalMinutes: number
  ): { time: string; time_12h: string }[] {
    // intervalMinutes += 5; // add for gap between each test
    const slots = [];
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    let current = DateTime.fromObject({ hour: startHour, minute: startMin });
    const end = DateTime.fromObject({ hour: endHour, minute: endMin });

    while (current < end) {
      const time24 = current.toFormat('HH:mm');
      const time12 = current.toFormat('h:mm a');

      slots.push({
        time: time24,
        time_12h: time12
      });

      current = current.plus({ minutes: intervalMinutes });
    }

    return slots;
  }

  /**
   * Create multiple appointments
   */
  async createAppointments(appointments: CreateAppointmentDto[]): Promise<any[]> {
    const results = [];

    // Validate all appointments first
    for (const appointment of appointments) {
      await this.validateAppointment(appointment);
    }

    // Use transaction to ensure atomicity
    return this.prisma.$transaction(async (prisma) => {
      const createdAppointments = [];

      for (const appointmentData of appointments) {
        const startDateTime = DateTime.fromISO(appointmentData.start_at);
        const endDateTime = DateTime.fromISO(appointmentData.end_at);

        // Convert to UTC for storage
        const startUTC = startDateTime.toUTC();
        const endUTC = endDateTime.toUTC();

        // Extract slot information
        const slotDate = startUTC.startOf('day').toJSDate();
        const slotTime = startUTC.toFormat('HH:mm');

        const appointment = await prisma.appointment.create({
          data: {
            start_at: startUTC.toJSDate(),
            end_at: endUTC.toJSDate(),
            slot_date: slotDate,
            slot_time: slotTime,
            duration_in_min: endDateTime.diff(startDateTime, 'minutes').minutes,
            consultant_id: appointmentData.consultant_id,
            user_id: appointmentData.user_id,
            order_id: appointmentData.order_id,
            notes: appointmentData.notes,
            user_timezone: appointmentData.user_timezone,
            token: this.generateToken(),
            status: 'CONFIRMED',
          },
          include: {
            User: true,
            Consultant: true,
            Order: true,
          },
        });

        createdAppointments.push(appointment);

        // Schedule notifications for this appointment
        await this.scheduleAppointmentNotifications(appointment);
      }

      return createdAppointments;
    });
  }

  private async scheduleAppointmentNotifications(appointment: any): Promise<void> {
    try {
      const user = appointment.User;
      const consultant = appointment.Consultant;
      const startTime = DateTime.fromJSDate(appointment.start_at);
      const userTimezone = appointment.user_timezone || 'UTC';

      // Schedule different types of reminders
      await this.scheduleNotification(
        appointment.user_id,
        'APPOINTMENT_REMINDER',
        'EMAIL',
        startTime.minus({ hours: 24 }), // 24 hours before
        {
          type: 'appointment_reminder',
          appointmentId: appointment.id,
          userName: user.name,
          consultantName: consultant.name,
          startTime: startTime.setZone(userTimezone).toFormat("yyyy-MM-dd HH:mm"),
          duration: appointment.duration_in_min,
          timezone: userTimezone,
          subject: 'Your appointment reminder',
          message: `You have an appointment with ${consultant.name} tomorrow at ${startTime.setZone(userTimezone).toFormat("HH:mm")}`,
        },
      );

      await this.scheduleNotification(
        appointment.user_id,
        'APPOINTMENT_REMINDER',
        'PUSH',
        startTime.minus({ hours: 1 }), // 1 hour before
        {
          type: 'appointment_reminder',
          appointmentId: appointment.id,
          title: 'Appointment starting soon',
          body: `Your appointment with ${consultant.name} starts in 1 hour`,
          startTime: startTime.setZone(userTimezone).toFormat("HH:mm"),
        },
      );

      // Schedule consultant notifications if needed
      await this.scheduleNotification(
        appointment.consultant_id,
        'APPOINTMENT_REMINDER',
        'EMAIL',
        startTime.minus({ hours: 1 }), // 1 hour before
        {
          type: 'consultant_reminder',
          appointmentId: appointment.id,
          userName: user.name,
          startTime: startTime.setZone(userTimezone).toFormat("HH:mm"),
          duration: appointment.duration_in_min,
          subject: 'Upcoming appointment',
          message: `You have an appointment with ${user.name} at ${startTime.setZone(userTimezone).toFormat("HH:mm")}`,
        },
      );

      this.logger.log(`Scheduled notifications for appointment ${appointment.id}`);
    } catch (error) {
      this.logger.error(
        `Failed to schedule notifications for appointment ${appointment.id}: ${error.message}`,
      );
      // Don't throw error - appointment creation shouldn't fail because of notification scheduling
    }
  }

  private async scheduleNotification(
    userId: number,
    type: NotificationType,
    channel: NotificationChannel,
    sendAt: DateTime,
    payload: any,
  ): Promise<void> {
    await this.notificationService.createNotification({
      userId,
      sendAt: sendAt.toJSDate(),
      type,
      channel,
      payload,
      maxAttempts: 3, // Will retry 3 times if fails
    });
  }


  /**
   * Validate appointment before creation
   */
  private async validateAppointment(appointment: CreateAppointmentDto): Promise<void> {
    const startDateTime = DateTime.fromISO(appointment.start_at);
    const endDateTime = DateTime.fromISO(appointment.end_at);

    // Check if appointment is in the future
    if (startDateTime <= DateTime.now()) {
      throw new BadRequestException('Appointment must be scheduled for a future time');
    }

    // Check if slot is available
    const startUTC = startDateTime.toUTC();
    const slotDate = startUTC.startOf('day');
    const slotTime = startUTC.toFormat('HH:mm');

    const totalConsultants = await this.prisma.consultant.count({
      where: { is_active: true }
    });

    const existingAppointments = await this.prisma.appointment.count({
      where: {
        slot_date: slotDate.toJSDate(),
        slot_time: slotTime,
        status: {
          not: 'CANCELLED'
        }
      }
    });

    if (existingAppointments >= totalConsultants) {
      throw new BadRequestException(`Time slot ${slotTime} is fully booked`);
    }

    // Validate order exists
    const order = await this.prisma.order.findUnique({
      where: { id: appointment.order_id }
    });

    if (!order) {
      throw new BadRequestException(`Order with ID ${appointment.order_id} not found`);
    }
  }

  /**
   * Get app settings with defaults
   */
  private async getAppSettings() {
    let settings = await this.prisma.appSettings.findFirst();

    if (!settings) {
      // Create default settings
      settings = await this.prisma.appSettings.create({
        data: {
          slot_duration_minutes: 20,
          booking_advance_weeks: 3,
          working_hours_start: '10:00',
          working_hours_end: '22:00',
          working_days: [1, 2, 3, 4, 5, 6] // Monday to Saturday
        }
      });
    }

    return settings;
  }

  /**
   * Get appointments for a specific user with timezone conversion
   */
  async getActiveAppointmentsByUser(
    userId: number
  ) {
    const appointments = await this.prisma.appointment.findMany({
      where: {
        user_id: userId,
        status: {
          in: [AppointmentStatus.CONFIRMED, AppointmentStatus.PENDING]
        }
      },
      orderBy: {
        start_at: 'asc'
      },
    });

    return appointments;
  }

  /**
   * Cancel an appointment
   */
  async cancelAppointment(appointmentId: number, reason?: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId }
    });

    if (!appointment) {
      throw new BadRequestException('Appointment not found');
    }

    if (appointment.status === 'CANCELLED') {
      throw new BadRequestException('Appointment is already cancelled');
    }

    // Check if appointment can be cancelled (not too close to start time)
    const now = DateTime.now();
    const appointmentStart = DateTime.fromJSDate(appointment.start_at);
    const hoursDifference = appointmentStart.diff(now, 'hours').hours;

    if (hoursDifference < 2) {
      throw new BadRequestException('Cannot cancel appointment less than 2 hours before start time');
    }

    return await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: 'CANCELLED',
        notes: reason ? `${appointment.notes || ''}\nCancellation reason: ${reason}` : appointment.notes,
        updated_at: new Date()
      },
      include: {
        User: true,
        Consultant: true
      }
    });
  }

  /**
   * Get consultant's schedule for a specific date
   */
  async getConsultantSchedule(
    consultantId: number,
    date: string,
    consultantTimezone: string = 'UTC'
  ) {
    const targetDate = DateTime.fromISO(date).setZone(consultantTimezone);
    const startOfDay = targetDate.startOf('day').toUTC();
    const endOfDay = targetDate.endOf('day').toUTC();

    const appointments = await this.prisma.appointment.findMany({
      where: {
        consultant_id: consultantId,
        start_at: {
          gte: startOfDay.toJSDate(),
          lt: endOfDay.toJSDate()
        },
        status: {
          not: 'CANCELLED'
        }
      },
      include: {
        User: {
          select: {
            id: true,
            profile_image: true,
            is_test_user: true
            // Add user fields as needed based on your User model
          }
        }
      },
      orderBy: {
        start_at: 'asc'
      }
    });

    return appointments.map(appointment => {
      const startDateTime = DateTime.fromJSDate(appointment.start_at).setZone(consultantTimezone);
      const endDateTime = DateTime.fromJSDate(appointment.end_at).setZone(consultantTimezone);

      return {
        ...appointment,
        display_info: {
          date: startDateTime.toISODate(),
          start_time_24h: startDateTime.toFormat('HH:mm'),
          start_time_12h: startDateTime.toFormat('h:mm a'),
          end_time_24h: endDateTime.toFormat('HH:mm'),
          end_time_12h: endDateTime.toFormat('h:mm a'),
          duration_display: `${appointment.duration_in_min} minutes`
        }
      };
    });
  }

  /**
   * Get appointment statistics
   */
  async getAppointmentStats(timezone: string = 'UTC') {
    const now = DateTime.now().setZone(timezone);
    const startOfWeek = now.startOf('week').toUTC();
    const endOfWeek = now.endOf('week').toUTC();
    const startOfMonth = now.startOf('month').toUTC();
    const endOfMonth = now.endOf('month').toUTC();

    // Get various statistics
    const [
      totalAppointments,
      weeklyAppointments,
      monthlyAppointments,
      todayAppointments,
      cancelledAppointments,
      completedAppointments,
      activeConsultants
    ] = await Promise.all([
      this.prisma.appointment.count(),
      this.prisma.appointment.count({
        where: {
          start_at: {
            gte: startOfWeek.toJSDate(),
            lte: endOfWeek.toJSDate()
          }
        }
      }),
      this.prisma.appointment.count({
        where: {
          start_at: {
            gte: startOfMonth.toJSDate(),
            lte: endOfMonth.toJSDate()
          }
        }
      }),
      this.prisma.appointment.count({
        where: {
          start_at: {
            gte: now.startOf('day').toUTC().toJSDate(),
            lte: now.endOf('day').toUTC().toJSDate()
          }
        }
      }),
      this.prisma.appointment.count({
        where: { status: 'CANCELLED' }
      }),
      this.prisma.appointment.count({
        where: { status: 'COMPLETED' }
      }),
      this.prisma.consultant.count({
        where: { is_active: true }
      })
    ]);

    // Get upcoming appointments grouped by status
    const upcomingAppointments = await this.prisma.appointment.groupBy({
      by: ['status'],
      where: {
        start_at: {
          gte: new Date()
        }
      },
      _count: {
        id: true
      }
    });

    const statusCounts = upcomingAppointments.reduce((acc, item) => {
      acc[item.status] = item._count.id;
      return acc;
    }, {} as Record<string, number>);

    return {
      overview: {
        total_appointments: totalAppointments,
        active_consultants: activeConsultants,
        today_appointments: todayAppointments,
        weekly_appointments: weeklyAppointments,
        monthly_appointments: monthlyAppointments
      },
      status_breakdown: {
        completed: completedAppointments,
        cancelled: cancelledAppointments,
        upcoming: statusCounts
      },
      utilization: {
        cancellation_rate: totalAppointments > 0 ?
          ((cancelledAppointments / totalAppointments) * 100).toFixed(2) + '%' : '0%',
        completion_rate: totalAppointments > 0 ?
          ((completedAppointments / totalAppointments) * 100).toFixed(2) + '%' : '0%'
      }
    };
  }

  /**
   * Generate unique token for appointment
   */
  private generateToken(): string {
    return Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
  }
}