import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Modal, 
  FlatList,
  StatusBar,
  SafeAreaView
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';

// Mock data for appointments
const appointmentsData: any = {
  '2025-08-25': [
    { id: '1', time: '09:00', duration: 60, client: 'John Smith', type: 'Consultation', status: 'confirmed' },
    { id: '2', time: '10:30', duration: 45, client: 'Sarah Johnson', type: 'Follow-up', status: 'confirmed' },
    { id: '3', time: '14:00', duration: 90, client: 'Mike Davis', type: 'Strategy Session', status: 'pending' },
    { id: '4', time: '16:00', duration: 30, client: 'Emma Wilson', type: 'Quick Check-in', status: 'confirmed' }
  ],
  '2025-08-26': [
    { id: '5', time: '08:30', duration: 60, client: 'David Brown', type: 'Consultation', status: 'confirmed' },
    { id: '6', time: '11:00', duration: 120, client: 'Lisa Garcia', type: 'Workshop', status: 'confirmed' },
    { id: '7', time: '15:30', duration: 45, client: 'Robert Taylor', type: 'Review', status: 'cancelled' }
  ],
  '2025-08-27': [
    { id: '8', time: '09:30', duration: 75, client: 'Jennifer Lee', type: 'Planning Session', status: 'confirmed' },
    { id: '9', time: '13:00', duration: 60, client: 'Mark Anderson', type: 'Consultation', status: 'confirmed' },
    { id: '10', time: '15:00', duration: 30, client: 'Amanda White', type: 'Brief', status: 'pending' },
    { id: '11', time: '16:30', duration: 45, client: 'Chris Martin', type: 'Follow-up', status: 'confirmed' }
  ],
  '2025-08-28': [
    { id: '12', time: '10:00', duration: 90, client: 'Rachel Green', type: 'Strategy Session', status: 'confirmed' },
    { id: '13', time: '14:30', duration: 60, client: 'Tom Wilson', type: 'Consultation', status: 'confirmed' }
  ]
};

