import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface LoadingViewProps {
  appointmentTitle?: string;
}

export const LoadingView: React.FC<LoadingViewProps> = ({ appointmentTitle }) => {
  return (
    <View style={styles.loadingContent}>
      <Text style={styles.loadingText}>Connecting...</Text>
      <Text style={styles.loadingSubtext}>
        {appointmentTitle || 'Preparing your call'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContent: {
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});