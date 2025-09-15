import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import EnhancedCheckbox from './EnhancedCheckbox';
import { FeedbackData } from '@/types/conversation-feedback';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

export interface CheckboxItem {
  label: string;
  field: keyof FeedbackData;
}

interface FeedbackSectionProps {
  title: string;
  items: CheckboxItem[];
  suggestionsTitle?: string;
  suggestionItems?: CheckboxItem[];
  feedback: FeedbackData;
  onCheckboxChange: (field: keyof FeedbackData) => void;
}

const FeedbackSection: React.FC<FeedbackSectionProps> = ({
  title,
  items,
  suggestionsTitle,
  suggestionItems,
  feedback,
  onCheckboxChange,
}) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.twoColumnContainer}>
        <View style={styles.column}>
          {items.slice(0, Math.ceil(items.length / 2)).map((item, index) => (
            <EnhancedCheckbox
              key={`${item.field}-${index}`}
              label={item.label}    
              field={item.field}
              isChecked={feedback[item.field] as boolean}
              onPress={() => onCheckboxChange(item.field)}
            />
          ))}
        </View>
        <View style={styles.column}>
          {items.slice(Math.ceil(items.length / 2)).map((item, index) => (
            <EnhancedCheckbox
              key={`${item.field}-${index + Math.ceil(items.length / 2)}`}
              label={item.label}
              field={item.field}
              isChecked={feedback[item.field] as boolean}
              onPress={() => onCheckboxChange(item.field)}
            />
          ))}
        </View>
      </View>

      {suggestionsTitle && suggestionItems && (
        <>
          <Text style={styles.subsectionTitle}>{suggestionsTitle}</Text>
          <View style={styles.suggestionsContainer}>
            {suggestionItems.map((item, index) => (
              <EnhancedCheckbox
                key={`${item.field}-suggestion-${index}`}
                label={item.label}
                field={item.field}
                isChecked={feedback[item.field] as boolean}
                onPress={() => onCheckboxChange(item.field)}
              />
            ))}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: isTablet ? 20 : 15,
    marginBottom: isTablet ? 25 : 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: isTablet ? 22 : 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#2c3e50',
  },
  subsectionTitle: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: '500',
    marginTop: 15,
    marginBottom: 10,
    color: '#3a86ff',
  },
  twoColumnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  column: {
    width: isTablet ? '48%' : '100%',
  },
  suggestionsContainer: {
    width: '100%',
  },
});

export default React.memo(FeedbackSection);