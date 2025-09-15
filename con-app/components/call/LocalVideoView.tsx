import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RtcSurfaceView, VideoViewSetupMode } from 'react-native-agora';
import { Ionicons } from '@expo/vector-icons';
import Animated from 'react-native-reanimated';

interface LocalVideoViewProps {
  isScreenSharing: boolean;
  isVideoMuted: boolean;
  localVideoUid: number;
  panHandlers: any;
  panX: number;
  panY: number;
  isFullScreen: boolean;
}

export const LocalVideoView: React.FC<LocalVideoViewProps> = ({
  isScreenSharing,
  isVideoMuted,
  localVideoUid,
  panHandlers,
  panX,
  panY,
  isFullScreen,
}) => {
  if (isVideoMuted && !isScreenSharing) return null;

  return (
    <Animated.View
      {...panHandlers}
      style={[
        styles.localVideoContainer,
        {
          transform: [{ translateX: panX }, { translateY: panY }],
        },
        isFullScreen && styles.localVideoFullscreen,
      ]}
    >
      <RtcSurfaceView
        style={styles.localVideo}
        canvas={{
          uid: localVideoUid,
          setupMode: VideoViewSetupMode.VideoViewSetupAdd,
        }}
        zOrderMediaOverlay
      />
      {isScreenSharing && (
        <View style={styles.screenShareIndicator}>
          <Ionicons name="desktop" size={12} color="#FFFFFF" />
          <Text style={styles.screenShareText}>Screen</Text>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  localVideoContainer: {
    position: 'absolute',
    width: 120,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    zIndex: 100,
  },
  localVideoFullscreen: {
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    borderRadius: 0,
    borderWidth: 0,
  },
  localVideo: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  screenShareIndicator: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  screenShareText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
});