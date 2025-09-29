// hooks/useNotifications.ts
import { Delete, Get, Patch } from '@sm/common';
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

interface NotificationsResponse {
    data: Notification[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
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

            const response = await Get(`/user-notifications?${params}`);
            return response;
        },
        getNextPageParam: (lastPage) => {
            // Add null check
            if (!lastPage) return undefined;
            return lastPage.hasNext ? lastPage.page + 1 : undefined;
        },
        initialPageParam: 1, // This should be at the root level
        staleTime: 5 * 60 * 1000,
    });
};

export const useMarkAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (notificationIds: number[]) =>
            Patch('/user-notifications/mark-as-read', { notificationIds }),
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
            // Get all unread notification IDs from all pages
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

            return Patch('/user-notifications/mark-as-read', { notificationIds: unreadIds });
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
            // For multiple IDs, join them with commas
            const idsString = notificationIds.join(',');
            return Delete(`/user-notifications/${idsString}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });
};

// Calculate unread count from cached data
export const useUnreadCount = () => {
    const queryClient = useQueryClient();

    const notificationsData = queryClient.getQueryData<{
        pages: NotificationsResponse[];
    }>(['notifications']);

    if (!notificationsData?.pages) return 0;

    return notificationsData.pages.reduce((count, page) => {
        return count + page.data.filter((notification: Notification) => !notification.isRead).length;
    }, 0);
};