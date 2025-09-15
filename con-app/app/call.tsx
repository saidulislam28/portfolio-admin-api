import { useCallService } from '@/services/AgoraCallService';
import { stopAudioService } from '@/services/AudioService';
import {
  useCallControls,
  useCallInfo,
  useCallStore,
} from '@/zustand/callStore';
import { useLoading } from '@/zustand/commonStore';
import { Ionicons } from '@expo/vector-icons';
import { sendCallEndNotificationToUser, USER_ROLE } from '@sm/common';
import { useKeepAwake } from 'expo-keep-awake';
import { router } from 'expo-router';
import { useLocalSearchParams, useSearchParams } from 'expo-router/build/hooks';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  PanResponder,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RtcSurfaceView, VideoViewSetupMode } from 'react-native-agora';
import EndCallConfirmationBottomSheet from '@/components/call/EndCallConfirmationBottomSheet';
import { PACKAGE_SERVICE_TYPE } from '@/lib/constants';
import { ROUTES } from '@/constants/app.routes';
import { LoadingView } from '@/components/call/LoadingView';
import { LocalVideoView } from '@/components/call/LocalVideoView';
import { CallInfoOverlay } from '@/components/call/CallInfoOverlay';
import { CallControls } from '@/components/call/CallControls';

const { width, height } = Dimensions.get('window');

const appointmentTitle = 'appointmentTitle';

