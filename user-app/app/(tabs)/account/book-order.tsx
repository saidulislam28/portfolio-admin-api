import CommonHeader from '@/components/CommonHeader';
import { useOrders } from '@/hooks/queries/useOrder';
import React from 'react';
import { 
    StyleSheet, 
    View, 
    Text, 
    FlatList, 
    TouchableOpacity,
    ActivityIndicator 
} from 'react-native';

const BookOrder = () => {
    const { data: ordersData = [], isLoading, error, refetch } = useOrders();
    const orders = ordersData?.filter((section: any) => section?.title === "Book Purchase");

    console.log("book purchase", orders[0]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return '#10B981';
            case 'pending':
                return '#F59E0B';
            case 'cancelled':
                return '#EF4444';
            default:
                return '#6B7280';
        }
    };

    const getPaymentStatusColor = (paymentStatus) => {
        switch (paymentStatus?.toLowerCase()) {
            case 'paid':
                return '#10B981';
            case 'unpaid':
                return '#EF4444';
            case 'pending':
                return '#F59E0B';
            default:
                return '#6B7280';
        }
    };

    const renderOrderCard = ({ item }) => (
        <TouchableOpacity style={styles.card} activeOpacity={0.7}>
            {/* Header */}
            <View style={styles.cardHeader}>
                <Text style={styles.orderTitle}>Book Order</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.statusText}>{item.status}</Text>
                </View>
            </View>

            {/* Order Info */}
            <View style={styles.orderInfo}>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Order ID:</Text>
                    <Text style={styles.infoValue}>#{item.id}</Text>
                </View>
                
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Date:</Text>
                    <Text style={styles.infoValue}>{formatDate(item.created_at)}</Text>
                </View>
                
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Customer:</Text>
                    <Text style={styles.infoValue}>{item.first_name} {item.last_name}</Text>
                </View>
            </View>

            {/* Books */}
            <View style={styles.booksSection}>
                <Text style={styles.booksSectionTitle}>Books ({item.items?.length})</Text>
                {item.items?.map((bookItem, index) => (
                    <View key={index} style={styles.bookItem}>
                        <Text style={styles.bookTitle} numberOfLines={2}>
                            {bookItem.book.title}
                        </Text>
                        <View style={styles.bookDetails}>
                            <Text style={styles.bookCategory}>{bookItem.book.category}</Text>
                            <Text style={styles.bookPrice}>৳{bookItem.subtotal}</Text>
                        </View>
                    </View>
                ))}
            </View>

            {/* Footer */}
            <View style={styles.cardFooter}>
                <View style={styles.totalSection}>
                    <Text style={styles.totalLabel}>Total Amount</Text>
                    <Text style={styles.totalAmount}>৳{item.total}</Text>
                </View>
                
                <View style={[
                    styles.paymentBadge, 
                    { backgroundColor: getPaymentStatusColor(item.payment_status) }
                ]}>
                    <Text style={styles.paymentText}>
                        {item.payment_status?.charAt(0).toUpperCase() + item.payment_status?.slice(1)}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    if (isLoading) {
        return (
            <View style={styles.container}>
                <CommonHeader />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#3B82F6" />
                    <Text style={styles.loadingText}>Loading orders...</Text>
                </View>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <CommonHeader />
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Error loading orders</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={refetch}>
                        <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CommonHeader />
            
            {orders?.[0]?.data?.length > 0 ? (
                <FlatList
                    data={orders[0].data}
                    renderItem={renderOrderCard}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No book orders found</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    listContainer: {
        padding: 16,
        paddingBottom: 32,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    orderTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '500',
    },
    orderInfo: {
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    infoLabel: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    infoValue: {
        fontSize: 14,
        color: '#1F2937',
        fontWeight: '600',
    },
    booksSection: {
        marginBottom: 16,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    booksSectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 8,
    },
    bookItem: {
        marginBottom: 12,
    },
    bookTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1F2937',
        marginBottom: 4,
        lineHeight: 20,
    },
    bookDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bookCategory: {
        fontSize: 12,
        color: '#6B7280',
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    bookPrice: {
        fontSize: 14,
        fontWeight: '600',
        color: '#059669',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    totalSection: {
        flex: 1,
    },
    totalLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 2,
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    paymentBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    paymentText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#6B7280',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: '#EF4444',
        marginBottom: 16,
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: '#3B82F6',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
    },
});

export default BookOrder;