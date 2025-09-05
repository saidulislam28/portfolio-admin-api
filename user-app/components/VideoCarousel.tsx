import { PRIMARY_COLOR } from '@/lib/constants';
import { AVPlaybackStatus, ResizeMode, Video } from 'expo-av';
import React, { useRef, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const { width } = Dimensions.get('window');

export default function VideoCarousel({ data }: any) {
  const [loading, SetLoading] = useState(false);

  const videoRefs = useRef<(Video | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const handleSnapToItem = (index: number) => {
    setActiveIndex(index);

    // Pause all videos except the current one
    videoRefs.current.forEach((ref, i) => {
      if (ref && i !== index) {
        ref.pauseAsync();
      }
    });

    // Play the current video
    if (videoRefs.current[index]) {
      videoRefs.current[index]?.playAsync();
    }
  };


  const PaginationItem = ({ isActive }: { isActive: boolean }) => (
    <View style={[styles.dot, isActive && styles.activeDot]} />
  );

  return (
    <View style={styles.container}>
      <Carousel
        width={width}
        height={300}
        data={data}
        loop
        onSnapToItem={handleSnapToItem}
        onScrollEnd={() => {
          // Pause all videos when scrolling begins
          videoRefs.current.forEach(ref => ref?.pauseAsync());
        }}
        renderItem={({ item, index }: any) => (
          <View style={styles.videoContainer}>
            <Video
              ref={(ref) => (videoRefs.current[index] = ref)}
              source={{ uri: item?.video_url }}
              style={styles.video}
              resizeMode={ResizeMode.COVER}
              isLooping
              useNativeControls={true}
              shouldPlay={false}
              
              posterSource={{ uri: item?.poster }}
              posterStyle={styles.poster}
              onPlaybackStatusUpdate={(status: AVPlaybackStatus) => {
                if (!status.isLoaded) {
                  // Handle error state
                  console.log('Video loading error');
                }
              }}
            />

            <View style={styles.paginationContainer}>
              {data?.map((_: any, index: number) => (
                <PaginationItem key={index} isActive={activeIndex === index} />
              ))}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 250,
    alignItems: 'center',

  },
  videoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    width: 370,
    height: 200,
    backgroundColor: '#000',
    borderRadius: 10
  },
  poster: {
    resizeMode: 'cover',
  },
  infoContainer: {
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
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