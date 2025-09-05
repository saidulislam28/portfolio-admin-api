
export interface TimeSlot {
  time: string; // HH:mm format
  time_12h: string; // 12-hour format for display
  is_booked: boolean;
  available_slots: number;
  total_slots: number;
}

export interface DaySlots {
  date: string; // YYYY-MM-DD format
  day_name: string;
  slots: TimeSlot[];
}

export interface CreateAppointmentDto {
  start_at: string; // ISO datetime string
  end_at: string;
  consultant_id?: number;
  user_id?: number;
  order_id: number;
  notes?: string;
  user_timezone: string;
}