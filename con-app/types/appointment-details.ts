export interface User {
  id: number;
  full_name: string;
  profile_image?: string;
  email: string;
  phone?: string;
  is_verified?: boolean;
  expected_level?: string;
  is_test_user?: boolean;
}

export interface Order {
  service_type: string;
}

export interface Feedback {
  MockTestFeedback?: any;
  ConversationFeedback?: any;
}

export interface Appointment {
  id: number;
  token?: string;
  consultant_id: number;
  user_id: number;
  User: User;
  status: string;
  start_at: string;
  end_at: string;
  duration_in_min: number;
  Order?: Order;
  notes?: string;
  MockTestFeedback?: any;
  ConversationFeedback?: any;
  Rating?: any;
}

export interface AppointmentDetailPageProps {
  appointment?: Appointment;
  onRefresh?: () => void;
  onStatusChange?: (newStatus: string) => Promise<boolean>;
  onNoteUpdate?: (newNote: string) => Promise<boolean>;
  onCallStart?: () => void;
  showHeader?: boolean;
  showActions?: boolean;
  isTabletOverride?: boolean;
  customRoutes?: {
    myAppointments: string;
    mockFeedback: string;
    conversationFeedback: string;
  };
  customConstants?: {
    primaryColor?: string;
    secondaryColor?: string;
  };
}

export type BookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'COMPLETED';