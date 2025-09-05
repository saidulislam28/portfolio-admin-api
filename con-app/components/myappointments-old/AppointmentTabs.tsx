import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { PRIMARY_COLOR } from '@/lib/constants';

interface AppointmentTabsProps {
  activeTab: 'upcoming' | 'past';
  onTabChange: (tab: 'upcoming' | 'past') => void;
  upcomingCount: number;
  pastCount: number;
}

const { width } = Dimensions.get('window');

export default function AppointmentTabs({
  activeTab,
  onTabChange,
  upcomingCount,
  pastCount,
}: AppointmentTabsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'upcoming' && styles.activeTab,
        ]}
        onPress={() => onTabChange('upcoming')}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === 'upcoming' && styles.activeTabText,
          ]}
        >
          Upcoming
        </Text>
        {upcomingCount > 0 && (
          <View style={[
            styles.countBadge,
            activeTab === 'upcoming' && styles.activeCountBadge,
          ]}>
            <Text style={[
              styles.countText,
              activeTab === 'upcoming' && styles.activeCountText,
            ]}>
              {upcomingCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'past' && styles.activeTab,
        ]}
        onPress={() => onTabChange('past')}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === 'past' && styles.activeTabText,
          ]}
        >
          Past
        </Text>
        {pastCount > 0 && (
          <View style={[
            styles.countBadge,
            activeTab === 'past' && styles.activeCountBadge,
          ]}>
            <Text style={[
              styles.countText,
              activeTab === 'past' && styles.activeCountText,
            ]}>
              {pastCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    margin: 24,
    marginBottom: 16,
    borderRadius: 12,
    padding: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    minHeight: 60,
  },
  activeTab: {
    backgroundColor: PRIMARY_COLOR,
  },
  tabText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#6c757d',
  },
  activeTabText: {
    color: 'white',
    fontWeight: '600',
  },
  countBadge: {
    backgroundColor: '#e9ecef',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 12,
    minWidth: 28,
    alignItems: 'center',
  },
  activeCountBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  countText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6c757d',
  },
  activeCountText: {
    color: 'white',
  },
});