import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PRIMARY_COLOR } from '@/lib/constants';

export interface StatusCardProps {
  status: string;
  onStatusChange: () => void;
  isTablet: boolean;
  fontSizeSmall: number;
  cardPadding: number;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => string;
}

const StatusCard: React.FC<StatusCardProps> = ({
  status,
  onStatusChange,
  isTablet,
  fontSizeSmall,
  cardPadding,
  getStatusColor,
  getStatusIcon,
}) => {
  return (
    <View style={[styles.statusCard, { padding: cardPadding }]}>
      <View style={styles.statusHeader}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(status) },
          ]}
        >
          <Ionicons
            name={getStatusIcon(status)}
            size={isTablet ? 20 : 16}
            color="white"
          />
          <Text style={styles.statusText}>{status}</Text>
        </View>
        <TouchableOpacity
          onPress={onStatusChange}
          style={[styles.statusButton, { backgroundColor: PRIMARY_COLOR }]}
          activeOpacity={0.7}
        >
          <Text style={styles.changeStatusText}>Change Status</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  statusButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 120,
    alignItems: 'center',
  },
  changeStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
});

export default StatusCard;