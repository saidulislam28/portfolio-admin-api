import { DARK_GRAY, LIGHT_GRAY, PRIMARY_COLOR, WHITE } from '@/lib/constants';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function CustomPackageModal({ 
  visible, 
  onClose, 
  onConfirm, 
  initialData 
}) {
  const [mockTests, setMockTests] = useState(initialData?.mockTests?.toString() || '1');
  const [partnerConversations, setPartnerConversations] = useState(
    initialData?.partnerConversations?.toString() || '0'
  );

  useEffect(() => {
    if (visible) {
      setMockTests(initialData?.mockTests?.toString() || '1');
      setPartnerConversations(initialData?.partnerConversations?.toString() || '0');
    }
  }, [visible, initialData]);

  const handleConfirm = () => {
    const mockTestsNum = parseInt(mockTests) || 0;
    const conversationsNum = parseInt(partnerConversations) || 0;

    if (mockTestsNum < 1) {
      Alert.alert('Error', 'You must select at least 1 mock test');
      return;
    }

    if (mockTestsNum > 20 || conversationsNum > 20) {
      Alert.alert('Error', 'Maximum 20 sessions allowed for each type');
      return;
    }

    onConfirm({
      mockTests: mockTestsNum,
      partnerConversations: conversationsNum
    });
  };

  const calculateTotal = () => {
    const mockTestsNum = parseInt(mockTests) || 0;
    const conversationsNum = parseInt(partnerConversations) || 0;
    return (mockTestsNum * 180) + (conversationsNum * 150);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Customize Your Package</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mock Speaking Tests</Text>
            <Text style={styles.sectionDescription}>
              Individual IELTS mock speaking test sessions (20 minutes each)
            </Text>
            <Text style={styles.rateText}>Rate: Tk. 180 per session</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Number of sessions:</Text>
              <TextInput
                style={styles.input}
                value={mockTests}
                onChangeText={setMockTests}
                keyboardType="numeric"
                placeholder="1"
                maxLength={2}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Partner Conversations</Text>
            <Text style={styles.sectionDescription}>
              Practice conversations with a partner (20 minutes each)
            </Text>
            <Text style={styles.rateText}>Rate: Tk. 150 per session</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Number of sessions:</Text>
              <TextInput
                style={styles.input}
                value={partnerConversations}
                onChangeText={setPartnerConversations}
                keyboardType="numeric"
                placeholder="0"
                maxLength={2}
              />
            </View>
          </View>

          <View style={styles.totalSection}>
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalAmount}>Tk. {calculateTotal()}</Text>
          </View>

          <View style={styles.summary}>
            <Text style={styles.summaryTitle}>Package Summary:</Text>
            <Text style={styles.summaryText}>
              • {parseInt(mockTests) || 0} Mock Speaking Test{(parseInt(mockTests) || 0) !== 1 ? 's' : ''}
            </Text>
            <Text style={styles.summaryText}>
              • {parseInt(partnerConversations) || 0} Partner Conversation{(parseInt(partnerConversations) || 0) !== 1 ? 's' : ''}
            </Text>
            <Text style={styles.summaryText}>
              • Total Sessions: {(parseInt(mockTests) || 0) + (parseInt(partnerConversations) || 0)}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirm}
          >
            <Text style={styles.confirmButtonText}>
              Confirm Package (Tk. {calculateTotal()})
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: LIGHT_GRAY,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: LIGHT_GRAY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  closeButtonText: {
    fontSize: 20,
    color: DARK_GRAY,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
    padding: 16,
    backgroundColor: LIGHT_GRAY,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: PRIMARY_COLOR,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: DARK_GRAY,
    marginBottom: 8,
    lineHeight: 20,
  },
  rateText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputLabel: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  input: {
    width: 80,
    height: 40,
    borderWidth: 1,
    borderColor: DARK_GRAY,
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: WHITE,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 2,
    borderTopColor: PRIMARY_COLOR,
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
  },
  summary: {
    backgroundColor: '#f8f9ff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: PRIMARY_COLOR,
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: DARK_GRAY,
  },
  confirmButton: {
    backgroundColor: PRIMARY_COLOR,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: WHITE,
  },
});