import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SectionProps {
  title: string;
  children: ReactNode;
  note?: string;
  variant?: 'default' | 'overall';
}

const Section: React.FC<SectionProps> = ({
  title,
  children,
  note,
  variant = 'default',
}) => {
  return (
    <View style={[
      styles.section,
      variant === 'overall' && styles.overallSection
    ]}>
      <Text style={styles.sectionHeader}>{title}</Text>
      {note && <Text style={styles.note}>{note}</Text>}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  overallSection: {
    backgroundColor: '#e8f4f8',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  note: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 15,
    fontStyle: 'italic',
  },
});

export default Section;