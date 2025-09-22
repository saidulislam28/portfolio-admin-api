import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BookItemDto, ExamItemDto } from '../types/OrderTypes';
import { displayPrice } from '@sm/common';

interface BookItemsProps {
  items: (BookItemDto | ExamItemDto)[];
  totalPrice?: number;
}

export const BookItems: React.FC<BookItemsProps> = ({ items, totalPrice }) => {
  if (!items || items.length === 0) return null;

  return (
    <>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <View style={styles.itemRow}>
            <Text style={styles.itemLabel}>{item.name}</Text>
            <Text style={styles.itemValue}>
              {item.quantity}x {displayPrice(item.price)}
            </Text>
          </View>
          {index < items.length - 1 && <Divider />}
        </React.Fragment>
      ))}
      
      {totalPrice !== undefined && (
        <>
          <Divider />
          <View style={styles.itemRow}>
            <Text style={[styles.itemLabel, styles.totalLabel]}>Total Price</Text>
            <Text style={[styles.itemValue, styles.totalValue]}>
              {displayPrice(totalPrice.toFixed(2))}
            </Text>
          </View>
        </>
      )}
    </>
  );
};

const Divider: React.FC = () => <View style={styles.divider} />;

const styles = StyleSheet.create({
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  itemLabel: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
    flex: 1,
  },
  itemValue: {
    fontSize: 15,
    color: '#2C2C54',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
  totalLabel: {
    fontWeight: 'bold',
    color: '#2C2C54',
  },
  totalValue: {
    fontWeight: 'bold',
    color: '#4A90E2',
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginVertical: 12,
  },
});