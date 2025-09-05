import { TIME_SLOTS, PACKAGE_PRICES } from '@/lib/constants';
import { Get } from '@sm/common';

// Mock user data
export const mockUser = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  isForeigner: false, // Change to true to test foreign pricing
  currency: 'BDT'
};

// Mock packages data
export const mockPackages = [
  // 🔹 speaking_mock_test
  {
    id: 1,
    name: 'Get One IELTS Mock Speaking Test',
    price: PACKAGE_PRICES.SINGLE,
    sessions: 1,
    type: 'fixed',
    description: 'Single mock speaking test session',
    serviceType: 'speaking_mock_test'
  },
  {
    id: 2,
    name: 'Three IELTS Mock Speaking Test',
    price: PACKAGE_PRICES.THREE,
    sessions: 3,
    type: 'fixed',
    description: 'Three mock speaking test sessions',
    serviceType: 'speaking_mock_test'
  },

  // 🔹 conversation
  {
    id: 3,
    name: 'One Conversation Practice Session',
    price: 200,
    sessions: 1,
    type: 'fixed',
    description: 'One-on-one conversation practice',
    serviceType: 'conversation'
  },
  {
    id: 4,
    name: 'Five Conversation Practice Sessions',
    price: 900,
    sessions: 5,
    type: 'fixed',
    description: 'Bundle of five conversation sessions',
    serviceType: 'conversation'
  },

  // 🔹 spoken
  {
    id: 5,
    name: 'Spoken English Beginner Package',
    price: 1500,
    sessions: 10,
    type: 'fixed',
    description: 'Basic spoken English improvement',
    serviceType: 'spoken'
  },
  {
    id: 6,
    name: 'Advanced Spoken English Package',
    price: 2500,
    sessions: 15,
    type: 'fixed',
    description: 'Advanced level spoken English training',
    serviceType: 'spoken'
  },

  // 🔹 ielts_academic
  {
    id: 7,
    name: 'IELTS Academic Prep - Basic',
    price: 1800,
    sessions: 8,
    type: 'fixed',
    description: 'Academic module preparation - basic',
    serviceType: 'ielts_academic'
  },
  {
    id: 8,
    name: 'IELTS Academic Prep - Advanced',
    price: 3200,
    sessions: 16,
    type: 'fixed',
    description: 'Academic module preparation - advanced',
    serviceType: 'ielts_academic'
  },

  // 🔹 ielts_gt
  {
    id: 9,
    name: 'IELTS GT Prep - Basic',
    price: 1700,
    sessions: 8,
    type: 'fixed',
    description: 'General Training IELTS - basic sessions',
    serviceType: 'ielts_gt'
  },
  {
    id: 10,
    name: 'IELTS GT Prep - Advanced',
    price: 3100,
    sessions: 16,
    type: 'fixed',
    description: 'General Training IELTS - advanced sessions',
    serviceType: 'ielts_gt'
  },

  // 🔹 book_purchase
  {
    id: 11,
    name: 'IELTS Academic Book Set',
    price: 500,
    sessions: 0,
    type: 'fixed',
    description: 'Books for academic module prep',
    serviceType: 'book_purchase'
  },
  {
    id: 12,
    name: 'IELTS GT Book Set',
    price: 500,
    sessions: 0,
    type: 'fixed',
    description: 'Books for general training module prep',
    serviceType: 'book_purchase'
  },

  // 🔹 exam_registration
  {
    id: 13,
    name: 'IELTS Exam Registration (Academic)',
    price: 17000,
    sessions: 0,
    type: 'fixed',
    description: 'Register for IELTS Academic test',
    serviceType: 'exam_registration'
  },
  {
    id: 14,
    name: 'IELTS Exam Registration (GT)',
    price: 17000,
    sessions: 0,
    type: 'fixed',
    description: 'Register for IELTS General Training test',
    serviceType: 'exam_registration'
  }
];

// Generate next 30 days with random booked slots
const generateNext30Days = () => {
  const dates = [];
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    // Skip past dates and times
    const isPastDate = date.toDateString() === today.toDateString();
    const currentHour = today.getHours();

    const slots = TIME_SLOTS.map((time, index) => {
      const [timeStr, period] = time.split(' ');
      const [hours, minutes] = timeStr.split(':');
      let hour24 = parseInt(hours);

      if (period === 'PM' && hour24 !== 12) {
        hour24 += 12;
      } else if (period === 'AM' && hour24 === 12) {
        hour24 = 0;
      }

      // Check if this slot is in the past for today
      const isPastSlot = isPastDate && hour24 < currentHour;

      // Randomly mark some slots as booked (30% chance)
      const isRandomlyBooked = Math.random() < 0.3;

      return {
        id: `${date.toISOString().split('T')[0]}-${index}`,
        time: time,
        is_booked: isPastSlot || isRandomlyBooked,
        is_past: isPastSlot
      };
    }).filter(slot => !slot.is_past); // Remove past slots

    if (slots.length > 0) { // Only add dates that have available slots
      dates.push({
        date: date.toISOString().split('T')[0],
        dateString: date.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        slots: slots
      });
    }
  }

  return dates;
};

export const mockAvailableDates = generateNext30Days();

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

// Mock API functions
export const apiService = {
  // Simulate login
  login: async (email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, user: mockUser });
      }, 1000);
    });
  },

  // Get available packages
  getPackages: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, packages: mockPackages });
      }, 500);
    });
  },

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

  // Process payment
  processPayment: async (paymentData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate 95% success rate
        const success = Math.random() > 0.05;
        resolve({
          success,
          transactionId: success ? `TXN_${Date.now()}` : null,
          message: success ? 'Payment successful' : 'Payment failed'
        });
      }, 2000);
    });
  },

  // Create booking
  createBooking: async (bookingData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          bookingId: `BK_${Date.now()}`,
          message: 'Booking created successfully'
        });
      }, 1000);
    });
  }
};