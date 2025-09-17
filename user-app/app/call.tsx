import { CallControls } from '@/components/call/CallControls';
import { CallInfoOverlay } from '@/components/call/CallInfoOverlay';
import { LoadingScreen } from '@/components/call/LoadingScreen';
import { VideoViews } from '@/components/call/VideoViews';
import { useCallService } from '@/services/AgoraCallService';
import { useCallControls, useCallInfo, useCallStore } from '@/zustand/callStore';
import { useKeepAwake } from 'expo-keep-awake';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, PanResponder } from 'react-native';
import {
  Alert,
  Dimensions,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';


const { width, height } = Dimensions.get('window');

export default function CallScreen() {
  useKeepAwake();
  const [showControls, setShowControls] = useState(true);
  const [share, setShare] = useState(false);
  const [screenSharingUid, setScreenSharingUid] = useState<number | null>(null);
  const hideControlsTimeout = useRef<NodeJS.Timeout | null>(null);
  
  const {
    isInCall,
    isConnecting,
    channelName,
    token,
    uid,
    participants,
    setCallScreenActive,
    endCall,
  } = useCallStore();

  const {
    isAudioMuted,
    isVideoMuted,
    isSpeakerOn,
    toggleAudio,
    toggleVideo,
    toggleSpeaker,
  } = useCallControls();

  const {
    appointmentTitle,
    otherParticipant,
    callDuration,
  } = useCallInfo();

  const {
    joinChannel,
    leaveChannel,
    toggleMicrophone,
    toggleCamera,
    switchCamera,
    enableSpeakerphone,
    getEngine,
    startScreenCapture,
    stopScreenCapture,
  } = useCallService();

  // Timer for call duration
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const pan = useRef(new Animated.ValueXY({ x: width - 140, y: 90 })).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({ x: pan.x._value, y: pan.y._value });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (e, gestureState) => {
        let newX = pan.x._offset + gestureState.dx;
        let newY = pan.y._offset + gestureState.dy;

        // Define boundaries
        const minX = 0;
        const minY = 0;
        const maxX = width - 120;
        const maxY = height - 160 - 80;

        // Clamp values
        newX = Math.max(minX, Math.min(newX, maxX));
        newY = Math.max(minY, Math.min(newY, maxY));

        // Update position
        pan.x.setValue(newX - pan.x._offset);
        pan.y.setValue(newY - pan.y._offset);
      },
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    })
  ).current;

  useEffect(() => {
    setCallScreenActive(true);

    if (token && channelName && uid && !isInCall) {
      handleJoinChannel();
    }

    if (isInCall) {
      startDurationTimer();
    }

    return () => {
      setCallScreenActive(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [token, channelName, uid, isInCall]);

  const checkAndRequestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.CAMERA,
        ]);

        return (
          grants['android.permission.RECORD_AUDIO'] === 'granted' &&
          grants['android.permission.CAMERA'] === 'granted'
        );
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const handleJoinChannel = async () => {
    if (!token || !channelName || uid === null) {
      Alert.alert('Error', 'Missing call information');
      return;
    }

    const hasPermissions = await checkAndRequestPermissions();
    if (!hasPermissions) {
      throw new Error('Permissions not granted');
    }

    try {
      await joinChannel(token, channelName, uid);
    } catch (error) {
      console.error('Failed to join channel:', error);
      Alert.alert('Call Failed', 'Unable to join the call. Please try again.');
      router.back();
    }
  };

  const startDurationTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      // Timer is handled in the store
    }, 1000);
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = async () => {
    try {
      await leaveChannel();
      endCall();
      router.back();
    } catch (error) {
      console.error('Error ending call:', error);
      endCall();
      router.back();
    }
  };

  const handleToggleAudio = async () => {
    try {
      await toggleMicrophone(!isAudioMuted);
      toggleAudio();
    } catch (error) {
      console.error('Error toggling audio:', error);
    }
  };

  const handleToggleVideo = async () => {
    try {
      await toggleCamera(!isVideoMuted);
      toggleVideo();
    } catch (error) {
      console.error('Error toggling video:', error);
    }
  };

  const handleToggleSpeaker = async () => {
    try {
      await enableSpeakerphone(!isSpeakerOn);
      toggleSpeaker();
    } catch (error) {
      console.error('Error toggling speaker:', error);
    }
  };

  const handleSwitchCamera = async () => {
    try {
      await switchCamera();
    } catch (error) {
      console.error('Error switching camera:', error);
    }
  };

  const handleScreenShare = async () => {
    try {
      if (share) {
        await stopScreenCapture();
        setShare(false);
        return;
      }
      await startScreenCapture({
        captureAudio: true,
        audioParams: {
          sampleRate: 16000,
          channels: 2,
          captureSignalVolume: 100,
        },
        captureVideo: true,
        videoParams: {
          dimensions: { width, height },
          frameRate: 15,
          bitrate: 0,
        },
      });
      setShare(true);
    } catch (error) {
      console.error('Error Sharing Screen:', error);
    }
  };

  const handleScreenTap = () => {
    setShowControls(!showControls);
  };

  const handleMinimize = () => {
    setCallScreenActive(false);
    router.back();
  };

  if (isConnecting) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <LoadingScreen appointmentTitle={appointmentTitle} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <TouchableOpacity
        style={styles.videoContainer}
        onPress={handleScreenTap}
        activeOpacity={1}
      >
        <VideoViews
          screenSharingUid={screenSharingUid}
          participants={participants}
          isVideoMuted={isVideoMuted}
          panHandlers={panResponder.panHandlers}
          panStyle={{
            transform: pan.getTranslateTransform(),
          }}
        />

        {showControls && (
          <>
            <CallInfoOverlay
              participantName={otherParticipant?.name || 'Unknown'}
              callDuration={formatDuration(callDuration)}
              screenSharingUid={screenSharingUid}
            />

            <CallControls
              onMinimize={handleMinimize}
              onSwitchCamera={handleSwitchCamera}
              onToggleAudio={handleToggleAudio}
              onEndCall={handleEndCall}
              onToggleVideo={handleToggleVideo}
              onToggleSpeaker={handleToggleSpeaker}
              isAudioMuted={isAudioMuted}
              isVideoMuted={isVideoMuted}
              isSpeakerOn={isSpeakerOn}
            />
          </>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
});