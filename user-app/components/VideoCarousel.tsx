import { PRIMARY_COLOR } from '@/lib/constants';
import React, { useRef, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import YoutubePlayer from 'react-native-youtube-iframe';

const { width } = Dimensions.get('window');

interface VideoCarouselProps {
  data: {
    video_url: string;
    poster?: string;
  }[];
}

export default function VideoCarousel({ data }: VideoCarouselProps) {
  const [loading, SetLoading] = useState(false);

  const playerRefs = useRef<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const handleSnapToItem = (index: number) => {
    setActiveIndex(index);

    // Pause all videos except the current one
    // playerRefs.current.forEach((ref, i) => {
    //   if (ref && i !== index) {
    //     ref?.pause();
    //   }
    // });
  };

  // Extract YouTube video ID from URL
  const getYoutubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
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
          // playerRefs.current.forEach(ref => ref?.pause());
        }}
        renderItem={({ item, index }: any) => (
          <View style={styles.videoContainer}>
            <YoutubePlayer
              ref={(ref) => (playerRefs.current[index] = ref)}
              height={200}
              width={370}
              videoId={getYoutubeVideoId(item?.video_url)}
              play={false}
              onChangeState={(state) => {
                if (state === 'ended') {
                  // Handle video ended
                  console.log('Video ended');
                }
              }}
              onError={(error) => {
                console.log('Video loading error', error);
              }}
              webViewStyle={styles.video}
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
    borderRadius: 10
  },
  video: {
    borderRadius: 10,
    overflow: 'hidden',
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