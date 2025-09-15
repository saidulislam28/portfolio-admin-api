import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  viewMode: 'calendar' | 'timeline';
  onViewModeChange: (mode: 'calendar' | 'timeline') => void;
  title: string;
}

const Header: React.FC<HeaderProps> = ({ viewMode, onViewModeChange, title }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.viewToggle}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            viewMode === 'calendar' && styles.toggleButtonActive,
          ]}
          onPress={() => onViewModeChange('calendar')}
        >
          <Ionicons
            name="calendar"
            size={20}
            color={viewMode === 'calendar' ? '#fff' : '#4A90E2'}
          />
          <Text
            style={[
              styles.toggleText,
              viewMode === 'calendar' && styles.toggleTextActive,
            ]}
          >
            Calendar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default Header;