// components/OrderItem.tsx
import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Order } from '@/types/group-order';
import { displayPrice } from '@sm/common';
import { useRouter } from 'expo-router';
import { ROUTES } from '@/constants/app.routes';

interface OrderItemProps {
  item: Order;
}

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

export const OrderItem: React.FC<OrderItemProps> = ({ item }) => {
  const router = useRouter();

  const handleNavigate = () => {
    router.push({
      pathname: ROUTES.GROUP_ORDER as any,
      params: { order: JSON.stringify(item), id: item?.id }
    });
  };

  return (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={handleNavigate}
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
};

const styles = StyleSheet.create({
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
});