import { API_CONSULTANT, Get } from '@sm/common';
import { useQuery } from '@tanstack/react-query';


export const useCalenderAppointment = () => {
  return useQuery({
    queryKey: ['calender-appointment'],
    queryFn: async () => {
      const data = await Get(API_CONSULTANT.appointment_calendar);
      return data;
    },
    staleTime: __DEV__ ? 0 : Infinity,
    gcTime: __DEV__ ? 0 : Infinity,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    select: resp => resp?.data,
  });
};
