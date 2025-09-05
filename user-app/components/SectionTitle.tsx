import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface props {
    title: string;
    link?: string
}

export default function SectionTitle({ title, link }: props) {

    const router = useRouter();

    return (
        <View style={styles.titleContainer}>
            <Text style={styles.titleText}>{title}</Text>
            {link && <TouchableOpacity onPress={() => router.push(link as any)}>
                <MaterialIcons name="chevron-right" size={24} color="black" />
            </TouchableOpacity>}
        </View>
    )
};

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16
    },
    titleText: {
        fontSize: 18,
        fontWeight: 600,
    }
})
