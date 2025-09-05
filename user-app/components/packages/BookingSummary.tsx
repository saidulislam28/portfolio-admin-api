import { BLACK, DARK_GRAY, LIGHT_GRAY, PRIMARY_COLOR, WHITE } from '@/lib/constants';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function BookingSummary({ packageData, selectedSlots }) {
  const formatSlotDisplay = (slotData) => {
    const date = new Date(slotData.date);
    const dateStr = date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
    return `${dateStr} at ${slotData.slot.time}`;
  };

  const renderPackageDetails = () => {
    if (packageData.type === 'custom' && packageData.customData) {
      return (
        <View style={styles.customDetails}>
          <Text style={styles.customText}>
            {packageData.customData.mockTests} Mock Test{packageData.customData.mockTests > 1 ? 's' : ''}
          </Text>
          {packageData.customData.partnerConversations > 0 && (
            <Text style={styles.customText}>
              {packageData.customData.partnerConversations} Partner Conversation{packageData.customData.partnerConversations > 1 ? 's' : ''}
            </Text>
          )}
        </View>
      );
    }
    
    return (
      <Text style={styles.packageDescription}>
        {packageData.sessions} session{packageData.sessions > 1 ? 's' : ''}
      </Text>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Booking Summary</Text>
      
      <View style={styles.summaryCard}>
        <View style={styles.packageInfo}>
          <Text style={styles.packageName}>{packageData.name}</Text>
          {renderPackageDetails()}
          <Text style={styles.packagePrice}>Tk. {packageData.price}</Text>
        </View>

        {selectedSlots.length > 0 && (
          <View style={styles.selectedSlotsSection}>
            <Text style={styles.selectedSlotsTitle}>
              Selected Time Slots ({selectedSlots.length}/{packageData.sessions}):
            </Text>
            <ScrollView 
              style={styles.slotsList}
              showsVerticalScrollIndicator={false}
            >
              {selectedSlots.map((slotData, index) => (
                <View key={slotData.key} style={styles.selectedSlot}>
                  <Text style={styles.slotNumber}>{index + 1}.</Text>
                  <Text style={styles.slotDetails}>
                    {formatSlotDisplay(slotData)}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {selectedSlots.length < packageData.sessions && (
          <View style={styles.remainingSlots}>
            <Text style={styles.remainingText}>
              Please select {packageData.sessions - selectedSlots.length} more time slot{packageData.sessions - selectedSlots.length > 1 ? 's' : ''}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: BLACK,
    marginBottom: 15,
  },
  summaryCard: {
    backgroundColor: WHITE,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: LIGHT_GRAY,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  packageInfo: {
    borderBottomWidth: 1,
    borderBottomColor: LIGHT_GRAY,
    paddingBottom: 16,
    marginBottom: 16,
  },
  packageName: {
    fontSize: 18,
    fontWeight: '600',
    color: PRIMARY_COLOR,
    marginBottom: 8,
    lineHeight: 24,
  },
  packageDescription: {
    fontSize: 14,
    color: DARK_GRAY,
    marginBottom: 8,
  },
  customDetails: {
    marginBottom: 8,
  },
  customText: {
    fontSize: 14,
    color: DARK_GRAY,
    marginBottom: 4,
  },
  packagePrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
  },
  selectedSlotsSection: {
    marginBottom: 12,
  },
  selectedSlotsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  slotsList: {
    maxHeight: 120,
  },
  selectedSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9ff',
    borderRadius: 6,
    marginBottom: 6,
    borderLeftWidth: 3,
    borderLeftColor: PRIMARY_COLOR,
  },
  slotNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: PRIMARY_COLOR,
    marginRight: 8,
    minWidth: 20,
  },
  slotDetails: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  remainingSlots: {
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  remainingText: {
    fontSize: 14,
    color: '#856404',
    textAlign: 'center',
    fontWeight: '500',
  },
});