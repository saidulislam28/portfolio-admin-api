export type AppointmentType = 'Mock Test' | 'Conversation';

export interface Appointment {
  id: string;
  type: AppointmentType;
  date: string;
  withWhom: string;
  title: string;
  duration: number; // in minutes
  isLive?: boolean;
  status?: string;
  Consultant?: {
    full_name?: string
  }
}