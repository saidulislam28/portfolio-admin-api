import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { convertUtcToTimezoneFormat } from '@/utils/dateTime';
import { getUserDeviceTimezone } from '@/utils/userTimezone';
import { Appointment } from './AppointmentCard';

interface TimelineViewProps {
    selectedDate: string;
    appointments: Appointment[];
    onPressAppointment: (appointment: Appointment) => void;
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

const TimelineView: React.FC<TimelineViewProps> = ({
    selectedDate,
    appointments,
    onPressAppointment,
}) => {
    const hours = Array.from({ length: 12 }, (_, i) => i + 8);

    const timelineData = [
        {
            type: 'header',
            date: selectedDate,
        },
        ...hours.map(hour => ({
            type: 'timeSlot',
            hour,
            appointments: appointments.filter(apt => {
                const aptHour = parseInt(apt.start_at.split('T')[1].split(':')[0]);
                return aptHour === hour;
            }),
        })),
    ];

    const renderTimelineItem = ({ item }: { item: any }) => {
        if (item.type === 'header') {
            return (
                <Text style={styles.dateHeader}>
                    {new Date(item.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })}
                </Text>
            );
        }

        return (
            <View style={styles.timeSlot}>
                <View style={styles.timeLabel}>
                    <Text style={styles.timeLabelText}>
                        {item.hour > 12
                            ? `${item.hour - 12}:00 PM`
                            : `${item.hour}:00 AM`}
                    </Text>
                </View>
                <View style={styles.appointmentSlot}>
                    {item.appointments.map((apt: Appointment) => (
                        <TouchableOpacity
                            key={apt.id}
                            style={styles.timelineAppointment}
                            onPress={() => onPressAppointment(apt)}
                        >
                            <View style={styles.appointmentHeader}>
                                <Text style={styles.timelineClient}>{apt.client}</Text>
                                <Text style={styles.timelineTime}>
                                    {convertUtcToTimezoneFormat(
                                        apt.start_at,
                                        getUserDeviceTimezone()
                                    )}
                                </Text>
                            </View>
                            <Text style={styles.timelineType}>{apt.type}</Text>
                            <View
                                style={[
                                    styles.timelineStatus,
                                    { backgroundColor: getStatusColor(apt.status) },
                                ]}
                            >
                                <Text style={styles.timelineStatusText}>{apt.status}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                    {item.appointments.length === 0 && (
                        <View style={styles.emptySlot}>
                            <Text style={styles.emptySlotText}>Available</Text>
                        </View>
                    )}
                </View>
            </View>
        );
    };

    return (
        <FlatList
            data={timelineData}
            renderItem={renderTimelineItem}
            keyExtractor={(item: any, index) =>
                item.type === 'header' ? 'header' : `slot-${item.hour}`
            }
            contentContainerStyle={styles.timelineContainer}
            showsVerticalScrollIndicator={false}
        />
    );
};

const styles = StyleSheet.create({
    timelineContainer: {
        padding: 16,
        flexGrow: 1,
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
});

export default TimelineView;