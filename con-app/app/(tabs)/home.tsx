import { useAuth } from '@/context/useAuth';
import PreHeader from '@/components/PreHeader';
import { PRIMARY_COLOR } from '@/lib/constants';
import { API_CONSULTANT, Get } from '@sm/common';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { useAppSettings } from '@/hooks/queries/useAppSettings';

export default function HomeScreen() {
  const { logout }: any = useAuth();
  const [appointments, setAppointments] = useState([]);
  const router = useRouter();
  const handleGetAppointments = async () => {
    const response = await Get(API_CONSULTANT.get_live_appointments);
    if (response.success) {
      setAppointments(response.data);
      return;
    }
    Alert.alert('Error', response.error ?? 'Failed to load data!');
  };

  const {
    data: appSettingsData,
    isLoading,
    isSuccess: isSettingsFetchSuccess,
  } = useAppSettings();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <PreHeader />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingHorizontal: 16,
  },
  content: {
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'center',
    marginVertical: 20,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  // advertise
  addContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: PRIMARY_COLOR, // Purple gradient approximation
    borderRadius: 8,
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  iconContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 4,
    padding: 10,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  itemSeparator: {
    height: 12, // Adjust this value to change the gap size
  },
  mainText: {
    color: '#FFFFFC',
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 2,
  },
  subText: {
    color: '#FFFFFC',
    fontSize: 16,
    fontWeight: '400',
  },
  arrowContainer: {
    marginLeft: 8,
  },
  button: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  countBadge: {
    backgroundColor: '#c53030',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  countBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },

  serviceContainer: {
    // paddingVertical: 16,
    // backgroundColor: '#f8fafc',
    marginBottom: 24,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  serviceItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  iconsContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
    lineHeight: 20,
  },
  serviceCard: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minWidth: 94,
    height: 98,
    boxShadow: 'black',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 2,
    borderRadius: 10,
  },

  packageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },

  liveSection: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fff5f5',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#fed7d7',
  },
  liveSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  liveSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#c53030',
  },

  flatListContainer: {
    padding: 10,
  },
});
