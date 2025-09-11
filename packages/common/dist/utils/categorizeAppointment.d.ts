import { Appointment, CategorizedAppointments } from "../types";
/**
 * Categorizes an array of appointments into live, past, and upcoming categories
 * @param appointments - Array of appointment objects
 * @returns Object with live, past, and upcoming arrays
 */
export declare function categorizeAppointments(appointments: Appointment[], deviceTimezone: string): CategorizedAppointments;
/**
 * Helper function to format appointment time in user's timezone
 * @param utcTimeString - UTC time string
 * @param userTimezone - User's timezone (optional, falls back to device timezone)
 * @returns Formatted time string
 */
export declare function formatAppointmentTime(utcTimeString: string, userTimezone?: string): string;
/**
 * Helper function to format appointment time in user's timezone
 * @param utcTimeString - UTC time string
 * @param userTimezone - User's timezone (optional, falls back to device timezone)
 * @returns Formatted time string
 */
/**
 * Enhanced categorization function that also sorts appointments within categories
 * @param appointments - Array of appointment objects
 * @returns Object with sorted live, past, and upcoming arrays
 */
