// screens/NotificationsScreen.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    RefreshControl,
} from 'react-native';
import { NotificationItem } from '@/components/notification/NotificationItem';
import { useDeleteNotification, useMarkAllAsRead, useNotifications } from '@/hooks/useUserNotification';

export const NotificationsScreen = () => {
    const [filter, setFilter] = useState<'all' | 'unread'>('all');
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
        refetch,
    } = useNotifications({
        isRead: filter === 'all' ? undefined : false,
    });

    const markAllAsReadMutation = useMarkAllAsRead();
    const deleteMutation = useDeleteNotification();

    const notifications = data?.pages.flatMap((page: any) => page.data) || [];
    const unreadCount = notifications.filter((n: any) => !n.isRead).length;

    const loadMore = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };

    const handleMarkAllAsRead = () => {
        if (unreadCount === 0) return;

        Alert.alert(
            'Mark All as Read',
            `Mark all ${unreadCount} unread notifications as read?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Mark All',
                    onPress: () => markAllAsReadMutation.mutate(),
                },
            ]
        );
    };

    const handleDeleteAllRead = () => {
        const readNotifications = notifications.filter((n: any) => n.isRead);
        if (readNotifications.length === 0) return;

        Alert.alert(
            'Delete All Read',
            `Delete all ${readNotifications.length} read notifications?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete All',
                    style: 'destructive',
                    onPress: () => {
                        const readIds = readNotifications.map((n: any) => n.id);
                        deleteMutation.mutate(readIds);
                    },
                },
            ]
        );
    };

    const renderFooter = () => {
        if (!isFetchingNextPage) return null;

        return (
            <View style={styles.footer}>
                <ActivityIndicator size="small" color="#007bff" />
            </View>
        );
    };

    const renderEmpty = () => (
        <View style={styles.empty}>
            <Text style={styles.emptyText}>
                No notifications found
            </Text>
        </View>
    );

    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#007bff" />
            </View>
        );
    }

    if (isError) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>
                    Failed to load notifications
                </Text>
                <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
                    <Text style={styles.retryText}>Try Again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Notifications</Text>
                    {unreadCount > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{unreadCount}</Text>
                        </View>
                    )}
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleMarkAllAsRead}
                        disabled={unreadCount === 0}
                    >
                        <Text style={[
                            styles.actionText,
                            unreadCount === 0 && styles.actionTextDisabled,
                        ]}>
                            Mark All Read
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleDeleteAllRead}
                    >
                        <Text style={styles.actionText}>
                            Delete Read
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Filter Tabs */}
            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, filter === 'all' && styles.tabActive]}
                    onPress={() => setFilter('all')}
                >
                    <Text style={[styles.tabText, filter === 'all' && styles.tabTextActive]}>
                        All
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tab, filter === 'unread' && styles.tabActive]}
                    onPress={() => setFilter('unread')}
                >
                    <Text style={[styles.tabText, filter === 'unread' && styles.tabTextActive]}>
                        Unread
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Notifications List */}
            <FlatList
                data={notifications}
                renderItem={({ item }) => <NotificationItem notification={item} />}
                keyExtractor={(item) => item.id.toString()}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={renderEmpty}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading}
                        onRefresh={refetch}
                        colors={['#007bff']}
                    />
                }
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    header: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#212529',
        marginRight: 8,
    },
    badge: {
        backgroundColor: '#dc3545',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
    },
    badgeText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        backgroundColor: '#f8f9fa',
    },
    actionText: {
        fontSize: 14,
        color: '#007bff',
        fontWeight: '500',
    },
    actionTextDisabled: {
        color: '#6c757d',
        opacity: 0.5,
    },
    tabs: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    tabActive: {
        borderBottomWidth: 2,
        borderBottomColor: '#007bff',
    },
    tabText: {
        fontSize: 16,
        color: '#6c757d',
        fontWeight: '500',
    },
    tabTextActive: {
        color: '#007bff',
    },
    listContent: {
        flexGrow: 1,
    },
    footer: {
        padding: 16,
        alignItems: 'center',
    },
    empty: {
        padding: 32,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#6c757d',
        textAlign: 'center',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 16,
        color: '#dc3545',
        marginBottom: 16,
        textAlign: 'center',
    },
    retryButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: '#007bff',
        borderRadius: 6,
    },
    retryText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '500',
    },
});