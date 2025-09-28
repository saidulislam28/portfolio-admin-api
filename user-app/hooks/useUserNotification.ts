// hooks/useNotifications.ts
import { InfiniteData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNotificationApi } from './useNotificationApi';

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

export const useNotifications = (filters?: { type?: string; isRead?: boolean }) => {
    const notificationApi = useNotificationApi();

    return useInfiniteQuery({
        queryKey: ['notifications', filters],
        queryFn: ({ pageParam = 1 }: { pageParam: number }) =>
            notificationApi.getNotifications({
                page: pageParam,
                limit: 10,
                ...filters,
            }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            return lastPage.hasNext ? lastPage.page + 1 : undefined;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useMarkAsRead = () => {
    const queryClient = useQueryClient();
    const notificationApi = useNotificationApi();

    return useMutation({
        mutationFn: (notificationIds: number[]) =>
            notificationApi.markAsRead(notificationIds),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['unread-count'] });
        },
    });
};

export const useMarkAllAsRead = () => {
    const queryClient = useQueryClient();
    const notificationApi = useNotificationApi();

    return useMutation({
        mutationFn: () => {
            // Get all unread notification IDs and mark them as read
            const notifications = queryClient.getQueryData<InfiniteData<NotificationsResponse>>(['notifications']);
            const unreadIds: number[] = [];

            notifications?.pages?.forEach(page => {
                page.data.forEach(notification => {
                    if (!notification.isRead) {
                        unreadIds.push(notification.id);
                    }
                });
            });

            return notificationApi.markAsRead(unreadIds);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['unread-count'] });
        },
    });
};

export const useDeleteNotification = () => {
    const queryClient = useQueryClient();
    const notificationApi = useNotificationApi();

    return useMutation({
        mutationFn: (notificationIds: number[]) =>
            notificationApi.deleteNotifications(notificationIds),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['unread-count'] });
        },
    });
};

export const useUnreadCount = () => {
    const notificationApi = useNotificationApi();

    return useQuery({
        queryKey: ['unread-count'],
        queryFn: async () => {
            const response = await notificationApi.getNotifications({ page: 1, limit: 1 });
            return response.total; // You might want to adjust this based on your API
        },
    });
};