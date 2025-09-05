// timezone.utils.ts
import { DateTime } from 'luxon';

export class TimezoneUtils {
  /**
   * Convert UTC datetime to user's timezone
   */
  static convertToUserTimezone(utcDateTime: Date, userTimezone: string): DateTime {
    return DateTime.fromJSDate(utcDateTime).setZone(userTimezone);
  }

  /**
   * Convert user's datetime to UTC
   */
  static convertToUTC(dateTime: string | Date, userTimezone: string): DateTime {
    if (typeof dateTime === 'string') {
      return DateTime.fromISO(dateTime, { zone: userTimezone }).toUTC();
    }
    return DateTime.fromJSDate(dateTime, { zone: userTimezone }).toUTC();
  }

  /**
   * Get user's current time
   */
  static getUserCurrentTime(userTimezone: string): DateTime {
    return DateTime.now().setZone(userTimezone);
  }

  /**
   * Check if a time slot is in the past for user's timezone
   */
  static isSlotInPast(slotDate: string, slotTime: string, userTimezone: string): boolean {
    const [hours, minutes] = slotTime.split(':').map(Number);
    const slotDateTime = DateTime.fromISO(slotDate)
      .setZone(userTimezone)
      .set({ hour: hours, minute: minutes });

    return slotDateTime <= DateTime.now().setZone(userTimezone);
  }

  /**
   * Format time for display in user's timezone
   */
  static formatTimeForDisplay(utcDateTime: Date, userTimezone: string): {
    date: string;
    time_24h: string;
    time_12h: string;
    day_name: string;
  } {
    const dt = DateTime.fromJSDate(utcDateTime).setZone(userTimezone);

    return {
      date: dt.toISODate(),
      time_24h: dt.toFormat('HH:mm'),
      time_12h: dt.toFormat('h:mm a'),
      day_name: dt.toFormat('EEEE')
    };
  }
}

// Additional service methods for the AppointmentsService
export const AdditionalAppointmentMethods = {
  /**
   * Get appointments for a specific user with timezone conversion
   */
  async getUserAppointments(
    prisma: any,
    userId: number,
    userTimezone: string = 'UTC',
    limit: number = 10
  ) {
    const appointments = await prisma.appointment.findMany({
      where: {
        user_id: userId,
        start_at: {
          gte: new Date() // Only future appointments
        },
        status: {
          not: 'CANCELLED'
        }
      },
      include: {
        Consultant: {
          select: {
            id: true,
            full_name: true,
            bio: true,
            experience: true,
            profile_image: true,
            is_test_user: true
          }
        },
        Order: {
          select: {
            id: true,
            // Add other order fields as needed
          }
        }
      },
      orderBy: {
        start_at: 'asc'
      },
      take: limit
    });

    // Convert times to user timezone
    return appointments.map(appointment => ({
      ...appointment,
      display_info: TimezoneUtils.formatTimeForDisplay(
        appointment.start_at,
        userTimezone
      )
    }));
  },

  /**
   * Cancel an appointment
   */
  async cancelAppointment(prisma: any, appointmentId: number, userId?: number) {
    const whereClause: any = { id: appointmentId };
    if (userId) {
      whereClause.user_id = userId;
    }

    const appointment = await prisma.appointment.findUnique({
      where: whereClause
    });

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    // Check if appointment can be cancelled (e.g., not too close to start time)
    const now = DateTime.now();
    const appointmentStart = DateTime.fromJSDate(appointment.start_at);
    const hoursDifference = appointmentStart.diff(now, 'hours').hours;

    if (hoursDifference < 2) {
      throw new Error('Cannot cancel appointment less than 2 hours before start time');
    }

    return await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: 'CANCELLED',
        updated_at: new Date()
      }
    });
  },

  /**
   * Get consultant's schedule for a specific date
   */
  async getConsultantSchedule(
    prisma: any,
    consultantId: number,
    date: string,
    consultantTimezone: string = 'UTC'
  ) {
    const targetDate = DateTime.fromISO(date).setZone(consultantTimezone);
    const startOfDay = targetDate.startOf('day').toUTC();
    const endOfDay = targetDate.endOf('day').toUTC();

    const appointments = await prisma.appointment.findMany({
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
            // Add user fields as needed
          }
        }
      },
      orderBy: {
        start_at: 'asc'
      }
    });

    return appointments.map(appointment => ({
      ...appointment,
      display_info: TimezoneUtils.formatTimeForDisplay(
        appointment.start_at,
        consultantTimezone
      )
    }));
  }
};

// Database migration helper for updating existing data
export const MigrationHelpers = {
  /**
   * Update existing appointments with slot_date and slot_time
   * Run this after adding the new fields to update existing data
   */
  async updateExistingAppointments(prisma: any) {
    const appointments = await prisma.appointment.findMany({
      where: {
        OR: [
          { slot_date: null },
          { slot_time: null }
        ]
      }
    });

    for (const appointment of appointments) {
      if (appointment.start_at) {
        const startUTC = DateTime.fromJSDate(appointment.start_at);
        const slotDate = startUTC.startOf('day').toJSDate();
        const slotTime = startUTC.toFormat('HH:mm');

        await prisma.appointment.update({
          where: { id: appointment.id },
          data: {
            slot_date: slotDate,
            slot_time: slotTime
          }
        });
      }
    }

    console.log(`Updated ${appointments.length} appointments with slot information`);
  }
};

// Example usage and configuration
export const AppointmentConfig = {
  // Default settings
  DEFAULT_SLOT_DURATION: 20, // minutes
  DEFAULT_WORKING_HOURS: {
    start: '09:00',
    end: '18:00'
  },
  DEFAULT_WORKING_DAYS: [1, 2, 3, 4, 5, 6], // Monday to Saturday
  BOOKING_ADVANCE_WEEKS: 3,
  MINIMUM_CANCELLATION_HOURS: 2,

  // Supported timezones (add more as needed)
  SUPPORTED_TIMEZONES: [
    'UTC',
    'America/New_York',
    'America/Los_Angeles',
    'America/Chicago',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Asia/Kolkata',
    'Australia/Sydney',
    'America/Toronto',
    'Asia/Dubai',
    'Asia/Dhaka'
  ],

  // Validation helpers
  isValidTimezone: (timezone: string): boolean => {
    return AppointmentConfig.SUPPORTED_TIMEZONES.includes(timezone);
  }
};
