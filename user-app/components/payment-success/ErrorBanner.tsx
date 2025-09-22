import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface ErrorBannerProps {
  onRetry: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ onRetry }) => {
  return (
    <View style={styles.container}>
      <Feather name="alert-triangle" size={16} color="#FF9500" />
      <Text style={styles.text}>
        Showing offline data. Tap to retry.
      </Text>
      <TouchableOpacity onPress={onRetry}>
        <Feather name="refresh-cw" size={16} color="#FF9500" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 149, 0, 0.2)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    width: '100%',
  },
  text: {
    color: '#FF9500',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
  },
});