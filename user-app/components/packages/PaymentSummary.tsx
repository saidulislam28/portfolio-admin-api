import { BLACK, DARK_GRAY, LIGHT_GRAY, PRIMARY_COLOR, WHITE } from '@/lib/constants';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

export default function PaymentSummary({ packageData, selectedSlots, totals }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  const getPackageIcon = (packageType) => {
    switch (packageType) {
      case 'single':
        return '🎯';
      case 'triple':
        return '🚀';
      case 'five':
        return '⭐';
      case 'custom':
        return '🎨';
      default:
        return '📝';
    }
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Payment Summary</Text> */}
      
      {/* Package Information */}
      <View style={styles.section}>
        <View style={styles.packageHeader}>
          <Text style={styles.packageIcon}>{getPackageIcon(packageData.type)}</Text>
          <View style={styles.packageInfo}>
            <Text style={styles.packageName}>{packageData.name}</Text>
            <Text style={styles.packageDetails}>
              {packageData.sessions} session{packageData.sessions > 1 ? 's' : ''} • 20 min each
            </Text>
          </View>
        </View>
      </View>

      {/* Selected Slots */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Scheduled Sessions</Text>
        <ScrollView 
          style={styles.slotsContainer} 
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          {selectedSlots.map((slot, index) => (
            <View key={index} style={styles.slotCard}>
              <View style={styles.slotHeader}>
                <Text style={styles.sessionNumber}>Session {index + 1}</Text>
                <View style={styles.durationBadge}>
                  <Text style={styles.durationText}>20 min</Text>
                </View>
              </View>
              <View style={styles.slotDetails}>
                <View style={styles.slotInfo}>
                  <Text style={styles.slotIcon}>📅</Text>
                  <Text style={styles.slotDate}>{formatDate(slot.date)}</Text>
                </View>
                <View style={styles.slotInfo}>
                  <Text style={styles.slotIcon}>⏰</Text>
                  <Text style={styles.slotTime}>{formatTime(slot.slot.time)}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Custom Package Details (if applicable) */}
      {packageData.customData && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Custom Package Details</Text>
          <View style={styles.customDetails}>
            {packageData.customData.mockTests > 0 && (
              <View style={styles.customItem}>
                <Text style={styles.customIcon}>🎯</Text>
                <Text style={styles.customText}>
                  {packageData.customData.mockTests} Mock Test{packageData.customData.mockTests > 1 ? 's' : ''}
                </Text>
              </View>
            )}
            {packageData.customData.partnerConversations > 0 && (
              <View style={styles.customItem}>
                <Text style={styles.customIcon}>💬</Text>
                <Text style={styles.customText}>
                  {packageData.customData.partnerConversations} Partner Conversation{packageData.customData.partnerConversations > 1 ? 's' : ''}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Price Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Price Breakdown</Text>
        <View style={styles.priceBreakdown}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Subtotal</Text>
            <Text style={styles.priceValue}>৳{totals.subtotal.toLocaleString()}</Text>
          </View>
          
          {totals.processingFee > 0 && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Processing Fee (2.5%)</Text>
              <Text style={styles.priceValue}>৳{totals.processingFee.toLocaleString()}</Text>
            </View>
          )}
          
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Tax (5%)</Text>
            <Text style={styles.priceValue}>৳{totals.tax.toLocaleString()}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>৳{totals.total.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      {/* Additional Information */}
      <View style={styles.infoSection}>
        <View style={styles.infoItem}>
          <Text style={styles.infoIcon}>💳</Text>
          <Text style={styles.infoText}>Secure payment processing</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoIcon}>🔒</Text>
          <Text style={styles.infoText}>256-bit SSL encryption</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoIcon}>✅</Text>
          <Text style={styles.infoText}>Instant booking confirmation</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: WHITE,
    // margin: 20,
    // borderRadius: 12,
    padding: 20,
    // elevation: 3,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 3.84,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: DARK_GRAY,
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  packageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: PRIMARY_COLOR,
  },
  packageIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  packageInfo: {
    flex: 1,
  },
  packageName: {
    fontSize: 16,
    fontWeight: '600',
    color: DARK_GRAY,
    marginBottom: 4,
  },
  packageDetails: {
    fontSize: 14,
    color: LIGHT_GRAY,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: DARK_GRAY,
    marginBottom: 12,
  },
  slotsContainer: {
    maxHeight: 200,
  },
  slotCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  slotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sessionNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: PRIMARY_COLOR,
  },
  durationBadge: {
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  durationText: {
    fontSize: 10,
    color: WHITE,
    fontWeight: '500',
  },
  slotDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  slotInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  slotIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  slotDate: {
    fontSize: 13,
    color: DARK_GRAY,
    fontWeight: '500',
  },
  slotTime: {
    fontSize: 13,
    color: BLACK,
    fontWeight: '500',
  },
  customDetails: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
  },
  customItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  customIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  customText: {
    fontSize: 14,
    color: DARK_GRAY,
  },
  priceBreakdown: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  priceLabel: {
    fontSize: 14,
    color: DARK_GRAY,
  },
  priceValue: {
    fontSize: 14,
    color: DARK_GRAY,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: LIGHT_GRAY,
    marginVertical: 10,
  },
  totalRow: {
    paddingTop: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: DARK_GRAY,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
  },
  infoSection: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: LIGHT_GRAY,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  infoText: {
    fontSize: 12,
    color: BLACK,
  },
});