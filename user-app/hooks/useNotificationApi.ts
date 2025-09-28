// hooks/api/useNotificationApi.ts
import { useAuth } from '@/context/useAuth';
import { NotificationsResponse } from './useUserNotification';
import Constants from "expo-constants";

interface GetNotificationsParams {
    page: number;
    limit: number;
    type?: string;
    isRead?: boolean;
}

export const useNotificationApi = () => {
    const { token } = useAuth();

    const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl
    console.log("token from notification hook:", token);


    const getNotifications = async (params: GetNotificationsParams): Promise<NotificationsResponse> => {
        // const token = await getAccessToken();
        const queryParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                queryParams.append(key, value.toString());
            }
        });

        const response = await fetch(`${API_BASE_URL}/user-notifications?${queryParams}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch notifications');
        }

        return response.json();
    };

    const markAsRead = async (notificationIds: number[]) => {
        // const token = await getAccessToken();

        const response = await fetch(`${API_BASE_URL}/user-notifications/mark-as-read`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ notificationIds }),
        });

        if (!response.ok) {
            throw new Error('Failed to mark notifications as read');
        }

        return response.json();
    };

    const markAllAsRead = async () => {
        // Implementation would depend on your API
        // This is a placeholder that would need to be implemented
    };

    const deleteNotifications = async (notificationIds: number[]) => {
        // const token = await getAccessToken();

        const response = await fetch(`${API_BASE_URL}/user-notifications`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ notificationIds }),
        });

        if (!response.ok) {
            throw new Error('Failed to delete notifications');
        }

        return response.json();
    };

    return {
        getNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotifications,
    };
};