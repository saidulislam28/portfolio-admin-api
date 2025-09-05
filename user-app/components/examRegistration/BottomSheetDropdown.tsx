import React, { useRef, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';

const BottomSheetDropdown = ({
    value,
    items,
    onSelect,
    placeholder = "Select an option",
    snapPoints = ['25%', '50%']
}: any) => {
    const bottomSheetRef = useRef(null);

    const selectedLabel = useMemo(() => {
        const selectedItem = items.find(item => item.value === value);
        return selectedItem ? selectedItem.label : placeholder;
    }, [value, items, placeholder]);

    const handleItemPress = (itemValue) => {
        onSelect(itemValue);
        bottomSheetRef.current?.close();
    };

    return (
        <>
            <TouchableOpacity
                style={styles.trigger}
                onPress={() => bottomSheetRef.current?.expand()}
            >
                <Text style={styles.triggerText}>{selectedLabel}</Text>
            </TouchableOpacity>

            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                snapPoints={snapPoints}
                enablePanDownToClose
            >
                <BottomSheetScrollView style={styles.contentContainer}>
                    {items.map((item) => (
                        <TouchableOpacity
                            key={item.value}
                            style={[
                                styles.item,
                                value === item.value && styles.selectedItem
                            ]}
                            onPress={() => handleItemPress(item.value)}
                        >
                            <Text style={styles.itemText}>{item.label}</Text>
                        </TouchableOpacity>
                    ))}
                </BottomSheetScrollView>
            </BottomSheet>
        </>
    );
};

const styles = StyleSheet.create({
    trigger: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: 'white',
    },
    triggerText: {
        fontSize: 16,
    },
    contentContainer: {
        flex: 1,
        padding: 20,
    },
    item: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    selectedItem: {
        backgroundColor: '#f0f0f0',
    },
    itemText: {
        fontSize: 16,
    },
});

export default BottomSheetDropdown;