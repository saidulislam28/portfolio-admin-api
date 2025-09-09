import { Appointment } from "@/utility/appointment";
import React, { useCallback } from "react";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import AppointmentCard from "./AppointmentCard";
const LiveAppointments: React.FC<{
  liveAppointments: Appointment[];
  onAppointmentPress: (appointment: Appointment) => void;
}> = React.memo(({ liveAppointments, onAppointmentPress }) => {
  const renderLiveAppointment = useCallback(({ item }: { item: Appointment }) => (
    <AppointmentCard appointment={item} onPress={onAppointmentPress} />
  ), [onAppointmentPress]);

  if (liveAppointments?.length === 0) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>

      <View style={styles.liveSection}>
        <Text style={styles.liveSectionTitle}>🔴 Live Appointments</Text>
        <FlatList
          data={liveAppointments}
          renderItem={renderLiveAppointment}
          keyExtractor={(item) => `live-${item.id}`}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  liveSection: {
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  liveSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#DC3545',
    marginBottom: 12,
  },

});

export default LiveAppointments;