export type NotificationEventName = 'end_call' | 'start_call' | 'incoming_call';

export interface CallStartPushNotificationDataPayload {
  [key: string]: string; // Firebase Admin SDK’s messaging().send() expects the data field to be data?: { [key: string]: string };
  caller_name: string;
  caller_image: string;
  title: string;
  app: string;
  event_type: 'incoming_call';
  user_id: string;
  consultant_id: string;
  consultant_name?: string;
  consultant_image?: string;
  user_name?: string;
  user_image?: string;
  appointment_token: string;
}

export interface CallEndPushNotificationDataPayload {
  [key: string]: string; // Firebase Admin SDK’s messaging().send() expects the data field to be data?: { [key: string]: string };
  title: string;
  app: string;
  event_type: 'call_ended';
  user_id: string;
  consultant_id: string;
  consultant_name?: string;
  user_name?: string;
  ended_by: 'user' | 'consultant';
  appointment_token: string;
}