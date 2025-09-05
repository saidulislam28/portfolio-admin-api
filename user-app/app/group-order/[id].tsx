import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { Order } from '@/types/group-order';
import { useLocalSearchParams } from 'expo-router';
import CommonHeader from '@/components/CommonHeader';
import { displayPrice } from '@/utility/price';

type RootStackParamList = {
    Orders: undefined;
    OrderDetails: { order: Order };
};

// type OrderDetailsScreenRouteProp = RouteProp<RootStackParamList, 'OrderDetails'>;
// type OrderDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'OrderDetails'>;

interface Props {
    // route: OrderDetailsScreenRouteProp;
    //   navigation: OrderDetailsScreenNavigationProp;
}

const OrderDetailsScreen: React.FC<Props> = ({ }) => {
    const params = useLocalSearchParams();

    const { order: orderString } = params;

    // Parse the string back to object
    const order: Order = orderString ? JSON.parse(orderString as string) : null;

    if (!order) {
        return (
            <View style={styles.container}>
                <Text>Order not found</Text>
            </View>
        );
    }

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusColor = (status: string): string => {
        switch (status?.toLowerCase()) {
            case 'paid':
                return '#4CAF50';
            case 'pending':
                return '#FF9800';
            case 'unpaid':
                return '#F44336';
            default:
                return '#9E9E9E';
        }
    };

    const formatServiceType = (serviceType: string): string => {
        return serviceType?.split('_')
            .map(word => word?.charAt(0)?.toUpperCase() + word?.slice(1))
            .join(' ');
    };

    return (
        <ScrollView style={styles.container}>
            <CommonHeader />
        
            <View style={styles.card}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Order Information</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Order ID:</Text>
                        <Text style={styles.infoValue}>#{order?.id}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Service Type:</Text>
                        <Text style={styles.infoValue}>{formatServiceType(order?.service_type)}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Order Date:</Text>
                        <Text style={styles.infoValue}>{formatDate(order?.created_at)}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Status:</Text>
                        <View
                            style={[
                                styles.statusBadge,
                                { backgroundColor: getStatusColor(order?.status) + '20' },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.statusText,
                                    { color: getStatusColor(order?.status) },
                                ]}
                            >
                                {order?.status?.toUpperCase()}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Payment Status:</Text>
                        <View
                            style={[
                                styles.statusBadge,
                                { backgroundColor: getStatusColor(order?.payment_status) + '20' },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.statusText,
                                    { color: getStatusColor(order?.payment_status) },
                                ]}
                            >
                                {order?.payment_status?.toUpperCase()}
                            </Text>
                        </View>
                    </View>
                </View>

                {order?.package && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Package Details</Text>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Package:</Text>
                            <Text style={styles.infoValue}>{order?.package?.name}</Text>
                        </View>
                        {order.package.class_count && (
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Classes:</Text>
                                <Text style={styles.infoValue}>{order?.package?.class_count}</Text>
                            </View>
                        )}
                        {order.package.sessions_count && (
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Sessions:</Text>
                                <Text style={styles.infoValue}>{order?.package?.sessions_count}</Text>
                            </View>
                        )}
                    </View>
                )}

                {order?.items?.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Items ({order?.items?.length})</Text>
                        {order?.items?.map((item, index) => (
                            <View key={item.id} style={styles.itemCard}>
                                {item.book && (
                                    <>
                                        <Text style={styles.itemTitle}>{item?.book?.title}</Text>
                                        <Text style={styles.itemAuthor}>by {item?.book?.writer}</Text>
                                        <Text style={styles.itemCategory}>{item?.book?.category}</Text>
                                        <Text style={styles.itemIsbn}>ISBN: {item?.book?.isbn}</Text>
                                    </>
                                )}
                                <View style={styles.itemFooter}>
                                    <Text style={styles.itemQuantity}>Qty: {item?.qty}</Text>
                                    <Text style={styles.itemPrice}>
                                        {displayPrice(item?.unit_price)} × {item?.qty} = {displayPrice(item?.subtotal)}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Customer Information</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Name:</Text>
                        <Text style={styles.infoValue}>
                            {order?.first_name} {order?.last_name}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Email:</Text>
                        <Text style={styles.infoValue}>{order?.email}</Text>
                    </View>
                </View>

                <View style={styles.totalSection}>
                    <Text style={styles.totalLabel}>Total Amount:</Text>
                    <Text style={styles.totalAmount}>{displayPrice(order?.total)}</Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333333',
    },
    card: {
        margin: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
        paddingBottom: 8,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    infoLabel: {
        fontSize: 14,
        color: '#666666',
        fontWeight: '500',
    },
    infoValue: {
        fontSize: 14,
        color: '#333333',
        fontWeight: '600',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    itemCard: {
        backgroundColor: '#F8F9FA',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 4,
    },
    itemAuthor: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 2,
    },
    itemCategory: {
        fontSize: 12,
        color: '#999999',
        marginBottom: 2,
    },
    itemIsbn: {
        fontSize: 12,
        color: '#999999',
        marginBottom: 8,
    },
    itemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
        paddingTop: 8,
    },
    itemQuantity: {
        fontSize: 14,
        color: '#666666',
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: '600',
        color: '#007AFF',
    },
    totalSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 16,
        borderTopWidth: 2,
        borderTopColor: '#EEEEEE',
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
    },
    totalAmount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#007AFF',
    },
});

export default OrderDetailsScreen;