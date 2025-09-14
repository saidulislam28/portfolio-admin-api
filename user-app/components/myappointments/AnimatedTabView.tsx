import React, { useCallback, useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    View
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';

import AppointmentList from '@/components/myappointments/AppointmentList';
import {
    type Appointment
} from '@/utility/appointment';
import TabButton from './TabButton';
import { PRIMARY_COLOR } from '@/lib/constants';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const AnimatedTabView: React.FC<{
    upcomingAppointments: Appointment[];
    pastAppointments: Appointment[];
    onAppointmentPress: (appointment: Appointment) => void;
    onRefresh: () => void;
    refreshing: boolean;
}> = React.memo(({ upcomingAppointments, pastAppointments, onAppointmentPress, onRefresh, refreshing }) => {
    const [activeTab, setActiveTab] = useState(0);
    const translateX = useSharedValue(0);
    const tabIndicatorTranslateX = useSharedValue(0);

    const switchTab = useCallback((tabIndex: number) => {
        setActiveTab(tabIndex);
        translateX.value = withTiming(-tabIndex * SCREEN_WIDTH);
        tabIndicatorTranslateX.value = withTiming(tabIndex * (SCREEN_WIDTH / 2));
    }, [translateX, tabIndicatorTranslateX]);

    const containerAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    const tabIndicatorAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: tabIndicatorTranslateX.value }],
    }));

    return (
        <ScrollView style={styles.tabContainer}>
            {/* Tab Headers */}
            <View style={styles.tabHeader}>
                <TabButton
                    title="Upcoming"
                    count={upcomingAppointments.length}
                    isActive={activeTab === 0}
                    onPress={() => switchTab(0)}
                />
                <TabButton
                    title="Past"
                    count={pastAppointments.length}
                    isActive={activeTab === 1}
                    onPress={() => switchTab(1)}
                />
                <Animated.View style={[styles.tabIndicator, tabIndicatorAnimatedStyle]} />
            </View>

            {/* Tab Content */}
            <Animated.View style={[styles.tabContentContainer, containerAnimatedStyle]}>
                <View style={styles.tabContent}>
                    <AppointmentList
                        appointments={upcomingAppointments}
                        onAppointmentPress={onAppointmentPress}
                        onRefresh={onRefresh}
                        refreshing={refreshing}
                        emptyMessage="No upcoming appointments"
                    />
                </View>
                <View style={styles.tabContent}>
                    <AppointmentList
                        appointments={pastAppointments}
                        onAppointmentPress={onAppointmentPress}
                        onRefresh={onRefresh}
                        refreshing={refreshing}
                        emptyMessage="No past appointments"
                    />
                </View>
            </Animated.View>
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
    tabContainer: {
        flex: 1,
    },
    tabHeader: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E9ECEF',
        position: 'relative',
    },
    tab: {
        flex: 1,
        paddingVertical: 16,
        alignItems: 'center',
    },
    activeTab: {
        // Active tab styling handled by indicator
    },
    tabText: {
        fontSize: 16,
        color: '#6C757D',
        fontWeight: '500',
    },
    activeTabText: {
        color: PRIMARY_COLOR,
        fontWeight: 'bold',
    },
    tabIndicator: {
        position: 'absolute',
        bottom: 0,
        height: 3,
        backgroundColor: PRIMARY_COLOR,
        width: SCREEN_WIDTH / 2,
    },
    tabContentContainer: {
        flex: 1,
        flexDirection: 'row',
        width: SCREEN_WIDTH * 2,
    },
    tabContent: {
        width: SCREEN_WIDTH,
        flex: 1,
    },
    appointmentCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    serviceType: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#212529',
        flex: 1,
        textTransform: 'capitalize',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        color: '#FFFFFF',
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    cardContent: {
        gap: 6,
    },
    appointmentId: {
        fontSize: 14,
        color: '#6C757D',
        fontWeight: '500',
    },
    consultantName: {
        fontSize: 14,
        color: '#495057',
        fontWeight: '500',
    },
    appointmentTime: {
        fontSize: 16,
        color: '#212529',
        fontWeight: '600',
    },
    duration: {
        fontSize: 14,
        color: '#6C757D',
    },
    notes: {
        fontSize: 14,
        color: '#495057',
        fontStyle: 'italic',
    },
    cancelledSection: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#E9ECEF',
    },
    cancelReason: {
        fontSize: 14,
        color: '#DC3545',
        fontWeight: '500',
    },
});

export default AnimatedTabView;