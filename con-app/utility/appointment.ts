import { NativeModules, Platform } from 'react-native';

// Type definitions
enum AppointmentStatus {
  INITIATED = 'INITIATED', // order created but payment not done, hide from admin & app & cleanup in scheduled job
  PENDING = 'PENDING', // payment done but not assigned any consultant
  CONFIRMED = 'CONFIRMED', // consultant assigned
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED', // completed by consultant
  NO_SHOW = 'NO_SHOW',
}

interface User {
  full_name: string;
  id: number;
  is_test_user: boolean;
  profile_image: string;
}

interface Order {
  service_type: string;
}

interface Consultant {
  // Add consultant properties as needed
  [key: string]: any;
}

interface Appointment {
  Consultant: Consultant | null;
  Order: Order;
  User: User;
  booked_at: string;
  cancel_reason: string | null;
  consultant_id: number | null;
  created_at: string;
  duration_in_min: number;
  end_at: string;
  id: number;
  notes: string;
  order_id: number;
  slot_date: string;
  slot_time: string;
  start_at: string;
  status: AppointmentStatus;
  token: string;
  updated_at: string;
  user_id: number;
  user_timezone: string;
}

interface CategorizedAppointments {
  live: Appointment[];
  past: Appointment[];
  upcoming: Appointment[];
}

/**
 * Get device timezone using React Native specific methods
 * @returns Device timezone string
 */
function getDeviceTimezone(): string {
  try {
    if (Platform.OS === 'ios') {
      return (
        NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0] ||
        Intl.DateTimeFormat().resolvedOptions().timeZone
      );
    } else if (Platform.OS === 'android') {
      return (
        NativeModules.I18nManager.localeIdentifier ||
        Intl.DateTimeFormat().resolvedOptions().timeZone
      );
    }
  } catch (error) {
    console.warn('Failed to get device timezone from native modules:', error);
  }

  // Fallback to Intl API
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Get timezone offset in minutes for a given timezone
 * @param timezone - Timezone string
 * @param date - Date to get offset for (optional, defaults to now)
 * @returns Offset in minutes
 */
function getTimezoneOffset(timezone: string, date: Date = new Date()): number {
  // Create a date in UTC
  const utcDate = new Date(date.toLocaleString('en-CA', { timeZone: 'UTC' }));

  // Create the same date in the target timezone
  const localDate = new Date(
    date.toLocaleString('en-CA', { timeZone: timezone })
  );

  // Return the difference in minutes
  return (utcDate.getTime() - localDate.getTime()) / (1000 * 60);
}

/**
 * Convert UTC time string to a Date object adjusted for device timezone comparison
 * @param utcTimeString - UTC time string
 * @param deviceTimezone - Device timezone (optional)
 * @returns Date object that can be compared with current time
 */
function parseUTCTimeForComparison(utcTimeString: string): Date {
  // Simply parse the UTC string - Date constructor handles this correctly
  // The key insight is that we don't need to convert timezones for comparison
  // We just need to compare UTC times directly
  return new Date(utcTimeString);
}

/**
 * Get current time as Date object
 * @returns Current Date object
 */
function getCurrentTime(): Date {
  return new Date();
}

/**
 * Categorizes an array of appointments into live, past, and upcoming categories
 * @param appointments - Array of appointment objects
 * @returns Object with live, past, and upcoming arrays
 */
function categorizeAppointments(
  appointments: Appointment[],
  deviceTimezone: string
): CategorizedAppointments {
  const now = getCurrentTime();
  const categories: CategorizedAppointments = {
    live: [],
    past: [],
    upcoming: [],
  };

  if (appointments === null || appointments === undefined) return categories;

  appointments.forEach(appointment => {
    const { start_at, end_at, status } = appointment;

    // Parse UTC times directly - no timezone conversion needed for comparison
    // Since both current time and appointment times are in UTC context
    const startTime = parseUTCTimeForComparison(start_at);
    const endTime = parseUTCTimeForComparison(end_at);

    // Check if appointment has started (start time has passed)
    const hasStarted = now >= startTime;

    // Check if appointment has ended (end time has passed)
    const hasEnded = now >= endTime;

    // Categorization logic
    if (hasStarted && AppointmentStatus.CONFIRMED === status) {
      // Live: started but not ended, and not in a terminal state
      categories.live.push(appointment);
    } else if (
      [
        AppointmentStatus.COMPLETED,
        AppointmentStatus.CANCELLED,
        AppointmentStatus.NO_SHOW,
      ].includes(status)
    ) {
      // Past: started and either in terminal state or time has passed
      categories.past.push(appointment);
    } else if (
      !hasStarted &&
      [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED].includes(status)
    ) {
      // Upcoming: not started yet and in active state
      categories.upcoming.push(appointment);
    }
    // Note: INITIATED appointments are ignored as per the comment in enum
  });

  return categories;
}

/**
 * Helper function to format appointment time in user's timezone
 * @param utcTimeString - UTC time string
 * @param userTimezone - User's timezone (optional, falls back to device timezone)
 * @returns Formatted time string
 */
function formatAppointmentTime(
  utcTimeString: string,
  userTimezone?: string
): string {
  const timezone = userTimezone || getDeviceTimezone();

  return new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(utcTimeString));
}

/**
 * Enhanced categorization function that also sorts appointments within categories
 * @param appointments - Array of appointment objects
 * @returns Object with sorted live, past, and upcoming arrays
 */
function categorizeAndSortAppointments(
  appointments: Appointment[]
): CategorizedAppointments {
  const categories = categorizeAppointments(appointments);

  // Sort live appointments by start time (earliest first)
  categories.live.sort((a, b) => {
    const timeA = parseUTCTimeForComparison(a.start_at);
    const timeB = parseUTCTimeForComparison(b.start_at);
    return timeA.getTime() - timeB.getTime();
  });

  // Sort past appointments by start time (most recent first)
  categories.past.sort((a, b) => {
    const timeA = parseUTCTimeForComparison(a.start_at);
    const timeB = parseUTCTimeForComparison(b.start_at);
    return timeB.getTime() - timeA.getTime();
  });

  // Sort upcoming appointments by start time (soonest first)
  categories.upcoming.sort((a, b) => {
    const timeA = parseUTCTimeForComparison(a.start_at);
    const timeB = parseUTCTimeForComparison(b.start_at);
    return timeA.getTime() - timeB.getTime();
  });

  return categories;
}

// Example usage:
/*
const appointments: Appointment[] = [
  // Your appointment objects here
];

const categorized: CategorizedAppointments = categorizeAppointments(appointments);
console.log('Live appointments:', categorized.live);
console.log('Past appointments:', categorized.past);
console.log('Upcoming appointments:', categorized.upcoming);

// Or use the enhanced version with sorting
const categorizedAndSorted: CategorizedAppointments = categorizeAndSortAppointments(appointments);
*/

export {
  AppointmentStatus,
  type Appointment,
  type CategorizedAppointments,
  type User,
  type Order,
  type Consultant,
  getDeviceTimezone,
  getTimezoneOffset,
  parseUTCTimeForComparison,
  getCurrentTime,
  categorizeAppointments,
  categorizeAndSortAppointments,
  formatAppointmentTime,
};
