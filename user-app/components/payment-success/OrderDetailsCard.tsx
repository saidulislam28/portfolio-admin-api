import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { AppointmentDetails } from './AppointmentDetails';
import { BookItems } from './BookItems';
import { TipContainer } from './TipContainer';
import {
  OrderDetailsResponse,
  BookPurchaseResponse,
  ExamRegistrationResponse,
  IeltsAcademicResponse,
  GenericOrderResponse,
  SpeakingMockTestResponse,
  ConversationResponse,
} from '../types/OrderTypes';
import { displayPrice } from '@sm/common';

interface OrderDetailsCardProps {
  orderData: OrderDetailsResponse;
  serviceType: string;
}

export const OrderDetailsCard: React.FC<OrderDetailsCardProps> = ({
  orderData,
  serviceType,
}) => {
  const renderOrderDetails = () => {
    switch (serviceType) {
      case 'speaking_mock_test':
      case 'conversation':
        return (
          <AppointmentDetails
            appointments={(orderData as SpeakingMockTestResponse | ConversationResponse).appointments}
          />
        );

      case 'book_purchase':
        const bookData = orderData as BookPurchaseResponse;
        return (
          <>
            <DetailRow label="Order ID" value={`#${bookData.orderId}`} />
            <Divider />
            <DetailRow label="Purchase Date" value={bookData.purchaseDate} />
            <Divider />
            <BookItems items={bookData.items} totalPrice={bookData.totalPrice} />
          </>
        );

      case 'exam_registration':
        const examData = orderData as ExamRegistrationResponse;
        return (
          <>
            <DetailRow label="Registration ID" value={`#${examData.registrationId}`} />
            <Divider />
            <DetailRow label="Total" value={displayPrice(examData.totalPrice)} />
          </>
        );

      case 'ielts_academic':
        const ieltsData = orderData as IeltsAcademicResponse;
        return (
          <DetailRow label="Order ID" value={`#${ieltsData.orderId}`} />
        );

      default:
        const genericData = orderData as GenericOrderResponse;
        return (
          <>
            <DetailRow label="Order ID" value={`#${genericData.orderId}`} />
            <Divider />
            <DetailRow label="Date" value={genericData.date} />
          </>
        );
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Feather name={orderData.icon} size={24} color="#4A90E2" />
        <Text style={styles.title}>{orderData.cardTitle}</Text>
      </View>

      {renderOrderDetails()}

      {orderData.tip && <TipContainer tip={orderData.tip} />}
    </View>
  );
};

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const Divider: React.FC = () => <View style={styles.divider} />;

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderRadius: 18,
    padding: 20,
    width: '100%',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C2C54',
    marginLeft: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  label: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
    flex: 1,
  },
  value: {
    fontSize: 15,
    color: '#2C2C54',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginVertical: 12,
  },
});