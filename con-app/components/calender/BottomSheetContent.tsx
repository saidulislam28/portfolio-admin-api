import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';

interface BottomSheetContentProps {
  modalDate: string;
  appointments: any[];
  renderItem: ({ item }: { item: any }) => JSX.Element;
}

const BottomSheetContent: React.FC<BottomSheetContentProps> = ({
  modalDate,
  appointments,
  renderItem,
}) => {
  return (
    <>
      <View style={styles.bottomSheetHeader}>
        <Text style={styles.bottomSheetTitle}>
          {modalDate &&
            new Date(modalDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
        </Text>
      </View>
      <BottomSheetFlatList
        data={appointments}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.bottomSheetList}
      />
    </>
  );
};

const styles = StyleSheet.create({
  bottomSheetHeader: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
    backgroundColor: '#fff',
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A202C',
    textAlign: 'center',
  },
  bottomSheetList: {
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
});

export default BottomSheetContent;