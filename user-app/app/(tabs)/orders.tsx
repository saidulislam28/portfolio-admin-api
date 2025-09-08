import { ROUTES } from '@/constants/app.routes';
import { PACKAGE_SERVICE_TYPE } from '@/lib/constants';
import { Order, SectionData } from '@/types/group-order';
import { displayPrice } from '@/utility/price';
import { API_USER, Get } from '@sm/common';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const OrdersScreen = () => {
  const [orders, setOrders] = useState<SectionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchOrders = async () => {
    try {
      const response = await Get(API_USER.group_order);
      console.log("response group", response)
      if (!response?.data) {
        throw new Error('Failed to fetch orders');
      }

      const groupedData = transformData(response.data);
      setOrders(groupedData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load orders');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleNavigate = (item: any) => {
    router.push({
      pathname: ROUTES.GROUP_ORDER as any,
      params: { order: JSON.stringify(item), id: item?.id }
    })
  }

  const transformData = (data: { [key: string]: Order[] }): SectionData[] => {
    return Object.entries(data)
      // Filter out CONVERSATION and IELTS_ACADEMIC service types
      .filter(([serviceType]) =>
        serviceType !== PACKAGE_SERVICE_TYPE.conversation &&
        serviceType !== PACKAGE_SERVICE_TYPE.speaking_mock_test
      )
      .map(([serviceType, orders]) => ({
        title: formatServiceType(serviceType),
        data: orders,
      }));
  };

  const formatServiceType = (serviceType: string): string => {
    return serviceType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
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

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ... rest of the component remains the same
  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => handleNavigate(item)}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Order #{item.id}</Text>
        <Text style={styles.orderDate}>{formatDate(item.created_at)}</Text>
      </View>

      <View style={styles.orderBody}>
        <Text style={styles.packageName}>
          {item.package?.name || 'Custom Order'}
        </Text>

        {item.items.length > 0 && (
          <Text style={styles.itemsCount}>
            {item.items.length} item{item.items.length !== 1 ? 's' : ''}
          </Text>
        )}
      </View>

      <View style={styles.orderFooter}>
        <View style={styles.amountContainer}>
          <Text style={styles.totalAmount}>{displayPrice(item.total)}</Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.payment_status) + '20' },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: getStatusColor(item.payment_status) },
            ]}
          >
            {item.payment_status.toUpperCase()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section }: { section: SectionData }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <Text style={styles.sectionCount}>({section.data.length})</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading orders...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SectionList
        sections={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderOrderItem}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        SectionSeparatorComponent={() => <View style={styles.sectionSeparator} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No orders found</Text>
            <Text style={styles.emptySubText}>
              You haven't placed any orders yet.
            </Text>
          </View>
        }
      />
    </View>
  );
};

// ... styles remain the same
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  listContent: {
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginRight: 8,
  },
  sectionCount: {
    fontSize: 16,
    color: '#666666',
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  orderDate: {
    fontSize: 12,
    color: '#666666',
  },
  orderBody: {
    marginBottom: 12,
  },
  packageName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  itemsCount: {
    fontSize: 14,
    color: '#666666',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountContainer: {
    flex: 1,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
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
  separator: {
    height: 8,
  },
  sectionSeparator: {
    height: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
  },
});

export default OrdersScreen;