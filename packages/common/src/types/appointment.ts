export enum IAppointmentStatus {
  INITIATED = 'INITIATED', // order created but payment not done, hide from admin & app & cleanup in scheduled job
  PENDING = 'PENDING', // payment done but not assigned any consultant
  CONFIRMED = 'CONFIRMED', // consultant assigned
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED', // completed by consultant
  NO_SHOW = 'NO_SHOW'
}

interface AppointmentUser {
  full_name: string;
  id: number;
  is_test_user: boolean;
  profile_image: string;
}

export interface CategorizedAppointments {
  live: Appointment[];
  past: Appointment[];
  upcoming: Appointment[];
}

export interface Order {
  service_type: string;
}

export interface Consultant {
  // Add consultant properties as needed
  [key: string]: any;
}

export interface Appointment {
  Consultant: Consultant | null;
  Order: Order;
  User: AppointmentUser;
  booked_at: string;
  cancel_reason: string | null;
  consultant_id: number | null;
  created_at: string;
  duration_in_min: number;
  end_at: string;
  id: number;
  notes: string;
  order_id: number;
  slot_date: string;
  slot_time: string;
  start_at: string;
  status: IAppointmentStatus;
  token: string;
  updated_at: string;
  user_id: number;
  user_timezone: string;
}