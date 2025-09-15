import React, { useCallback, useMemo } from 'react';
import AppointmentCard from './AppointmentCard';
import { Appointment } from '@/utility/appointment';
import { RefreshControl, StyleSheet, Text } from 'react-native';
import { View } from 'react-native';
import { FlatList } from 'react-native';
interface AppointmentListProps {
  appointments: Appointment[];
  onAppointmentPress: (appointment: Appointment) => void;
  onRefresh: () => void;
  refreshing: boolean;
  emptyMessage: string;
}
const AppointmentList: React.FC<AppointmentListProps> = React.memo(
  ({
    appointments,
    onAppointmentPress,
    onRefresh,
    refreshing,
    emptyMessage,
  }) => {
    const renderAppointment = useCallback(
      ({ item }: { item: Appointment }) => (
        <AppointmentCard appointment={item} onPress={onAppointmentPress} />
      ),
      [onAppointmentPress]
    );

    const keyExtractor = useCallback(
      (item: Appointment) => item.id.toString(),
      []
    );

    const refreshControl = useMemo(
      () => <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />,
      [refreshing, onRefresh]
    );

    if (appointments.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{emptyMessage}</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={appointments}
        renderItem={renderAppointment}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        refreshControl={refreshControl}
        contentContainerStyle={styles.listContainer}
      />
    );
  }
);

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default AppointmentList;
