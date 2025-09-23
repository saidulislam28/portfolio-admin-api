import { PRIMARY_COLOR } from '@/lib/constants';
import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { runOnJS, useAnimatedReaction, useSharedValue } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';

const { width } = Dimensions.get('window');

interface ContentProps {
    image: string;
    image1: string;
    image2: string;
    [key: string]: any;
}

interface CarouselProps {
    content: ContentProps;
}

const CarouselComponent: React.FC<CarouselProps> = ({ content }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const progressValue = useSharedValue(0);
    // console.log("width from carousel", width);
    // Get all image keys from the content object
    const imageKeys = ['image', 'image1', 'image2'];

    // Check if content exists before rendering
    if (!content) {
        return null; // or return a loading/placeholder component
    }

    // Sync shared value to React state
    useAnimatedReaction(
        () => Math.round(progressValue.value),
        (currentIndex) => {
            runOnJS(setActiveIndex)(currentIndex);
        },
        []
    );

    const renderItem = ({ index }: { index: number }) => {
        const imageKey = imageKeys[index];
        const imageUri = content[imageKey];

        // Check if image URI exists
        if (!imageUri) {
            return (
                <View style={[styles.imageContainer, styles.placeholder]}>
                    {/* Placeholder content */}
                </View>
            );
        }

        return (
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: imageUri }}
                    style={styles.image}
                    resizeMode="cover"
                />
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Carousel
                loop
                width={width}
                height={200}
                autoPlay
                autoPlayInterval={3000}
                data={imageKeys}
                scrollAnimationDuration={1000}
                renderItem={renderItem}
                mode="parallax"
                modeConfig={{
                    parallaxScrollingScale: 0.9,
                    parallaxScrollingOffset: 50,
                }}
                onProgressChange={(_, absoluteProgress) => {
                    progressValue.value = absoluteProgress;
                }}
            />

            {/* Pagination Dots */}
            <View style={styles.pagination}>
                {imageKeys.map((_, index) => (
                    <View
                        key={`dot-${index}`}
                        style={[
                            styles.dot,
                            activeIndex === index ? styles.activeDot : styles.inactiveDot
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};

// Set default props
CarouselComponent.defaultProps = {
    content: {
        image: '',
        image1: '',
        image2: ''
    }
};

const styles = StyleSheet.create({
    container: {
        height: 220,
        marginTop: 24,
        alignItems: 'center',
    },
    imageContainer: {

    },
    image: {
        width: width,
        height: 200,
        resizeMode: 'cover',
        borderRadius: 10,

    },
    placeholder: {
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    activeDot: {
        backgroundColor: PRIMARY_COLOR,
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    inactiveDot: {
        backgroundColor: '#e0e0e0',
    },
});

export default CarouselComponent;