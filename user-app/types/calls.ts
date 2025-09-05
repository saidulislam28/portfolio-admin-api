export interface CallEvent {
  type: 'user_joined' | 'user_left' | 'connection_lost' | 'call_ended';
  userId?: string;
  data?: any;
  timestamp: Date;
}

export interface CallQuality {
  networkQuality: 'excellent' | 'good' | 'poor' | 'bad' | 'very_bad' | 'unknown';
  audioQuality: 'excellent' | 'good' | 'poor' | 'bad' | 'very_bad' | 'unknown';
  videoQuality: 'excellent' | 'good' | 'poor' | 'bad' | 'very_bad' | 'unknown';
  packetLossRate: number;
  rtt: number; // Round trip time in ms
}

export interface CallMetrics {
  duration: number;
  startTime: Date;
  endTime?: Date;
  quality: CallQuality;
  participants: number;
  events: CallEvent[];
}