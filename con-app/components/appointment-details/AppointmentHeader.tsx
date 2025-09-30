import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ROUTES } from '@/constants/app.routes';

export interface AppointmentHeaderProps {
  appointmentId: number;
  isTablet: boolean;
  fontSizeLarge: number;
  onBackPress?: () => void;
}

const AppointmentHeader: React.FC<AppointmentHeaderProps> = ({
  appointmentId,
  isTablet,
  fontSizeLarge,
  onBackPress,
}) => {
  const router = useRouter();


  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.replace(ROUTES.MY_APPOINTMENTS as any);
    }
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={handleBackPress}
        style={styles.backButton}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
      >
        <Ionicons
          name="arrow-back"
          size={isTablet ? 32 : 24}
          color="#1F2937"
        />
      </TouchableOpacity>
      <Text
        style={[
          styles.headerTitle,
          { fontSize: isTablet ? fontSizeLarge + 4 : fontSizeLarge },
        ]}
      >
        Appointment Details
      </Text>
      <View style={styles.appointmentIdContainer}>
        <Text
          style={[
            styles.appointmentId,
            { fontSize: isTablet ? 14 : 14 },
          ]}
        >
          #{appointmentId}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontWeight: '600',
    color: '#1F2937',
  },
  appointmentIdContainer: {
    minWidth: 80,
    alignItems: 'flex-end',
  },
  appointmentId: {
    color: '#6B7280',
    fontWeight: '500',
  },
});

export default AppointmentHeader;