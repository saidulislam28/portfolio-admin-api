import { DARK_GRAY, LIGHT_GRAY, PRIMARY_COLOR, WHITE } from '@/lib/constants';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import RenderHTML from 'react-native-render-html';

export default function PackageCard({
  package: pkg,
  isSelected,
  onSelect,
  displayPrice,
  discountPrice,
  currency,
  customData
}: any) {

  const { width } = useWindowDimensions();


  const renderPrice = () => {
    if (pkg.type === 'custom' && customData) {
      const total = (customData.mockTests * 180) + (customData.partnerConversations * 150);
      return (
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>{currency} {total}</Text>
          <Text style={styles.priceBreakdown}>
            {customData.mockTests} Mock Tests + {customData.partnerConversations} Conversations
          </Text>
        </View>
      );
    } else if (pkg.type === 'custom') {
      return (
        <View style={styles.priceContainer}>
          <Text style={styles.customText}>Customize</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.priceContainer}>
          {/* <Text style={styles.priceText}>{currency} {displayPrice}</Text> */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={styles.priceText}>BDT {pkg?.price_bdt}</Text>
            <Text style={styles.originalPrice}>BDT {pkg?.price_bdt_original}</Text>
          </View>
          {pkg?.sessions_count &&
            <Text style={styles.sessionsText}>{pkg?.sessions_count} session</Text>
          }
        </View>
      );
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isSelected && styles.selectedCard
      ]}
      onPress={onSelect}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, isSelected && styles.selectedTitle]}>
            {pkg.name}
          </Text>
          {/* <Text style={styles.description}>
            {pkg.description}
          </Text> */}
          <RenderHTML
            contentWidth={width}
            source={{ html: pkg.description as string }}
          />
        </View>

        {renderPrice()}

        {isSelected && (
          <View style={styles.selectedIndicator}>
            <Text style={styles.selectedText}>✓ Selected</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: WHITE,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: LIGHT_GRAY,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedCard: {
    borderColor: PRIMARY_COLOR,
    backgroundColor: '#f8f9ff',
  },
  cardContent: {
    flex: 1,
  },
  titleContainer: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    lineHeight: 24,
  },
  selectedTitle: {
    color: PRIMARY_COLOR,
  },
  description: {
    fontSize: 14,
    color: DARK_GRAY,
    lineHeight: 20,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
  },
  originalPrice: {
    fontSize: 14,
    color: '#888',
    textDecorationLine: 'line-through',
  },
  customText: {
    fontSize: 18,
    fontWeight: '600',
    color: PRIMARY_COLOR,
  },
  sessionsText: {
    fontSize: 14,
    color: DARK_GRAY,
  },
  priceBreakdown: {
    fontSize: 12,
    color: DARK_GRAY,
    textAlign: 'right',
    flex: 1,
  },
  selectedIndicator: {
    alignItems: 'center',
    marginTop: 8,
  },
  selectedText: {
    fontSize: 14,
    fontWeight: '600',
    color: PRIMARY_COLOR,
  },
});