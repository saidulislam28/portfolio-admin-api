import { transformApiDataToTimeSlots } from '@/services/mockDataService';
import { API_USER, DEFAULT_QUERY_GC_TIME, DEFAULT_QUERY_STALE_TIME, Get, replacePlaceholders } from '@sm/common';
import { useQuery } from '@tanstack/react-query';

export interface Slot {
  time: string;
  time_12h: string;
  is_booked: boolean;
  available_slots: number;
  total_slots: number;
}

export interface Day {
  date: string;
  day_name: string;
  slots: Slot[];
}

export interface Meta {
  timezone: string;
  generated_at: string;
  total_days: number;
}

export interface AppointmentSlotsApiResponse {
  success: boolean;
  data: Day[];
  meta: Meta;
}

export const useAppointmentTimeslots = (timezone: string) => {
    return useQuery({
        queryKey: ['appointment-time-slots'],
        queryFn: async (): Promise<AppointmentSlotsApiResponse> => {
            const data = await Get(replacePlaceholders(API_USER.get_appointment_slots, {timezone}));
            return transformApiDataToTimeSlots(data);
        },
        staleTime: __DEV__ ? 0 : DEFAULT_QUERY_STALE_TIME,
        gcTime: __DEV__ ? 0 : DEFAULT_QUERY_GC_TIME,
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
};