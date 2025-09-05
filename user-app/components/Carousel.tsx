import { PRIMARY_COLOR } from '@/lib/constants';
import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { runOnJS, useAnimatedReaction, useSharedValue } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';

const { width } = Dimensions.get('window');
export default function CarouselComponent({ data }: any) {
    const progressValue = useSharedValue(0);
    const [activeIndex, setActiveIndex] = useState(0);
    useAnimatedReaction(
        () => Math.round(progressValue.value),
        (currentIndex) => {
            runOnJS(setActiveIndex)(currentIndex);
        },
        []
    );

    const renderItem = ({ item }: { item: any }) => (
        <Image source={{ uri: item?.url }} style={styles.image} />
    );

    const PaginationItem = ({ isActive }: { isActive: boolean }) => (
        <View style={[styles.dot, isActive && styles.activeDot]} />
    );

    return (
        <View style={styles.CarouselContainer}>
            <Carousel
                loop
                width={width}
                height={200}
                autoPlay
                autoPlayInterval={3000}
                data={data}
                scrollAnimationDuration={1000}
                renderItem={renderItem}
                mode="parallax"
                modeConfig={{
                    parallaxScrollingScale: 0.9,
                    parallaxScrollingOffset: 50,
                }}
                style={styles.carousel}
                onProgressChange={(offsetProgress, absoluteProgress) => {
                    progressValue.value = absoluteProgress;
                }}
            />

            {/* Pagination Dots */}
            <View style={styles.paginationContainer}>
                {data?.map((_: any, index: number) => (
                    <PaginationItem key={index} isActive={activeIndex === index} />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    CarouselContainer: {
        height: 220,
        marginTop: 24,
        alignItems: 'center',
    },
    carousel: {
        width: width,
    },
    image: {
        width: 400,
        height: 200,
        resizeMode: 'cover',
        borderRadius: 10,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#E0E0E0',
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: PRIMARY_COLOR,
        width: 10,
        height: 10,
        borderRadius: 5,
    },
});
