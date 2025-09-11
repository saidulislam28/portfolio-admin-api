import { ROUTES } from '@/constants/app.routes';
import { PRIMARY_COLOR } from '@/lib/constants';
import { AntDesign, Feather } from '@expo/vector-icons';
import { API_USER, Get, PACKAGE_SERVICE_TYPE } from '@sm/common';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const OnlineCoursesSection = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    // Filter states
    const [activeFilter, setActiveFilter] = useState('All');
    const [visibleCards, setVisibleCards] = useState(4);

    const router = useRouter();

    useEffect(() => {
        loadPackages();
    }, []);

    const loadPackages = async () => {
        try {
            const response: any = await Get(API_USER.get_packages);
            if (response?.success) {
                const filteredPackages = response?.data?.packages?.filter((pack: any) => pack.service_type === PACKAGE_SERVICE_TYPE.ielts_academic || pack.service_type === PACKAGE_SERVICE_TYPE.ielts_gt || pack.service_type === PACKAGE_SERVICE_TYPE.spoken)
                setPackages(filteredPackages);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to load packages');
        } finally {
            setLoading(false);
        }
    };



    // Get unique service types for filter options
    const serviceTypes = ['All', ...new Set(packages?.map((item: any) => {
        switch (item?.service_type) {
            case 'ielts_gt': return 'IELTS GT';
            case 'ielts_academic': return 'IELTS Academic';
            case 'spoken': return 'Spoken English';

            default: return item?.service_type;
        }
    }))];

    // Filter function
    const filteredData = activeFilter === 'All'
        ? packages
        : packages.filter((item: any) => {
            switch (activeFilter) {
                case 'IELTS GT': return item?.service_type === 'ielts_gt';
                case 'IELTS Academic': return item?.service_type === 'ielts_academic';
                case 'Spoken English': return item?.service_type === 'spoken';
                default: return true;
            }
        });

    // Load more cards when swiping
    const loadMoreCards = () => {
        if (visibleCards < filteredData?.length) {
            setVisibleCards(prev => Math.min(prev + 2, filteredData?.length));
        }
    };

    const handleNavigateToDetails = (itemID: any) => {
        router.push({
            pathname: ROUTES.ONLINE_COURSE_DETAILS,
            params: { id: itemID }
        })
    }

    // Render card item
    const renderCard = ({ item }: any) => (
        <TouchableOpacity
            onPress={() => handleNavigateToDetails(item?.id)}
            style={styles.card}
        >
            <View style={styles.cardHeader}>
                <Image
                    source={{
                        uri: item?.image || "https://images.unsplash.com/photo-1699544129030-6f421d4dfa7c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    }}
                    resizeMode="cover"
                    style={styles.image}
                />
            </View>
            <View style={styles.cardBody}>
                {/* Removed word truncation to show full title */}
                <Text
                    style={styles.cardTitle}
                    numberOfLines={2} // Allow up to 2 lines for longer titles
                    ellipsizeMode="tail" // Add ... at the end if text exceeds 2 lines
                >
                    {item?.name}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={styles.discountedPrice}>BDT {item?.price_bdt}</Text>
                    <Text style={styles.originalPrice}>BDT {item?.price_bdt_original}</Text>
                </View>
            </View>
            <View style={styles.cardFooter}>
                <View style={styles.sub_container}>
                    <AntDesign
                        style={{ marginRight: 4 }}
                        name="staro"
                        size={18}
                        color="orange"
                    />
                    <Text
                        style={styles.cardStats}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {item?.class_count || item?.sessions_count} sessions
                    </Text>
                </View>
                <View style={styles.sub_container}>
                    <Feather name="user" size={18} color="black" />
                    <Text
                        style={styles.cardStats}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {item?.class_duration || 30} mins
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );


    return (
        <View style={styles.container}>
            {/* Filter options */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterContainer}
            >
                {serviceTypes?.map((option) => (
                    <TouchableOpacity
                        key={option}
                        style={[
                            styles.filterButton,
                            activeFilter === option && styles.activeFilterButton
                        ]}
                        onPress={() => {
                            setActiveFilter(option);
                            setVisibleCards(4); // Reset visible cards when filter changes
                        }}
                    >
                        <Text style={[
                            styles.filterText,
                            activeFilter === option && styles.activeFilterText
                        ]}>
                            {option}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Cards */}
            <FlatList
                horizontal
                data={filteredData?.slice(0, visibleCards)}
                renderItem={renderCard}
                keyExtractor={(item) => item?.id?.toString()}
                showsHorizontalScrollIndicator={false}
                onEndReached={loadMoreCards}
                onEndReachedThreshold={0.5}
                contentContainerStyle={styles.cardsContainer}
                snapToInterval={250 + 32} // Card width (250) + marginHorizontal (16*2)
                snapToAlignment="center" // This is crucial for centering
                decelerationRate="fast"
            />
        </View>
    );
};

// ... keep your existing styles unchanged ...
const styles = StyleSheet.create({
    container: {
        padding: 4,
        marginVertical: 4,
        marginBottom: 20
    },
    // image: {
    //     height: 150,
    //     width: "100%",
    //     borderRadius: 8
    // },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    filterContainer: {
        marginBottom: 16,
    },
    filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
    },
    activeFilterButton: {
        backgroundColor: PRIMARY_COLOR,
    },
    filterText: {
        color: '#666',
    },
    activeFilterText: {
        color: 'white',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        marginVertical: 8,
        marginHorizontal: 16, // This creates 16px spacing on both sides
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
        width: 250 // Fixed width as per your design
    },
    cardsContainer: {
        paddingHorizontal: 8, // Optional: Add some padding to the container if needed
    },
    cardHeader: {
        height: 160, // Fixed height for consistent layout
        width: '100%',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    cardBody: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 8,
        minHeight: 70, // Minimum height to accommodate 2-line titles
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
        lineHeight: 22, // Explicit line height for consistency across devices
        marginBottom: 6,
        // Allow text to use full width
    },
    cardPrice: {
        fontSize: 15,
        fontWeight: '700',
        color: PRIMARY_COLOR,
        marginTop: 4,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 5,
        paddingVertical: 12,
        backgroundColor: '#f8f9fa',
        minHeight: 50, // Consistent footer height
    },
    sub_container: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1, // Allow equal distribution of space
        marginHorizontal: 4,
    },
    cardStats: {
        fontSize: 12,
        color: '#666',
        marginLeft: 6,
        fontWeight: '500',
        lineHeight: 16,
        flex: 1, // Allow text to take available space
    },
    discountedPrice: {
        fontSize: 15,
        fontWeight: 'bold',
        color: PRIMARY_COLOR,
    },
    originalPrice: {
        fontSize: 12,
        color: '#888',
        textDecorationLine: 'line-through',
    },

    // sub_container: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     gap: 3
    // }
});

export default OnlineCoursesSection;