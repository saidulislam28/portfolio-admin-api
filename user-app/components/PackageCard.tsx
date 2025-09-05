import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'



export default function PackageCard({ book }: any) {
    return (
        <TouchableOpacity key={book.id} style={styles.cardContainer}>
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1747595509327-20fb3e0c3216?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }}
                    style={styles.bookImage}
                    resizeMode="cover"
                />
            </View>

            <View style={styles.contentContainer}>
                <Text style={styles.bookTitle}>
                    {book.title}
                </Text>

                <Text style={styles.author}>
                    {book.author}
                </Text>

                <View style={styles.bottomRow}>
                    <Text style={styles.price}>
                        {book.price}
                    </Text>

                    <View style={styles.ratingContainer}>
                        <Text style={styles.starIcon}>⭐</Text>
                        <Text style={styles.rating}>
                            {book.rating}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#F8F9FC',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        width: 171,
        height: 269,
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 1,
        borderRadius: 8
    },
    bookImage: {
        width: 139,
        height: 160,
        borderRadius: 8,
    },
    contentContainer: {
        flex: 1,
    },
    bookTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#212121',
        marginBottom: 4,
        lineHeight: 22,
    },
    author: {
        fontSize: 12,
        color: '#666666',
        marginBottom: 12,
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333333',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    starIcon: {
        fontSize: 12,
        marginRight: 4,
    },
    rating: {
        fontSize: 12,
        fontWeight: '400',
        color: '#333333',
    },


})
