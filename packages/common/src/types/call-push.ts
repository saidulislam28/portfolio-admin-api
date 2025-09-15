export type CallPushNotificationEventType = 'end_call' | 'start_call' | 'incoming_call';

export interface CallPushNotificationDataPayload {
  title: string;
  event_type: CallPushNotificationEventType;
  user_id: string;
  user_name?: string;
  user_image?: string; // value will be NOT_AVAILABLE if image is not found, since we cannot pass null or undefined in FCM push data
  consultant_id: string;
  consultant_name?: string;
  consultant_image?: string; // value will be NOT_AVAILABLE if image is not found, since we cannot pass null or undefined in FCM push data
  appointment_token: string;
  appointment_id?: string;
}