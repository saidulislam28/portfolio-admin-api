import { NativeModules, Platform } from 'react-native';

// Type definitions
enum AppointmentStatus {
  INITIATED = 'INITIATED',
  PENDING = 'PENDING',
  CONFIRMED = 'confirmed', // Updated to match your API response
  CANCELLED = 'CANCELLED',
  COMPLETED = 'completed', // Updated to match your API response
  NO_SHOW = 'NO_SHOW'
}

interface IOrder {
  id: number;
  service_type: string
}

interface IConsultant {
  full_name: string
}

// Updated interface to match your API response structure
interface Appointment {
  id: number;
  client: string;
  duration: number;
  start_at: string;
  end_at: string;
  status: string; // Using string to handle both enum and API values
  notes: string;
  time: string;
  type: string;
  Order: IOrder;
  Consultant: IConsultant;
  duration_in_min: number;
  cancel_reason: string;

}

interface CategorizedAppointments {
  live: Appointment[];
  past: Appointment[];
  upcoming: Appointment[];
}

// API response structure
interface AppointmentApiResponse {
  [date: string]: Appointment[];
}

/**
 * Get device timezone using React Native specific methods
 */
function getDeviceTimezone(): string {
  try {
    if (Platform.OS === 'ios') {
      return NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0] ||
        Intl.DateTimeFormat().resolvedOptions().timeZone;
    } else if (Platform.OS === 'android') {
      return NativeModules.I18nManager.localeIdentifier ||
        Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
  } catch (error) {
    console.warn('Failed to get device timezone from native modules:', error);
  }
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Convert UTC time string to a Date object adjusted for device timezone comparison
 */
function parseUTCTimeForComparison(utcTimeString: string): Date {
  return new Date(utcTimeString);
}

/**
 * Get current time as Date object
 */
function getCurrentTime(): Date {
  return new Date();
}

/**
 * Categorizes appointments into live, past, and upcoming categories
 * Handles the new object format with date keys
 */
function categorizeAppointments(appointmentsData: any, deviceTimezone: string): CategorizedAppointments {
  const now = getCurrentTime();

  const categories: CategorizedAppointments = {
    live: [],
    past: [],
    upcoming: []
  };

  if (!appointmentsData) return categories;

  console.log("appointment data from categorize function:", appointmentsData);

  // Handle the new object format: { "2025-08-26": [...], "2025-08-27": [...] }
  let appointmentsArray: Appointment[] = [];

  if (Array.isArray(appointmentsData)) {
    // If it's already an array (old format)
    appointmentsArray = appointmentsData;
  } else if (typeof appointmentsData === 'object' && appointmentsData !== null) {
    // If it's an object with date keys (new format)
    appointmentsArray = Object.values(appointmentsData).flat() as Appointment[];
  }

  // console.log("Flattened appointments array:", appointmentsArray);

  appointmentsArray.forEach(appointment => {
    const { start_at, end_at, status } = appointment;

    // Parse UTC times directly
    const startTime = parseUTCTimeForComparison(start_at);
    const endTime = parseUTCTimeForComparison(end_at);

    // Check if appointment has started and ended
    const hasStarted = now >= startTime;
    const hasEnded = now >= endTime;

    // Convert status to uppercase for consistent comparison
    const normalizedStatus = status.toUpperCase();

    // Categorization logic
    if (hasStarted && !hasEnded && 
        ![AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED, AppointmentStatus.NO_SHOW]
        .includes(normalizedStatus as AppointmentStatus)) {
      categories.live.push(appointment);
    } else if ([AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED, AppointmentStatus.NO_SHOW]
              .includes(normalizedStatus as AppointmentStatus) || hasEnded) {
      categories.past.push(appointment);
    } else if (!hasStarted && 
              [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED]
              .includes(normalizedStatus as AppointmentStatus)) {
      categories.upcoming.push(appointment);
    }
  });

  return categories;
}

/**
 * Enhanced categorization function that also sorts appointments within categories
 */
function categorizeAndSortAppointments(appointmentsData: any): CategorizedAppointments {
  // Handle both array and object formats
  let appointmentsArray: Appointment[] = [];
  
  if (Array.isArray(appointmentsData)) {
    appointmentsArray = appointmentsData;
  } else if (typeof appointmentsData === 'object' && appointmentsData !== null) {
    appointmentsArray = Object.values(appointmentsData).flat() as Appointment[];
  }

  const categories = categorizeAppointments(appointmentsArray, getDeviceTimezone());

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

/**
 * Helper function to format appointment time in user's timezone
 */
function formatAppointmentTime(utcTimeString: string, userTimezone?: string): string {
  const timezone = userTimezone || getDeviceTimezone();
  return new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(new Date(utcTimeString));
}

export {
  AppointmentStatus,
  type Appointment,
  type CategorizedAppointments,
  type AppointmentApiResponse,
  getDeviceTimezone,
  parseUTCTimeForComparison,
  getCurrentTime,
  categorizeAppointments,
  categorizeAndSortAppointments,
  formatAppointmentTime
};