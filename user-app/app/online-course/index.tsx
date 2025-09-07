import CommonHeader from '@/components/CommonHeader';
import CarouselComponent from '@/components/StaticCarousel';
import { useAppSettings } from '@/hooks/queries/useAppSettings';
import { PRIMARY_COLOR } from '@/lib/constants';
import { API_USER, Get } from '@sm/common';
import { Link, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import RenderHTML from 'react-native-render-html';

interface Content {
    id: number;
    is_active: boolean;
    values: string;
    image: string;
}

export default function RegistrationLanding() {
    const [content, setContent] = useState<Content>();
    const { width } = useWindowDimensions();
    useEffect(() => {
        const fetchContent = async () => {
            try {
                const data = await Get(API_USER.app_settings);
                setContent(data?.data?.online_course)
            } catch (error) {
                console.error('Failed to fetch content:', error);
            }
        };

        fetchContent();
    }, []);


    const { data: appSettingsData, isLoading, error } = useAppSettings();


    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }


    return (
        <View style={styles.container}>
            <CommonHeader />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Stack.Screen options={{ title: 'Checkout' }} />
                <CarouselComponent content={appSettingsData?.online_course} />
                <RenderHTML
                    contentWidth={width}
                    source={{ html: appSettingsData?.online_course?.values as string }}
                />
            </ScrollView >
            <View style={styles.stickyButtonContainer}>
                <Link href="/online-course/packages" asChild>
                    <TouchableOpacity
                        style={{
                            backgroundColor: PRIMARY_COLOR,
                            padding: 15,
                            borderRadius: 8,
                            alignItems: 'center'
                        }}
                    >
                        <Text style={{ color: 'white', fontSize: 18 }}>Continue</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 150,
    },
    stickyButtonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 30, // Account for safe area
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        elevation: 8, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    backButton: {
        color: PRIMARY_COLOR,
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 10,
        marginTop: 25,
        marginBottom: 5,
    },
    heading: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 16,
        textAlign: 'center',
    },
    offerBox: {
        backgroundColor: '#f8f9fa',
        padding: 15,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#3498db',
        marginBottom: 20,
    },
    imageContainer: {
        alignItems: 'center',
        marginVertical: 20,
        borderRadius: 8
    },
    bookImage: {
        width: 375,
        height: 220,
        borderRadius: 8,
    },
    offerText: {
        fontSize: 16,
        color: '#333',
    },
    highlight: {
        color: '#e74c3c',
        fontWeight: 'bold',
    },
    subHeading: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 10,
    },
    paragraph: {
        fontSize: 15,
        color: '#555',
        marginBottom: 15,
        lineHeight: 22,
    },
    bulletList: {
        marginBottom: 20,
    },
    bulletItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    bulletIcon: {
        color: '#27ae60',
        fontWeight: 'bold',
        marginRight: 8,
        fontSize: 16,
    },
    bulletText: {
        fontSize: 15,
        color: '#333',
        flex: 1,
        lineHeight: 20,
    },
    bold: {
        fontWeight: 'bold',
    },
    italic: {
        fontStyle: 'italic',
    },
    helpBox: {
        backgroundColor: '#e8f4fd',
        padding: 15,
        borderRadius: 8,
        marginBottom: 30,
    },
    helpTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2980b9',
        marginBottom: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
    },
    helpItem: {
        fontSize: 15,
        color: '#333',
        marginBottom: 5,
        marginLeft: 10,
    },
    whatsappNote: {
        marginTop: 10,
        fontSize: 14,
        color: '#333',
    },
    logoSection: {
        alignItems: 'center',
        marginBottom: 30,
    },
    logo: {
        height: 60,
        width: 160,
    },
    partnerLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 5,
    },
});