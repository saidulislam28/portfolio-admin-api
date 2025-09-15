/**
 * Converts a UTC datetime string to a formatted time string in AM/PM format
 * for a specific timezone
 *
 * @param utcDateTimeString - UTC datetime string in ISO format (e.g., "2025-09-13T07:00:37.822Z")
 * @param timezone - Target timezone string (e.g., "Asia/Dhaka", "America/New_York")
 * @returns Formatted time string in AM/PM format (e.g., "1:00 PM")
 */
export const convertUtcToTimezoneFormat = (
  utcDateTimeString: string,
  timezone: string | null
): string => {
  if (timezone === null) return '';

  try {
    // Create a Date object from the UTC string
    const utcDate = new Date(utcDateTimeString);

    // Check if the date is valid
    if (isNaN(utcDate.getTime())) {
      throw new Error('Invalid date string provided');
    }

    // Convert to the target timezone and format as time
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    return formatter.format(utcDate);
  } catch (error) {
    console.error('Error converting datetime:', error);
    throw new Error(
      `Failed to convert datetime: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

/**
 * Extended version that also returns date information
 *
 * @param utcDateTimeString - UTC datetime string in ISO format
 * @param timezone - Target timezone string
 * @returns Object with formatted time, date, and datetime
 */
export const convertUtcToTimezoneDetails = (
  utcDateTimeString: string,
  timezone: string
): {
  time: string;
  date: string;
  datetime: string;
  dayOfWeek: string;
} => {
  try {
    const utcDate = new Date(utcDateTimeString);

    if (isNaN(utcDate.getTime())) {
      throw new Error('Invalid date string provided');
    }

    const timeFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    const dateFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    const datetimeFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    const dayFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'long',
    });

    return {
      time: timeFormatter.format(utcDate),
      date: dateFormatter.format(utcDate),
      datetime: datetimeFormatter.format(utcDate),
      dayOfWeek: dayFormatter.format(utcDate),
    };
  } catch (error) {
    console.error('Error converting datetime:', error);
    throw new Error(
      `Failed to convert datetime: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

/**
 * Batch convert multiple UTC datetime strings to timezone format
 *
 * @param utcDateTimeStrings - Array of UTC datetime strings
 * @param timezone - Target timezone string
 * @returns Array of formatted time strings
 */
export const batchConvertUtcToTimezone = (
  utcDateTimeStrings: string[],
  timezone: string
): string[] => {
  return utcDateTimeStrings.map(dateTimeString =>
    convertUtcToTimezoneFormat(dateTimeString, timezone)
  );
};

/**
 * Get current time in specified timezone
 *
 * @param timezone - Target timezone string
 * @returns Current time in AM/PM format for the specified timezone
 */
export const getCurrentTimeInTimezone = (timezone: string): string => {
  const now = new Date();
  return convertUtcToTimezoneFormat(now.toISOString(), timezone);
};

/**
 * Check if a timezone string is valid
 *
 * @param timezone - Timezone string to validate
 * @returns boolean indicating if timezone is valid
 */
export const isValidTimezone = (timezone: string): boolean => {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
};

// Example usage and common timezones
export const COMMON_TIMEZONES = {
  // Asia
  DHAKA: 'Asia/Dhaka',
  KOLKATA: 'Asia/Kolkata',
  TOKYO: 'Asia/Tokyo',
  SHANGHAI: 'Asia/Shanghai',
  DUBAI: 'Asia/Dubai',

  // Americas
  NEW_YORK: 'America/New_York',
  LOS_ANGELES: 'America/Los_Angeles',
  CHICAGO: 'America/Chicago',
  SAO_PAULO: 'America/Sao_Paulo',

  // Europe
  LONDON: 'Europe/London',
  PARIS: 'Europe/Paris',
  BERLIN: 'Europe/Berlin',
  MOSCOW: 'Europe/Moscow',

  // Others
  UTC: 'UTC',
  SYDNEY: 'Australia/Sydney',
  CAIRO: 'Africa/Cairo',
} as const;

// Usage Examples:

/*
// Basic usage
const utcTime = "2025-09-13T07:00:37.822Z";
const dhakaTime = convertUtcToTimezoneFormat(utcTime, "Asia/Dhaka");
console.log(dhakaTime); // "1:00 PM"

// Using constants
const newYorkTime = convertUtcToTimezoneFormat(utcTime, COMMON_TIMEZONES.NEW_YORK);
console.log(newYorkTime); // "3:00 AM"

// Extended details
const details = convertUtcToTimezoneDetails(utcTime, "Asia/Dhaka");
console.log(details);
// {
//   time: "1:00 PM",
//   date: "Sep 13, 2025",
//   datetime: "Sep 13, 2025, 1:00 PM",
//   dayOfWeek: "Saturday"
// }

// Batch conversion
const utcTimes = [
  "2025-09-13T07:00:37.822Z",
  "2025-09-13T14:30:00.000Z",
  "2025-09-13T20:15:45.123Z"
];
const dhakaTimes = batchConvertUtcToTimezone(utcTimes, "Asia/Dhaka");
console.log(dhakaTimes); // ["1:00 PM", "8:30 PM", "2:15 AM"]

// Current time in timezone
const currentDhakaTime = getCurrentTimeInTimezone("Asia/Dhaka");
console.log(currentDhakaTime); // Current time in Dhaka

// Validate timezone
console.log(isValidTimezone("Asia/Dhaka")); // true
console.log(isValidTimezone("Invalid/Timezone")); // false
*/
