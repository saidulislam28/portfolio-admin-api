import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

interface ErrorScreenProps {
  onRetry: () => void;
  onBackToHome: () => void;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({
  onRetry,
  onBackToHome,
}) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4A90E2', '#357ABD', '#1E3A8A']}
        style={styles.gradient}
      />
      <Feather name="wifi-off" size={48} color="rgba(255, 255, 255, 0.7)" />
      <Text style={styles.title}>Connection Error</Text>
      <Text style={styles.text}>
        Unable to load order details. Please check your internet connection.
      </Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={onRetry}
        activeOpacity={0.7}
      >
        <Feather name="refresh-cw" size={18} color="white" />
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.homeButton}
        onPress={onBackToHome}
        activeOpacity={0.7}
      >
        <Feather name="home" size={18} color="rgba(255, 255, 255, 0.8)" />
        <Text style={styles.homeButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#4A90E2',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  text: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    gap: 10,
    marginBottom: 15,
    minWidth: 200,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 25,
    gap: 8,
  },
  homeButtonText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontWeight: '500',
  },
});