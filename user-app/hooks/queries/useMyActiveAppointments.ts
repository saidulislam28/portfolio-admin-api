import { API_USER, DEFAULT_QUERY_GC_TIME, DEFAULT_QUERY_STALE_TIME, Get } from '@sm/common';
import { useQuery } from '@tanstack/react-query';

export interface Appointment {
  id: number;
  start_at: string;
  end_at: string;
  status: string;
  duration_in_min: number;
  notes: string | null;
  booked_at: string;
  token: string;
  consultant_id: number | null;
  user_id: number;
  cancel_reason: string | null;
  order_id: number;
  slot_date: string;
  slot_time: string;
  user_timezone: string;
  created_at: string;
  updated_at: string;
}

export interface Meta {
  generated_at: string;
  total_days: number;
}

export interface MyActiveAppointmentsApiResponse {
  success: boolean;
  data: Appointment[];
  meta: Meta;
}

export const useMyActiveAppointments = () => {
    return useQuery({
        queryKey: ['my-active-appointments'],
        queryFn: async (): Promise<MyActiveAppointmentsApiResponse> => {
            const data = await Get(API_USER.active_appointments);
            return data;
        },
        staleTime: __DEV__ ? 0 : DEFAULT_QUERY_STALE_TIME,
        gcTime: __DEV__ ? 0 : DEFAULT_QUERY_GC_TIME,
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
};