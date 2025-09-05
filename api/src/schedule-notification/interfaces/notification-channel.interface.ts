export interface NotificationChannelService {
  send(notification: any): Promise<{ success: boolean; error?: string }>;
}