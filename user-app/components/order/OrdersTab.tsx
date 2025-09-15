// components/OrdersTab.tsx
import React from 'react';
import { FlatList, View, Text, StyleSheet, RefreshControl } from 'react-native';
import { OrderItem } from './OrderItem';
import { SectionData } from '@/types/group-order';

interface OrdersTabProps {
  section: SectionData;
  refreshing: boolean;
  onRefresh: () => void;
}

export const OrdersTab: React.FC<OrdersTabProps> = ({ 
  section, 
  refreshing, 
  onRefresh 
}) => {
  if (section.data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No orders found</Text>
        <Text style={styles.emptySubText}>
          You haven't placed any orders in this category yet.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={section.data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <OrderItem item={item} />}
      contentContainerStyle={styles.listContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
  },
  separator: {
    height: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    flex: 1,
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