import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StatusBadgeProps {
  status: string;
  isLive?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, isLive = false }) => {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "#10B981";
      case "pending":
        return "#F59E0B";
      case "cancelled":
        return "#EF4444";
      case "completed":
        return "#8B5CF6";
      default:
        return "#6B7280";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "checkmark-circle";
      case "pending":
        return "time";
      case "cancelled":
        return "close-circle";
      case "completed":
        return "checkmark-done-circle";
      default:
        return "help-circle";
    }
  };

  return (
    <View
      style={[
        styles.statusBadge,
        { backgroundColor: getStatusColor(status) },
      ]}
    >
      <Ionicons
        name={getStatusIcon(status)}
        size={16}
        color="white"
      />
      <Text style={styles.statusText}>
        {isLive ? "Live" : status}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
});

export default StatusBadge;