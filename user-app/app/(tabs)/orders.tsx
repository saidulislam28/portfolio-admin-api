// screens/OrdersScreen.tsx
import { LoadingIndicator } from '@/components/order/LoadingIndicator';
import { OrdersTab } from '@/components/order/OrdersTab';
import { useOrders } from '@/hooks/queries/useOrder';
import { PRIMARY_COLOR } from '@/lib/constants';
import { PACKAGE_SERVICE_TYPE } from '@sm/common';
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import PagerView from 'react-native-pager-view';


const OrdersScreen = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const pagerRef = useRef<PagerView>(null);

  const { data: ordersData = [], isLoading, error, refetch } = useOrders();

  console.log("order data>>", ordersData);

  const orders = ordersData
    .filter((section: any) => section?.title !== "Book Purchase")
    .map((section: any) => ({
      ...section,
      title:
        section.title === "Ielts Academic"
          ? 'Online Course' // rename
          : section.title,
    }));

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleTabPress = (index: number) => {
    setCurrentTab(index);
    pagerRef.current?.setPage(index);
  };

  const handlePageSelected = (e: any) => {
    setCurrentTab(e.nativeEvent.position);
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load orders</Text>
        <TouchableOpacity onPress={() => refetch()} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Tabs Header */}
      <View style={styles.tabsContainer}>
        {orders.map((section, index) => (
          <TouchableOpacity
            key={section.title}
            style={[
              styles.tab,
              currentTab === index && styles.activeTab,
            ]}
            onPress={() => handleTabPress(index)}
          >
            <Text
              style={[
                styles.tabText,
                currentTab === index && styles.activeTabText,
              ]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {section.title} ({section.data.length})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Pager View */}
      <PagerView
        ref={pagerRef}
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={handlePageSelected}
      >
        {orders.map((section) => (
          <View key={section.title} style={styles.page}>
            <OrdersTab
              section={section}
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          </View>
        ))}
      </PagerView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 4,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    minWidth: 0, // Important for flexbox with text truncation
  },
  activeTab: {
    borderBottomColor: PRIMARY_COLOR,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666666',
    textAlign: 'center',
  },
  activeTabText: {
    color: PRIMARY_COLOR,
    fontWeight: '600',
  },
  pagerView: {
    flex: 1,
  },
  page: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#F44336',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default OrdersScreen;