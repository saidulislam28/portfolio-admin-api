export type CallPushNotificationEventType = 'end_call' | 'start_call' | 'incoming_call';
export interface CallPushNotificationDataPayload {
    title: string;
    event_type: CallPushNotificationEventType;
    user_id: string;
    user_name?: string;
    user_image?: string;
    consultant_id: string;
    consultant_name?: string;
    consultant_image?: string;
    appointment_token: string;
    appointment_id?: string;
}
