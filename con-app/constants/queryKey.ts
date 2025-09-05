export const QUERY_KEYS = {
  departments: ['departments'] as const,
  hospitals: {
    topRated: ['hospitals', 'top-rated'] as const,
    details: ['hospitals', 'details'] as const,
    staffs: ['hospitals', 'staffs'] as const,
  },
  timeslots: {
    daterange: ['timeslots', 'daterange'] as const,
  },
  doctors: {
    services: ['doctors', 'services'] as const,
  },
  mybookings: {
    upcoming: ['mybookings', 'upcoming'] as const,
  },
};
