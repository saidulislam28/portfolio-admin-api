import { BLACK, DARK_GRAY, ERROR_COLOR, LIGHT_GRAY, SUCCESS_COLOR, WHITE } from '@/lib/constants';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TimeSlotGrid({ slots, selectedDate, onSlotSelect, getSlotStatus }) {
  const getSlotStyle = (status) => {
    switch (status) {
      case 'selected':
        return {
          backgroundColor: SUCCESS_COLOR,
          borderColor: SUCCESS_COLOR,
        };
      case 'booked':
        return {
          backgroundColor: ERROR_COLOR,
          borderColor: ERROR_COLOR,
        };
      case 'locking':
        return {
          backgroundColor: LIGHT_GRAY,
          borderColor: DARK_GRAY,
        };
      default:
        return {
          backgroundColor: WHITE,
          borderColor: SUCCESS_COLOR,
        };
    }
  };

  const getSlotTextStyle = (status) => {
    switch (status) {
      case 'selected':
      case 'booked':
        return { color: WHITE };
      case 'locking':
        return { color: DARK_GRAY };
      default:
        return { color: SUCCESS_COLOR };
    }
  };

  const isSlotDisabled = (status) => {
    return status === 'booked' || status === 'locking';
  };

  const renderSlotContent = (slot, status) => {
    if (status === 'locking') {
      return (
        <View style={styles.lockingContent}>
          <ActivityIndicator size="small" color={DARK_GRAY} />
          <Text style={[styles.slotText, getSlotTextStyle(status)]}>
            {slot.time}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.slotContent}>
        {status === 'selected' && (
          <Ionicons name="checkmark-circle-outline" size={18} color={WHITE} style={styles.checkIcon} />
        )}
        <Text style={[styles.slotText, getSlotTextStyle(status)]}>
          {slot.time}
        </Text>
      </View>
    );
  };

  if (!slots || slots.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Available Time Slots</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No available slots for this date</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Available Time Slots</Text>
      <Text style={styles.dateLabel}>
        {new Date(selectedDate).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </Text>

      <View style={styles.slotsGrid}>
        {slots.map((slot: any) => {
          const status = getSlotStatus(slot);
          const disabled = isSlotDisabled(status);

          return (
            <TouchableOpacity
              key={slot.id}
              style={[
                styles.slotButton,
                getSlotStyle(status),
                disabled && styles.disabledSlot
              ]}
              onPress={() => !disabled && onSlotSelect(slot)}
              disabled={disabled}
              activeOpacity={0.7}
            >
              {renderSlotContent(slot, status)}
            </TouchableOpacity>
          );
        })}
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
    marginBottom: 10,
  },
  dateLabel: {
    fontSize: 16,
    color: DARK_GRAY,
    marginBottom: 20,
    fontWeight: '500',
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  slotButton: {
    width: '48%',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
  },
  disabledSlot: {
    opacity: 0.6,
  },
  slotText: {
    fontSize: 14,
    fontWeight: '600',
  },
  slotContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: {
    marginRight: 8,
  },
  lockingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: DARK_GRAY,
    textAlign: 'center',
  },
});