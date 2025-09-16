import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Legend: React.FC = () => {
  return (
    <View style={styles.legendContainer}>
      <Text style={styles.legendTitle}>Appointment Load</Text>
      <View style={styles.legendItems}>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendDot, { backgroundColor: '#95E1D3' }]}
          />
          <Text style={styles.legendText}>Light (1)</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendDot, { backgroundColor: '#4ECDC4' }]}
          />
          <Text style={styles.legendText}>Moderate (2-3)</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendDot, { backgroundColor: '#FF6B6B' }]}
          />
          <Text style={styles.legendText}>Heavy (4+)</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  legendContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A202C',
    marginBottom: 12,
  },
  legendItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 14,
    color: '#4A5568',
  },
});

export default Legend;