export default function CallScreen() {
  useKeepAwake();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const params = useLocalSearchParams();
  const userId = params.user_id;
  const appointmentId = params.appointment_id;
  const service_type = params.service_type;
  const { setLoading } = useLoading();

  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const {
    isInCall,
    isConnecting,
    channelName,
    token,
    uid,
    participants,
    setCallScreenActive,
    endCall,
    isScreenSharing,
    startScreenSharing,
    stopScreenSharing,
  } = useCallStore();

  const {
    isAudioMuted,
    isVideoMuted,
    isSpeakerOn,
    toggleAudio,
    toggleVideo,
    toggleSpeaker,
  } = useCallControls();

  const { otherParticipant, callDuration } = useCallInfo();

  const {
    joinChannel,
    leaveChannel,
    toggleMicrophone,
    toggleCamera,
    switchCamera,
    enableSpeakerphone,
    startScreenCapture,
    stopScreenCapture,
    startScreenShareVirtualUser,
  } = useCallService();

  const timerRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleEndCallPress = () => {
    setIsBottomSheetOpen(true);
  };

  const handleCancelEndCall = () => {
    setIsBottomSheetOpen(false);
  };

  const handleConfirmEndCall = async () => {
    setIsBottomSheetOpen(false);
    await performEndCall(true);
  };

  const handleEndCallWithoutFeedback = async () => {
    setIsBottomSheetOpen(false);
    await endCall();
    router.back();
  };

  const performEndCall = async (needsFeedback: boolean) => {
    setLoading(true);
    try {
      await leaveChannel();
      await endCall();
      stopAudioService();
      sendCallEndNotificationToUser(Number(appointmentId));

      if (service_type === PACKAGE_SERVICE_TYPE.speaking_mock_test) {
        if (needsFeedback) {
          return router.push({
            pathname: ROUTES.MOCK_FEEDBACK_PAGE as any,
            params: {
              consultant_id: `${userId}`,
              appointment_id: `${appointmentId}`,
            },
          });
        }
      } else if (needsFeedback) {
        router.push({
          pathname: ROUTES.CONVERSATION_FEEDBACK_PAGE as any,
          params: {
            consultant_id: `${userId}`,
            appointment_id: `${appointmentId}`,
          },
        });
      } else {
        router.back();
      }

    } catch (error) {
      console.error('Error ending call:', error);
      router.back();
    } finally {
      if (userId) {
        await sendCallEndNotificationToUser(Number(appointmentId));
      }
      setLoading(false);
    }
  };

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

  const checkAndRequestScreenSharePermissions = async () => {
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
    timerRef.current = setInterval(() => { }, 1000);
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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

  const handleToggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const hasPermissions = await checkAndRequestScreenSharePermissions();
        if (!hasPermissions) {
          Alert.alert(
            'Permission Required',
            'Screen recording permission is required for screen sharing.'
          );
          return;
        }

        if (Platform.OS === 'android') {
          Alert.alert(
            'Screen Share',
            'You will be asked to allow screen recording. Please tap "Start now" to begin sharing your screen.',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Start now',
                onPress: async () => {
                  try {
                    await startScreenCapture();
                    await startScreenSharing();
                  } catch (error) {
                    console.error('Error starting screen share:', error);
                    Alert.alert(
                      'Error',
                      'Failed to start screen sharing. Please try again.'
                    );
                  }
                },
              },
            ]
          );
        } else {
          try {
            await startScreenCapture();
            await startScreenSharing();
          } catch (error) {
            console.error('Error starting screen share:', error);
            Alert.alert(
              'Error',
              'Failed to start screen sharing. Please try again.'
            );
          }
        }
      } else {
        await stopScreenCapture();
        await stopScreenSharing();
      }
    } catch (error) {
      console.error('Error toggling screen share:', error);
      Alert.alert(
        'Error',
        'Failed to toggle screen sharing. Please try again.'
      );
    }
  };

  const handleScreenTap = () => {
    setShowControls(!showControls);
  };

  const handleMinimize = () => {
    setCallScreenActive(false);
    router.back();
  };

  const getLocalVideoUid = () => {
    return isScreenSharing ? uid + 1 : 0;
  };

  const shouldShowLocalVideo = () => {
    return !isVideoMuted || isScreenSharing;
  };

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

        const minX = 0;
        const minY = 0;
        const maxX = width - 120;
        const maxY = height - 160 - 80;

        newX = Math.max(minX, Math.min(newX, maxX));
        newY = Math.max(minY, Math.min(newY, maxY));

        pan.x.setValue(newX - pan.x._offset);
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
        <LoadingView appointmentTitle={appointmentTitle} />
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
        {/* Remote video */}
        {participants.length > 0 && (
          <RtcSurfaceView
            style={styles.remoteVideo}
            canvas={{
              uid: participants[0].uid,
            }}
          />
        )}

        {/* Local video */}
        <LocalVideoView
          isScreenSharing={isScreenSharing}
          isVideoMuted={isVideoMuted}
          localVideoUid={getLocalVideoUid()}
          panHandlers={panResponder.panHandlers}
          panX={pan.x._value}
          panY={pan.y._value}
          isFullScreen={isFullScreen}
        />

        {/* Call info overlay */}
        {showControls && (
          <CallInfoOverlay
            participantName={otherParticipant?.name}
            callDuration={formatDuration(callDuration)}
            isScreenSharing={isScreenSharing}
          />
        )}

        {/* Controls overlay */}
        {showControls && (
          <CallControls
            isAudioMuted={isAudioMuted}
            isVideoMuted={isVideoMuted}
            isSpeakerOn={isSpeakerOn}
            isScreenSharing={isScreenSharing}
            onToggleAudio={handleToggleAudio}
            onToggleVideo={handleToggleVideo}
            onToggleSpeaker={handleToggleSpeaker}
            onToggleScreenShare={handleToggleScreenShare}
            onSwitchCamera={handleSwitchCamera}
            onMinimize={handleMinimize}
            onEndCall={handleEndCallPress}
          />
        )}
      </TouchableOpacity>

      <EndCallConfirmationBottomSheet
        isBottomSheetOpen={isBottomSheetOpen}
        onEndCallWithFeedback={handleConfirmEndCall}
        onEndCallWithoutFeedback={handleEndCallWithoutFeedback}
        onCancel={handleCancelEndCall}
        onChange={setIsBottomSheetOpen}
      />
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
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  remoteVideo: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});