import { API_CONSULTANT, Get, Patch, Post } from '@sm/common';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Notification {
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
}

export const useNotifications = (filters?: { type?: string; isRead?: boolean }) => {
    return useInfiniteQuery({
        queryKey: ['notifications', filters],
        queryFn: async ({ pageParam = 1 }) => {
            const params = new URLSearchParams({
                page: pageParam.toString(),
                limit: '10',
                ...(filters?.type && { type: filters.type }),
                ...(filters?.isRead !== undefined && { isRead: filters.isRead.toString() }),
            });

            const response = await Get(`${API_CONSULTANT.consultant_notification}?${params}`);
            return response;
        },
        getNextPageParam: (lastPage) => {
            if (!lastPage) return undefined;
            return lastPage.hasNext ? lastPage.page + 1 : undefined;
        },
        initialPageParam: 1,
        staleTime: 5 * 60 * 1000,
    });
};

export const useMarkAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (notificationIds: number[]) =>
            Patch(API_CONSULTANT.notification_mark_as_read, { notificationIds }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });
};

export const useMarkAllAsRead = () => {
    const queryClient = useQueryClient();
    const { data } = useNotifications();

    return useMutation({
        mutationFn: async () => {
            const unreadIds: number[] = [];

            data?.pages?.forEach(page => {
                page.data.forEach((notification: Notification) => {
                    if (!notification.isRead) {
                        unreadIds.push(notification.id);
                    }
                });
            });

            if (unreadIds.length === 0) {
                return { message: 'No unread notifications', count: 0 };
            }

            return Patch(API_CONSULTANT.notification_mark_as_read, { notificationIds: unreadIds });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });
};

export const useDeleteNotification = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (notificationIds: number[]) => {

            return Post(API_CONSULTANT.delete_notification, { notificationIds });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });
};

export const useUnreadCount = () => {
    const { data: notificationsData } = useNotifications();
    if (!notificationsData?.pages) return 0;
    return notificationsData.pages.reduce((count, page) => {
        return count + page.data.filter((notification: Notification) => !notification.isRead).length;
    }, 0);
};