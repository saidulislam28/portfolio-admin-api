// app/orders/[id].tsx
import CommonHeader from '@/components/CommonHeader';
import { PRIMARY_COLOR } from '@/lib/constants';
// import { GetOne } from '@/services/api/api';
import { BOOK_ORDER } from '@/services/api/endpoints';
import { API_USER, GetOne } from '@sm/common';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const OrderDetailsPage = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [detailsOrder, setDetailsOrder] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const book = await GetOne(API_USER.book_order, Number(id));
                console.log("book details", book?.data);
                if (book.success) {
                    setDetailsOrder(book.data);
                }
            } catch (err) {
                console.error("Failed to fetch book order", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, [id]);

    if (loading) {
        return (
            <View style={{}}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (!detailsOrder) {
        return (
            <View style={{}}>
                <Text>Order not found.</Text>
            </View>
        );
    }


    // In a real app, you would fetch the order details based on the ID
    const order: any = detailsOrder;
    const paymentData = order?.Payment[0] ?? {};
    const orderDate = new Date(order?.date)?.toLocaleDateString();
    const paidDate = new Date(paymentData?.paid_at)?.toLocaleDateString() ?? "N/A";


    console.log("Payment data", order?.Payment[0])

    return (
        <View style={styles.container}>
            <CommonHeader />

            <ScrollView style={styles.scrollContent}>
                <Stack.Screen options={{ title: 'Book Store' }} />
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Order Details</Text>
                    <Text style={styles.orderId}>Order # {id}</Text>
                </View>

                <View style={styles.statusContainer}>
                    <View style={styles.statusItem}>
                        <Text style={styles.statusLabel}>Order Status</Text>
                        <Text style={[
                            styles.statusValue,
                            order?.status === 'Approved' ? styles.statusApproved :
                                order?.status === 'Pending' ? styles.statusPending :
                                    styles.statusCanceled
                        ]}>
                            {order?.status}
                        </Text>
                    </View>
                    <View style={styles.statusItem}>
                        <Text style={styles.statusLabel}>Payment Status</Text>
                        <Text style={[
                            styles.statusValue,
                            order?.payment_status === 'paid' ? styles.paymentPaid : styles.paymentUnpaid
                        ]}>
                            {order?.payment_status}
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Order Summary</Text>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Order Date</Text>
                        <Text style={styles.summaryValue}>{orderDate}</Text>
                    </View>
                    {order?.payment_status === 'paid' && (
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryLabel}>Paid On</Text>
                            <Text style={styles.summaryValue}>{paidDate}</Text>
                        </View>
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Books ({order?.OrderItem?.length})</Text>
                    {order?.OrderItem?.map((book: any) => (
                        <View key={book.id} style={styles.bookItem}>
                            <Image source={{ uri: book?.Book?.image }} style={styles.bookImage} />
                            <View style={styles.bookInfo}>
                                <Text style={styles.bookTitle}>{book?.Book?.title}</Text>
                                <Text style={styles.bookAuthor}>{book?.author}</Text>
                                <Text style={styles.bookPrice}>BDT {book?.price?.toFixed(2)} × {book.qty}</Text>
                            </View>
                            <Text style={styles.bookSubtotal}>BDT {book?.subtotal?.toFixed(2)}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Payment Information</Text>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Payment Method</Text>
                        <Text style={styles.summaryValue}>{paymentData?.method ?? "SSLEcommerz"}</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Transaction ID</Text>
                        <Text style={styles.summaryValue}>{paymentData?.transaction_id}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Order Total</Text>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Subtotal</Text>
                        <Text style={styles.summaryValue}>BDT {order?.subtotal?.toFixed(2)}</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Delivery Charge</Text>
                        <Text style={styles.summaryValue}>BDT {order?.delivery_charge?.toFixed(2)}</Text>
                    </View>
                    <View style={[styles.summaryItem, styles.totalItem]}>
                        <Text style={[styles.summaryLabel, styles.totalLabel]}>Total</Text>
                        <Text style={[styles.summaryValue, styles.totalValue]}>BDT {order?.total?.toFixed(2)}</Text>
                    </View>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.invoiceButton}
                    //   onPress={() => router.push(`/orders/BDT{id}`)}
                    >
                        <Text style={styles.invoiceButtonText}>View Invoice</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 150,
    },
    stickyButtonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 30, // Account for safe area
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        elevation: 8, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    backButton: {
        color: PRIMARY_COLOR,
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 20,
        marginTop: 15,
        marginBottom: 8,
    },
    header: {
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    orderId: {
        fontSize: 16,
        color: '#666',
    },
    statusContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statusItem: {
        flex: 1,
    },
    statusLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    statusValue: {
        fontSize: 16,
        fontWeight: '600',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        alignSelf: 'flex-start',
    },
    statusApproved: {
        backgroundColor: '#e6f7ee',
        color: '#10b981',
    },
    statusPending: {
        backgroundColor: '#fff3e6',
        color: '#f59e0b',
    },
    statusCanceled: {
        backgroundColor: '#fee2e2',
        color: '#ef4444',
    },
    paymentPaid: {
        backgroundColor: '#e6f7ee',
        color: '#10b981',
    },
    paymentUnpaid: {
        backgroundColor: '#fee2e2',
        color: '#ef4444',
    },
    section: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    summaryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#666',
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        maxWidth: 150

    },
    totalItem: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '600',
    },
    totalValue: {
        fontSize: 16,
        fontWeight: '600',
        color: PRIMARY_COLOR,
    },
    bookItem: {
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'center',
    },
    bookImage: {
        width: 60,
        height: 80,
        borderRadius: 4,
        marginRight: 12,
    },
    bookInfo: {
        flex: 1,
    },
    bookTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 2,
    },
    bookAuthor: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    bookPrice: {
        fontSize: 14,
        color: '#666',
    },
    bookSubtotal: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    buttonContainer: {
        marginBottom: 20,
    },
    invoiceButton: {
        backgroundColor: PRIMARY_COLOR,
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
    },
    invoiceButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default OrderDetailsPage;