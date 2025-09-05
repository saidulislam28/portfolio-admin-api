import { View, Text, StyleSheet, Image, TouchableOpacity, ToastAndroid, Linking } from 'react-native'
import React, { useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import { supabase } from '@/utils/SupabaseConfig';
export default function CourseItemsList({ categoryData, setUpdatedRecord }) {

    const [expandItem, setExpandItem] = useState();


    const onDeleteItem = async (id) => {
        const { error } = await supabase.from('CategoryItems')
            .delete()
            .eq('id', id);

        ToastAndroid.show('Item Deleted', ToastAndroid.SHORT);
        setUpdatedRecord(true)
    }

    const openUrl = (url) => {
        if (url) {
            Linking.openURL(url)
        }


    }

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>CourseItemsList</Text>
            <View style={{ marginTop: 20 }}>
                {categoryData?.CategoryItems?.map((item, index) => (
                    <View key={index}>
                        <TouchableOpacity onPress={() => setExpandItem(index)} style={styles.Itemcontainer}>
                            <Image source={{ uri: item.image }} style={styles.image} />
                            <View style={{ flex: 1 }}>
                                <Text>{item.name}</Text>
                                <Text>{item.url}</Text>
                            </View>

                            <Text>${item.cost}</Text>
                        </TouchableOpacity>
                        {
                            expandItem == index &&
                            <View style={styles.actionBtnContainer}>
                                <TouchableOpacity onPress={() => onDeleteItem(item.id)}>
                                    <Ionicons name="trash" size={24} color="red" />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => openUrl(item.url)}>
                                    <Feather name="link" size={24} color="blue" />
                                </TouchableOpacity>

                            </View>
                        }
                        <View style={{ borderWidth: 0.5, borderColor: 'gray', marginTop: 5 }}></View>

                    </View>
                ))}
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        marginTop: 20
    },
    heading: {
        fontWeight: 'bold',
        fontSize: 20
    },
    image: {
        height: 50,
        width: 50,
        borderRadius: 15
    },
    Itemcontainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
        alignItems: 'center',
        marginTop: 10
    },
    actionBtnContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        justifyContent: 'flex-end'

    }
})