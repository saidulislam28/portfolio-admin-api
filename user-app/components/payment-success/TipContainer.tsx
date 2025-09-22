import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface TipContainerProps {
  tip: string;
}

export const TipContainer: React.FC<TipContainerProps> = ({ tip }) => {
  return (
    <View style={styles.container}>
      <Feather name="lightbulb" size={16} color="#FF9500" />
      <Text style={styles.text}>{tip}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3CD',
    borderRadius: 10,
    padding: 12,
    marginTop: 15,
  },
  text: {
    fontSize: 13,
    color: '#856404',
    marginLeft: 8,
    flex: 1,
    fontWeight: '500',
  },
});