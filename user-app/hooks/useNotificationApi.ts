// hooks/api/useNotificationApi.ts
import { Get, Put, Delete } from '@sm/common';

interface GetNotificationsParams {
    page: number;
    limit: number;
    type?: string;
    isRead?: boolean;
}

export interface Notification {
    id: number;
    title: string;
    message: string;
    isRead: boolean;
    user_id: number;
    meta: any;
    type: string;
    consultant_id: number | null;
    created_at: string;
    updated_at: string | null;
    Consultant: any | null;
}

export interface NotificationsResponse {
    data: Notification[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export const useNotificationApi = () => {
    const getNotifications = async (params: GetNotificationsParams): Promise<NotificationsResponse> => {
        const queryParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                queryParams.append(key, value.toString());
            }
        });

        const url = `/user-notifications?${queryParams}`;
        return Get(url);
    };

    const markAsRead = async (notificationIds: number[]) => {
        return Put('/user-notifications/mark-as-read', { notificationIds });
    };

    const deleteNotifications = async (notificationIds: number[]) => {
        return Delete(`/user-notifications/${notificationIds}`);
    };

    return {
        getNotifications,
        markAsRead,
        deleteNotifications,
    };
};