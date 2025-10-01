import { NotificationType } from '@prisma/client';

export class NotificationResponseDto {
  id: number;
  title: string | null;
  message: string | null;
  isRead: boolean | null;
  userId: number | null;
  meta: any;
  type: NotificationType;
  consultantId: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}