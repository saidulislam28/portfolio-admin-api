import { useCallService } from '@/services/AgoraCallService';
import { notificationService } from '@/services/NotificationService';
import { useCallControls, useCallInfo, useCallStore } from '@/zustand/callStore';
import { Ionicons } from '@expo/vector-icons';
import { USER_ROLE } from '@sm/common';
import { useKeepAwake } from 'expo-keep-awake';
import { router } from 'expo-router';
import { useSearchParams } from 'expo-router/build/hooks';
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
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RtcSurfaceView, VideoContentHint, VideoViewSetupMode } from 'react-native-agora';

const { width, height } = Dimensions.get('window');

const otherParticipant = 'other'
const appointmentTitle = 'appointmentTitle'

export default function CallScreen() {
  useKeepAwake();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [share, setShare] = useState(false);
  const [screenSharingUid, setScreenSharingUid] = useState<number | null>(null);
  const hideControlsTimeout = useRef<NodeJS.Timeout | null>(null);
  const consultantId = useSearchParams().get("consultant_id");
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
    updateChannelMediaOptions,
    stopScreenCapture,
    startPreview,
  } = useCallService();

  // Timer for call duration
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // useEffect(() => {
  //   const engine = getEngine();
  //   if (!engine) return;

  //   // Listen for user events
  //   engine.addListener('UserJoined', (uid, elapsed) => {
  //     console.log('UserJoined', uid, elapsed);
  //   });

  //   engine.addListener('UserOffline', (uid, reason) => {
  //     console.log('UserOffline', uid, reason);
  //     if (screenSharingUid === uid) {
  //       setScreenSharingUid(null);
  //     }
  //   });

  //   // Listen for screen sharing events
  //   engine.addListener('RemoteVideoStateChanged', (uid, state, reason, elapsed) => {
  //     console.log('RemoteVideoStateChanged', uid, state, reason);
  //     if (state === 1) { // 1 means remote video is decoded and ready to display
  //       // Check if this is a screen share (usually screen share UIDs are higher numbers)
  //       if (uid > 1000) {
  //         setScreenSharingUid(uid);
  //       }
  //     } else if (state === 0) { // 0 means remote video is stopped
  //       if (uid === screenSharingUid) {
  //         setScreenSharingUid(null);
  //       }
  //     }
  //   });

  //   return () => {
  //     engine.removeAllListeners();
  //   };
  // }, [screenSharingUid]);

  useEffect(() => {
    // Set call screen as active
    setCallScreenActive(true);

    // Join channel if we have the necessary data
    if (token && channelName && uid && !isInCall) {
      handleJoinChannel();
    }

    // Start timer
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
    console.log('handleJoinChannel')
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
      consultantId && await notificationService.endCall(Number(consultantId), USER_ROLE.consultant)
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
        setShare(false)
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
          contentHint: VideoContentHint.ContentHintMotion,
        },
      })
      await startPreview()
      setShare(true)
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

  const pan = useRef(new Animated.ValueXY({ x: width - 140, y: 90 })).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        //@ts-ignore
        pan.setOffset({ x: pan.x._value, y: pan.y._value });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (e, gestureState) => {
        //@ts-ignore
        let newX = pan.x._offset + gestureState.dx;
        //@ts-ignore
        let newY = pan.y._offset + gestureState.dy;

        // Define boundaries
        const minX = 0;
        const minY = 0;
        const maxX = width - 120;  // 120 = video width
        const maxY = height - 160 - 80; // 160 = video height, 80 = safe space for bottom UI

        // Clamp values
        newX = Math.max(minX, Math.min(newX, maxX));
        newY = Math.max(minY, Math.min(newY, maxY));

        // Update position
        //@ts-ignore
        pan.x.setValue(newX - pan.x._offset);
        //@ts-ignore
        pan.y.setValue(newY - pan.y._offset);
      },
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    })
  ).current;




  if (isConnecting) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <View style={styles.loadingContent}>
          <Text style={styles.loadingText}>Connecting...</Text>
          <Text style={styles.loadingSubtext}>
            {appointmentTitle || 'Preparing your call'}
          </Text>
        </View>
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
        {/* Screen sharing video (if active) */}
        {screenSharingUid ? (
          <RtcSurfaceView
            style={styles.remoteVideo}
            canvas={{
              uid: screenSharingUid,
              setupMode: VideoViewSetupMode.VideoViewSetupReplace,
            }}
          />
        ) : null}

        {/* Remote video (if no screen sharing or as PIP) */}
        {participants.length > 0 && (
          <RtcSurfaceView
            style={[
              styles.remoteVideo,
              screenSharingUid ? styles.pipVideo : null
            ]}
            canvas={{
              //@ts-ignore
              uid: participants[0].uid,
              setupMode: VideoViewSetupMode.VideoViewSetupReplace,
            }}
          />
        )}

        {/* Local video */}
        {!isVideoMuted && (
          <Animated.View
            {...panResponder.panHandlers}
            style={[
              styles.localVideoContainer,
              {
                transform: pan.getTranslateTransform(),
              },
              isFullScreen && styles.localVideoFullscreen,
              screenSharingUid ? styles.localVideoScreenSharing : null,
            ]}
          >
            <RtcSurfaceView
              style={styles.localVideo}
              canvas={{
                uid: 0,
                setupMode: VideoViewSetupMode.VideoViewSetupReplace,
              }}
              zOrderMediaOverlay
            />
          </Animated.View>
        )}

        {/* Call info overlay */}
        {showControls && (
          <View style={styles.callInfoOverlay}>
            <Text style={styles.participantName}>
              {otherParticipant?.name || 'Unknown'}
            </Text>
            <Text style={styles.callDuration}>
              {formatDuration(callDuration)}
            </Text>
            {screenSharingUid && (
              <Text style={styles.screenShareIndicator}>Screen Sharing Active</Text>
            )}
          </View>
        )}

        {/* Controls overlay */}
        {showControls && (
          <View style={styles.controlsOverlay}>
            {/* Top controls */}
            <View style={styles.topControls}>
              <TouchableOpacity
                style={styles.topControlButton}
                onPress={handleMinimize}
              >
                <Ionicons name="chevron-down" size={24} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.topControlButton}
                onPress={handleSwitchCamera}
              >
                <Ionicons name="camera-reverse" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Bottom controls */}
            <View style={styles.bottomControls}>
              <TouchableOpacity
                style={[
                  styles.controlButton,
                  isAudioMuted && styles.controlButtonMuted
                ]}
                onPress={handleToggleAudio}
              >
                <Ionicons
                  name={isAudioMuted ? "mic-off" : "mic"}
                  size={24}
                  color="#FFFFFF"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.endCallButton}
                onPress={handleEndCall}
              >
                <Ionicons name="call" size={28} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.controlButton,
                  isVideoMuted && styles.controlButtonMuted
                ]}
                onPress={handleToggleVideo}
              >
                <Ionicons
                  name={isVideoMuted ? "videocam-off" : "videocam"}
                  size={24}
                  color="#FFFFFF"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.controlButton,
                  isSpeakerOn && styles.controlButtonActive
                ]}
                onPress={handleToggleSpeaker}
              >
                <Ionicons
                  name={isSpeakerOn ? "volume-high" : "volume-medium"}
                  size={24}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
              {/* <TouchableOpacity
                style={[styles.controlButton, {
                  backgroundColor: share ? "red" : styles.controlButton.backgroundColor
                }]}
                onPress={handleScreenShare}
              >
                <MaterialIcons name="mobile-screen-share" size={24} color="#FFFFFF" />
              </TouchableOpacity> */}
            </View>
          </View>
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
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  remoteVideo: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  pipVideo: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 120,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    zIndex: 10,
  },
  localVideoContainer: {
    width: 120,
    height: 160,
    position: 'absolute',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    zIndex: 100,
  },
  localVideoScreenSharing: {
    top: 20,
    right: 160, // Position to the left of the PIP video
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
  callInfoOverlay: {
    position: 'absolute',
    top: 30,
    left: 20,
    right: 160,
    zIndex: 20,
  },
  participantName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  callDuration: {
    fontSize: 14,
    color: '#D1D5DB',
  },
  screenShareIndicator: {
    fontSize: 14,
    color: '#4ADE80',
    fontWeight: '600',
    marginTop: 8,
  },
  controlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    zIndex: 20,
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  topControlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 50,
    gap: 20,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonMuted: {
    backgroundColor: 'rgba(239, 68, 68, 0.8)',
  },
  controlButtonActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.8)',
  },
  endCallButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
});