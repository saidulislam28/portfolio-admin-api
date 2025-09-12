import { AppointmentSlotsApiResponse } from '@/hooks/queries/useAppointmentTimeslots';
import { getUserDeviceTimezone } from '@/utils/userTimezone';
import { API_USER, Get, replacePlaceholders } from '@sm/common';

// Mock user data
export const mockUser = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  isForeigner: false, // Change to true to test foreign pricing
  currency: 'BDT'
};

/**
 * Interface for a single transformed time slot.
 * @interface TransformedSlot
 * @property {string} id - A unique identifier for the slot, combining date and index.
 * @property {string} time - The time of the slot in 12-hour format (e.g., "9:00 AM").
 * @property {boolean} is_booked - Indicates if the slot is booked or if it's a past slot.
 * @property {boolean} is_past - Indicates if the slot is in the past.
 */
export interface TransformedSlot {
  id: string;
  time: string;
  date_time_raw: string;
  is_booked: boolean;
  is_past: boolean;
}

/**
 * Interface for a single transformed day.
 * @interface TransformedDay
 * @property {string} date - The date of the day in "YYYY-MM-DD" format.
 * @property {string} dateString - The full formatted date string (e.g., "Tuesday, May 27, 2025").
 * @property {TransformedSlot[]} slots - An array of transformed time slots for the day.
 */
export interface TransformedDay {
  date: string;
  dateString: string;
  slots: TransformedSlot[];
}

/**
 * Interface for the entire transformed data structure.
 * @interface TransformedApiResponse
 * @property {TransformedDay[]} transformedData - An array of transformed days.
 */
export type TransformedApiResponse = TransformedDay[];

/**
 * Transforms raw API appointment data into a more usable format for a frontend application.
 * It filters out past slots and days with no available slots, and provides a formatted date string.
 *
 * @param {AppointmentSlotsApiResponse} apiResponse - The raw API response containing appointment slots.
 * @returns {TransformedApiResponse} An array of transformed day objects, each containing an array of available time slots.
 */
export const transformApiDataToTimeSlots = (apiResponse: AppointmentSlotsApiResponse): TransformedApiResponse => {
  const today = new Date();

  return apiResponse.data.map(day => {
    const date = new Date(day.date);
    const isToday = date.toDateString() === today.toDateString();
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();

    const slots = day.slots.map((slot, index) => {
      const [hourStr, minuteStr] = slot.time.split(':');
      const slotHour = parseInt(hourStr);
      const slotMinute = parseInt(minuteStr);

      let isPastSlot = false;
      if (isToday) {
        if (slotHour < currentHour || (slotHour === currentHour && slotMinute <= currentMinute)) {
          isPastSlot = true;
        }
      } else if (date < today) {
        isPastSlot = true;
      }

      return {
        id: `${day.date}-${index}`,
        time: slot.time_12h,
        date_time_raw: `${day.date}T${slot.time}:00`,
        is_booked: slot.is_booked || isPastSlot,
        is_past: isPastSlot
      };
    }).filter(slot => !slot.is_past);

    return {
      date: day.date,
      dateString: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      slots
    };
  }).filter(day => day.slots.length > 0);
};

export const apiService = {

};