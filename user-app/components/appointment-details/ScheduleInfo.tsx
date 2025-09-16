import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { PRIMARY_COLOR } from '@/lib/constants';

interface ScheduleInfoProps {
  startAt: string;
  endAt: string;
  durationInMin: number;
  timeLeft: string;
}

const ScheduleInfo: React.FC<ScheduleInfoProps> = ({
  startAt,
  endAt,
  durationInMin,
  timeLeft
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <>
      <View style={styles.cardHeader}>
        <MaterialIcons name="schedule" size={20} color={PRIMARY_COLOR} />
        <Text style={styles.cardTitle}>Schedule</Text>
      </View>

      <View style={styles.scheduleInfo}>
        <View style={styles.scheduleRow}>
          <View style={styles.scheduleItem}>
            <Text style={styles.scheduleLabel}>Date</Text>
            <Text style={styles.scheduleValue}>
              {formatDate(startAt)}
            </Text>
          </View>
        </View>

        <View style={styles.scheduleRow}>
          <View style={styles.scheduleItem}>
            <Text style={styles.scheduleLabel}>Start Time</Text>
            <Text style={styles.scheduleValue}>
              {formatTime(startAt)}
            </Text>
          </View>
          <View style={styles.scheduleItem}>
            <Text style={styles.scheduleLabel}>End Time</Text>
            <Text style={styles.scheduleValue}>
              {formatTime(endAt)}
            </Text>
          </View>
        </View>

        <View style={styles.scheduleRow}>
          <View style={styles.scheduleItem}>
            <Text style={styles.scheduleLabel}>Duration</Text>
            <Text style={styles.scheduleValue}>
              {durationInMin} minutes
            </Text>
          </View>
          <View style={styles.scheduleItem}>
            <Text style={styles.scheduleLabel}>Starts in:</Text>
            <Text style={styles.scheduleValue}>{timeLeft}</Text>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  scheduleInfo: {
    gap: 12,
  },
  scheduleRow: {
    flexDirection: "row",
    gap: 16,
  },
  scheduleItem: {
    flex: 1,
  },
  scheduleLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  scheduleValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1F2937",
  },
});

export default ScheduleInfo;