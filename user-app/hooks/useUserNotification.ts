// hooks/useNotifications.ts
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NotificationsResponse, useNotificationApi } from './useNotificationApi';

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
        staleTime: 5 * 60 * 1000,
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
        },
    });
};

export const useMarkAllAsRead = () => {
    const queryClient = useQueryClient();
    const notificationApi = useNotificationApi();
    const { data } = useNotifications();

    return useMutation({
        mutationFn: async () => {
            // Get all unread notification IDs from all pages
            const unreadIds: number[] = [];

            data?.pages?.forEach(page => {
                page.data.forEach((notification: any) => {
                    if (!notification.isRead) {
                        unreadIds.push(notification.id);
                    }
                });
            });

            if (unreadIds.length === 0) {
                return { message: 'No unread notifications', count: 0 };
            }

            return notificationApi.markAsRead(unreadIds);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
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
        },
    });
};

// Calculate unread count from cached data
export const useUnreadCount = () => {
    const queryClient = useQueryClient();

    const notificationsData = queryClient.getQueryData<
        { pages: NotificationsResponse[] }
    >(['notifications']);

    if (!notificationsData?.pages) return 0;

    return notificationsData.pages.reduce((count, page) => {
        return count + page.data.filter((notification: any) => !notification.isRead).length;
    }, 0);
};