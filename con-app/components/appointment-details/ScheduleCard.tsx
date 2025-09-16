import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { PRIMARY_COLOR } from '@/lib/constants';

export interface ScheduleCardProps {
  startAt: string;
  endAt: string;
  durationInMin: number;
  timeLeft: string;
  isTablet: boolean;
  fontSizeLarge: number;
  fontSizeMedium: number;
  fontSizeSmall: number;
  cardPadding: number;
  formatDate: (dateString: string) => string;
  formatTime: (dateString: string) => string;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({
  startAt,
  endAt,
  durationInMin,
  timeLeft,
  isTablet,
  fontSizeLarge,
  fontSizeMedium,
  fontSizeSmall,
  cardPadding,
  formatDate,
  formatTime,
}) => {
  return (
    <View style={[styles.card, { padding: cardPadding }]}>
      <View style={styles.cardHeader}>
        <MaterialIcons
          name="schedule"
          size={isTablet ? 28 : 20}
          color={PRIMARY_COLOR}
        />
        <Text
          style={[
            styles.cardTitle,
            { fontSize: isTablet ? fontSizeLarge : 16 },
          ]}
        >
          Schedule
        </Text>
      </View>

      <View style={styles.scheduleInfo}>
        <View style={styles.scheduleRow}>
          <View style={styles.scheduleItem}>
            <Text style={styles.scheduleLabel}>Date</Text>
            <Text
              style={[
                styles.scheduleValue,
                { fontSize: isTablet ? fontSizeMedium : 14 },
              ]}
            >
              {formatDate(startAt)}
            </Text>
          </View>
        </View>

        <View style={styles.scheduleRow}>
          <View style={styles.scheduleItem}>
            <Text style={styles.scheduleLabel}>Start Time</Text>
            <Text
              style={[
                styles.scheduleValue,
                { fontSize: isTablet ? fontSizeMedium : 14 },
              ]}
            >
              {formatTime(startAt)}
            </Text>
          </View>
          <View style={styles.scheduleItem}>
            <Text style={styles.scheduleLabel}>End Time</Text>
            <Text
              style={[
                styles.scheduleValue,
                { fontSize: isTablet ? fontSizeMedium : 14 },
              ]}
            >
              {formatTime(endAt)}
            </Text>
          </View>
        </View>

        <View style={styles.scheduleRow}>
          <View style={styles.scheduleItem}>
            <Text style={styles.scheduleLabel}>Duration</Text>
            <Text
              style={[
                styles.scheduleValue,
                { fontSize: isTablet ? fontSizeMedium : 14 },
              ]}
            >
              {durationInMin} minutes
            </Text>
          </View>
          <View style={styles.scheduleItem}>
            <Text style={styles.scheduleLabel}>Starts in:</Text>
            <Text
              style={[
                styles.scheduleValue,
                {
                  color: '#EF4444',
                  fontSize: isTablet ? fontSizeMedium : 14,
                },
              ]}
            >
              {timeLeft}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  cardTitle: {
    fontWeight: '600',
    color: '#1F2937',
  },
  scheduleInfo: {
    gap: 12,
  },
  scheduleRow: {
    flexDirection: 'row',
    gap: 16,
  },
  scheduleItem: {
    flex: 1,
  },
  scheduleLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  scheduleValue: {
    fontWeight: '500',
    color: '#1F2937',
  },
});

export default ScheduleCard;