const AppointmentManager = () => {
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'timeline'
  const [selectedDate, setSelectedDate] = useState('2025-08-25');
  const [showDayModal, setShowDayModal] = useState(false);
  const [modalDate, setModalDate] = useState('');

  // Prepare marked dates for calendar
  const markedDates = useMemo(() => {
    const marked:any = {};
    Object.keys(appointmentsData).forEach(date => {
      const count = appointmentsData[date].length;
      marked[date] = {
        marked: true,
        dotColor: '#4A90E2',
        customStyles: {
          container: {
            backgroundColor: count > 3 ? '#FF6B6B' : count > 1 ? '#4ECDC4' : '#95E1D3',
            borderRadius: 8,
          },
          text: {
            color: 'white',
            fontWeight: 'bold',
          },
        },
      };
    });
    
    // Highlight selected date
    if (marked[selectedDate]) {
      marked[selectedDate].selected = true;
      marked[selectedDate].selectedColor = '#4A90E2';
    } else {
      marked[selectedDate] = {
        selected: true,
        selectedColor: '#4A90E2',
      };
    }
    
    return marked;
  }, [selectedDate]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#4ECDC4';
      case 'pending': return '#FFD93D';
      case 'cancelled': return '#FF6B6B';
      default: return '#95E1D3';
    }
  };

  const formatTime = (time) => {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
    return `${displayHour}:${minute} ${ampm}`;
  };

  const getDayAppointments = (date) => {
    return appointmentsData[date] || [];
  };

  const onDayPress = (day) => {
    const appointments = getDayAppointments(day.dateString);
    if (appointments.length > 0) {
      setModalDate(day.dateString);
      setShowDayModal(true);
    }
    setSelectedDate(day.dateString);
  };

  const renderAppointmentCard = ({ item }) => (
    <View style={styles.appointmentCard}>
      <View style={styles.appointmentTime}>
        <Text style={styles.timeText}>{formatTime(item.time)}</Text>
        <Text style={styles.durationText}>{item.duration}min</Text>
      </View>
      <View style={styles.appointmentDetails}>
        <Text style={styles.clientName}>{item.client}</Text>
        <Text style={styles.appointmentType}>{item.type}</Text>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
        <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
      </View>
    </View>
  );

  const renderTimelineView = () => {
    const appointments = getDayAppointments(selectedDate);
    const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

    return (
      <ScrollView style={styles.timelineContainer}>
        <Text style={styles.dateHeader}>
          {new Date(selectedDate).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>
        
        {hours.map(hour => {
          const hourAppointments = appointments.filter(apt => {
            const aptHour = parseInt(apt.time.split(':')[0]);
            return aptHour === hour;
          });

          return (
            <View key={hour} style={styles.timeSlot}>
              <View style={styles.timeLabel}>
                <Text style={styles.timeLabelText}>
                  {hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`}
                </Text>
              </View>
              <View style={styles.appointmentSlot}>
                {hourAppointments.map(apt => (
                  <TouchableOpacity key={apt.id} style={styles.timelineAppointment}>
                    <View style={styles.appointmentHeader}>
                      <Text style={styles.timelineClient}>{apt.client}</Text>
                      <Text style={styles.timelineTime}>{formatTime(apt.time)}</Text>
                    </View>
                    <Text style={styles.timelineType}>{apt.type}</Text>
                    <View style={[styles.timelineStatus, { backgroundColor: getStatusColor(apt.status) }]}>
                      <Text style={styles.timelineStatusText}>{apt.status}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
                {hourAppointments.length === 0 && (
                  <View style={styles.emptySlot}>
                    <Text style={styles.emptySlotText}>Available</Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFB" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Appointments</Text>
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'calendar' && styles.toggleButtonActive]}
            onPress={() => setViewMode('calendar')}
          >
            <Ionicons name="calendar" size={20} color={viewMode === 'calendar' ? '#fff' : '#4A90E2'} />
            <Text style={[styles.toggleText, viewMode === 'calendar' && styles.toggleTextActive]}>
              Calendar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'timeline' && styles.toggleButtonActive]}
            onPress={() => setViewMode('timeline')}
          >
            <Ionicons name="time" size={20} color={viewMode === 'timeline' ? '#fff' : '#4A90E2'} />
            <Text style={[styles.toggleText, viewMode === 'timeline' && styles.toggleTextActive]}>
              Timeline
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      {viewMode === 'calendar' ? (
        <ScrollView style={styles.content}>
          <Calendar
            style={styles.calendar}
            current={selectedDate}
            onDayPress={onDayPress}
            markedDates={markedDates}
            markingType="custom"
            theme={{
              backgroundColor: '#ffffff',
              calendarBackground: '#ffffff',
              textSectionTitleColor: '#2d4150',
              dayTextColor: '#2d4150',
              todayTextColor: '#4A90E2',
              selectedDayTextColor: '#ffffff',
              monthTextColor: '#2d4150',
              arrowColor: '#4A90E2',
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14,
            }}
          />
          
          <View style={styles.legendContainer}>
            <Text style={styles.legendTitle}>Appointment Load</Text>
            <View style={styles.legendItems}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#95E1D3' }]} />
                <Text style={styles.legendText}>Light (1)</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#4ECDC4' }]} />
                <Text style={styles.legendText}>Moderate (2-3)</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#FF6B6B' }]} />
                <Text style={styles.legendText}>Heavy (4+)</Text>
              </View>
            </View>
          </View>

          {/* Today's Appointments Preview */}
          <View style={styles.todayPreview}>
            <Text style={styles.previewTitle}>
              {selectedDate === new Date().toISOString().split('T')[0] ? 'Today\'s' : 'Selected Day\'s'} Appointments
            </Text>
            <FlatList
              data={getDayAppointments(selectedDate)}
              renderItem={renderAppointmentCard}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Ionicons name="calendar-outline" size={48} color="#B0BEC5" />
                  <Text style={styles.emptyStateText}>No appointments scheduled</Text>
                </View>
              }
            />
          </View>
        </ScrollView>
      ) : (
        renderTimelineView()
      )}

      {/* Day Modal */}
      <Modal
        visible={showDayModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowDayModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {new Date(modalDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
            <TouchableOpacity onPress={() => setShowDayModal(false)}>
              <Ionicons name="close" size={24} color="#4A90E2" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={getDayAppointments(modalDate)}
            renderItem={renderAppointmentCard}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.modalList}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A202C',
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#F7FAFC',
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 8,
  },
  toggleButtonActive: {
    backgroundColor: '#4A90E2',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A90E2',
  },
  toggleTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  calendar: {
    margin: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  legendContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A202C',
    marginBottom: 12,
  },
  legendItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 14,
    color: '#4A5568',
  },
  todayPreview: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A202C',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
  },
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
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#718096',
    marginTop: 12,
  },
  timelineContainer: {
    flex: 1,
    padding: 16,
  },
  dateHeader: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 24,
    textAlign: 'center',
  },
  timeSlot: {
    flexDirection: 'row',
    marginBottom: 16,
    minHeight: 80,
  },
  timeLabel: {
    width: 100,
    alignItems: 'flex-end',
    paddingRight: 16,
    paddingTop: 8,
  },
  timeLabelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
  },
  appointmentSlot: {
    flex: 1,
    borderLeftWidth: 2,
    borderLeftColor: '#E1E8ED',
    paddingLeft: 16,
  },
  timelineAppointment: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timelineClient: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A202C',
  },
  timelineTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A90E2',
  },
  timelineType: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 8,
  },
  timelineStatus: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timelineStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  emptySlot: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#F7FAFC',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#CBD5E0',
  },
  emptySlotText: {
    fontSize: 14,
    color: '#A0AEC0',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFB',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A202C',
  },
  modalList: {
    padding: 16,
  },
});

export default AppointmentManager;