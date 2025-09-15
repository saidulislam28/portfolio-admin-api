export type AppointmentType = 'Mock Test' | 'Conversation';

export interface Appointment {
  id: string;
  type: AppointmentType;
  date: Date;
  withWhom: string;
  title: string;
  duration: number; // in minutes
  isLive?: boolean;
}
