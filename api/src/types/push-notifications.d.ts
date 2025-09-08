export type NotificationEventName = 'end_call' | 'start_call' | 'incoming_call';

export interface CallStartPushNotificationDataPayload {
  [key: string]: string; // Firebase Admin SDK’s messaging().send() expects the data field to be data?: { [key: string]: string };
  caller_name: string;
  caller_image?: string;
  title?: string;
  app?: string;
  event_type: NotificationEventName;
  appointment_token?: string;
  user_id?: string;
  consultant_id?: string;
  consultant_name?: string;
  consultant_image?: string;
}