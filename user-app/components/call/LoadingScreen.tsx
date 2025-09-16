import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface LoadingScreenProps {
  appointmentTitle?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ appointmentTitle }) => {
  return (
    <View style={styles.loadingContainer}>
      <View style={styles.loadingContent}>
        <Text style={styles.loadingText}>Connecting...</Text>
        <Text style={styles.loadingSubtext}>
          {appointmentTitle || 'Preparing your call'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
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