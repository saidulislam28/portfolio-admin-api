import React from 'react';
import { View, Text, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import {
  storeSpeakingMockTestData,
  storeConversationData,
  storeBookPurchaseData,
  storeExamRegistrationData,
  storeIeltsAcademicData,
  storeMultipleBooks,
  storeExamWithFees,
  storeMultipleSpeakingAppointments
} from '@/utils/orderDataStorage'; // Make sure this path is correct

const HomeScreen = () => {
  const router = useRouter();

  // Utility function to handle button presses and navigation
  const handlePress = async (action, serviceType, data) => {
    try {
      const orderId = `ORDER_${Date.now()}`;
      let success = false;

      // The switch statement handles different order types by calling the correct function
      switch (action) {
        case 'speaking_mock_test':
          success = await storeMultipleSpeakingAppointments(orderId, data.appointments);
          break;
        case 'conversation':
          success = await storeConversationData(orderId, data.appointments);
          break;
        case 'purchase_books':
          success = await storeMultipleBooks(orderId, data.books);
          break;
        case 'register_ielts_exam':
          success = await storeExamWithFees(orderId, data.registrationId, data.examDate, data.examType, data.additionalFees);
          break;
        case 'ielts_academic_class':
          success = await storeIeltsAcademicData(orderId);
          break;
        default:
          Alert.alert('Error', 'Unknown action.');
          return;
      }

      if (success) {
        router.push({
          pathname: '/payment-success',
          params: {
            service_type: serviceType,
            order_id: orderId,
          },
        });
      } else {
        Alert.alert('Error', 'Failed to save order data. Please try again.');
      }
    } catch (error) {
      console.error('Error during order process:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Book Your Service</Text>

      {/* Button for Speaking Mock Test */}
      <View style={styles.buttonContainer}>
        <Button
          title="Book Speaking Mock Test"
          onPress={() =>
            handlePress(
              'speaking_mock_test',
              'speaking_mock_test',
              {
                appointments: [
                  { appointmentId: '#APT2024001', date: 'June 28, 2025', time: '2:30 PM - 3:00 PM' },
                  { appointmentId: '#APT2024002', date: 'June 30, 2025', time: '10:00 AM - 10:30 AM' },
                ],
              }
            )
          }
        />
      </View>
      
      {/* Button for Conversation Appointment */}
      <View style={styles.buttonContainer}>
        <Button
          title="Book Conversation Appointment"
          onPress={() =>
            handlePress(
              'conversation',
              'conversation',
              {
                appointments: [{ appointmentId: '#CONV2024001', date: 'July 5, 2025', time: '4:00 PM - 5:00 PM' }],
              }
            )
          }
        />
      </View>

      {/* Button for Book Purchase */}
      <View style={styles.buttonContainer}>
        <Button
          title="Purchase Books"
          onPress={() =>
            handlePress(
              'purchase_books',
              'book_purchase',
              {
                books: [
                  { name: "IELTS Academic Writing Guide", quantity: 1, price: 29.99 },
                  { name: "Speaking Practice Workbook", quantity: 2, price: 19.99 },
                ],
              }
            )
          }
        />
      </View>
      
      {/* Button for IELTS Exam Registration */}
      <View style={styles.buttonContainer}>
        <Button
          title="Register for IELTS Exam"
          onPress={() =>
            handlePress(
              'register_ielts_exam',
              'exam_registration',
              {
                registrationId: `#IELTS${Math.floor(Math.random() * 10000)}`,
                examDate: 'August 15, 2025',
                examType: 'IELTS Academic',
                additionalFees: [{ name: "Additional Test Report Form", quantity: 1, price: 20.00 }],
              }
            )
          }
        />
      </View>

      {/* Button for IELTS Academic Class */}
      <View style={styles.buttonContainer}>
        <Button
          title="Book IELTS Academic Class"
          onPress={() =>
            handlePress(
              'ielts_academic_class',
              'ielts_academic',
              {}
            )
          }
        />
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '80%',
    marginVertical: 10,
  },
});

export default HomeScreen;