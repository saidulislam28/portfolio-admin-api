// components/NotificationItem.tsx
import { useDeleteNotification, useMarkAsRead } from '@/hooks/useUserNotification';
import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';

interface NotificationItemProps {
    notification: Notification;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification }: any) => {
    const markAsReadMutation = useMarkAsRead();
    const deleteMutation = useDeleteNotification();

    const handlePress = () => {
        if (!notification.isRead) {
            markAsReadMutation.mutate([notification.id]);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            'Delete Notification',
            'Are you sure you want to delete this notification?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => deleteMutation.mutate([notification.id]),
                },
            ]
        );
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else {
            return date.toLocaleDateString();
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.container,
                notification.isRead ? styles.read : styles.unread,
            ]}
            onPress={handlePress}
            onLongPress={handleDelete}
        >
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text
                        style={[
                            styles.title,
                            notification.isRead ? styles.titleRead : styles.titleUnread,
                        ]}
                        numberOfLines={1}
                    >
                        {notification.title}
                    </Text>
                    <Text style={styles.time}>
                        {formatDate(notification.created_at)}
                    </Text>
                </View>

                <Text
                    style={[
                        styles.message,
                        notification.isRead ? styles.messageRead : styles.messageUnread,
                    ]}
                    numberOfLines={2}
                >
                    {notification.message}
                </Text>

                <View style={styles.footer}>
                    <View style={[
                        styles.typeBadge,
                        // styles[`type${notification.type}`],
                    ]}>
                        <Text style={styles.typeText}>
                            {notification.type.replace('_', ' ').toLowerCase()}
                        </Text>
                    </View>

                    {!notification.isRead && (
                        <View style={styles.unreadIndicator} />
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    read: {
        backgroundColor: '#ffffff',
    },
    unread: {
        backgroundColor: '#f8f9fa',
    },
    content: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    title: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        marginRight: 8,
    },
    titleRead: {
        color: '#6c757d',
    },
    titleUnread: {
        color: '#212529',
    },
    time: {
        fontSize: 12,
        color: '#6c757d',
    },
    message: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 8,
    },
    messageRead: {
        color: '#6c757d',
    },
    messageUnread: {
        color: '#495057',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    typeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    typeGENERAL: {
        backgroundColor: '#e9ecef',
    },
    typeAPPOINTMENT_REMINDER: {
        backgroundColor: '#d1ecf1',
    },
    typePAYMENT_REMINDER: {
        backgroundColor: '#f8d7da',
    },
    typeText: {
        fontSize: 10,
        fontWeight: '500',
        textTransform: 'capitalize',
    },
    unreadIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#007bff',
    },
});