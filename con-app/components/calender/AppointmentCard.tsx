import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { convertUtcToTimezoneFormat } from '@/utils/dateTime';
import { getUserDeviceTimezone } from '@/utils/userTimezone';
import { PRIMARY_COLOR } from '@/lib/constants';

export interface Appointment {
  id: string;
  client: string;
  status: string;
  type: string;
  start_at: string;
}

interface AppointmentCardProps {
  item: Appointment;
  onPress: (item: Appointment) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'CONFIRMED':
      return '#4ECD88';
    case 'PENDING':
      return '#FFD93D';
    case 'CANCELLED':
      return '#FF6B6B';
    default:
      return '#95E1D3';
  }
};

const AppointmentCard: React.FC<AppointmentCardProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(item)}
      style={styles.appointmentCard}
    >
      <View style={styles.appointmentTime}>
        <Text style={styles.timeText}>
          {convertUtcToTimezoneFormat(item.start_at, getUserDeviceTimezone())}
        </Text>
        <Text style={styles.durationText}>#{item.id}</Text>
      </View>
      <View style={styles.appointmentDetails}>
        <Text style={styles.clientName}>{item.client}</Text>
        <Text style={[styles.appointmentType, { color: getStatusColor(item?.status) }]}>
          {item.status}
        </Text>
      </View>
      <View
        style={[
          styles.statusBadge,
          { backgroundColor: PRIMARY_COLOR },
        ]}
      >
        <Text style={styles.statusText}>
          {item?.type === "conversation" ? "Conversation" : "Mock Test"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  appointmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  appointmentTime: {
    width: 80,
    alignItems: 'flex-start',
  },
  timeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A202C',
  },
  durationText: {
    fontSize: 12,
    color: '#718096',
    marginTop: 2,
  },
  appointmentDetails: {
    flex: 1,
    paddingLeft: 16,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A202C',
  },
  appointmentType: {
    fontSize: 14,
    color: '#4A5568',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 80,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});

export default AppointmentCard;