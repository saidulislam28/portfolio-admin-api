import { Get } from '@sm/common';

// Mock user data
export const mockUser = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  isForeigner: false, // Change to true to test foreign pricing
  currency: 'BDT'
};

const transformApiDataToTimeSlots = (apiResponse) => {
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
        is_booked: slot.is_booked || isPastSlot,
        is_past: isPastSlot
      };
    }).filter(slot => !slot.is_past); // Filter out past slots

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
  }).filter(day => day.slots.length > 0); // Only include days with available slots
};

export const apiService = {

  // Get available dates and slots
  getAvailableDates: async () => {
    const data = await Get('app/appointments/slots?timezone=Asia/Dhaka');
    return transformApiDataToTimeSlots(data);
  },

  // Lock time slot
  lockTimeSlot: async (slotId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate 90% success rate
        const success = true;
        resolve({ success, message: success ? 'Slot locked successfully' : 'Slot already taken' });
      }, 10);
    });
  },
};