import { useCallService } from '@/services/AgoraCallService';
import { stopAudioService } from '@/services/AudioService';
import { useCallControls, useCallInfo, useCallStore } from '@/zustand/callStore';
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
import { RtcSurfaceView, VideoViewSetupMode, } from 'react-native-agora';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { PACKAGE_SERVICE_TYPE } from '@/lib/constants';
import { ROUTES } from '@/constants/app.routes';
const { width, height } = Dimensions.get('window');

const appointmentTitle = 'appointmentTitle'


export default function CallScreen() {
  useKeepAwake();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showEndCallConfirmation, setShowEndCallConfirmation] = useState(false);
  const hideControlsTimeout = useRef<NodeJS.Timeout | null>(null);
  const params = useLocalSearchParams();
  const userId = params.user_id;
  const appointmentId = params.appointment_id;
  const service_type = params.service_type;
  const { setLoading } = useLoading();

  // console.log("service type from call page>>", service_type)

  // Bottom sheet ref
  const bottomSheetRef = useRef<BottomSheet>(null);

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
    stopScreenSharing
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
    startScreenCapture,
    stopScreenCapture,
    startScreenShareVirtualUser
  } = useCallService();

  // Timer for call duration
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // console.log({ token, channelName, uid, isInCall }, token && channelName && uid && !isInCall)

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

  useEffect(() => {
    if (showEndCallConfirmation) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [showEndCallConfirmation]);

  const handleEndCallPress = () => {
    setShowEndCallConfirmation(true);
  };

  const handleCancelEndCall = () => {
    setShowEndCallConfirmation(false);
  };

  const handleConfirmEndCall = async () => {
    setShowEndCallConfirmation(false);
    await performEndCall();
  };

  const performEndCall = async () => {
    console.log("hitting end call")
    setLoading(true)
    try {
      await leaveChannel();
      await endCall();
      stopAudioService();
      sendCallEndNotificationToUser(Number(appointmentId))
      console.log("hitting end call 11")

      if (service_type === PACKAGE_SERVICE_TYPE.speaking_mock_test) {
        return router.push({
          pathname: ROUTES.MOCK_FEEDBACK_PAGE as any,
          params: {
            consultant_id: JSON.stringify(userId),
            appointment: JSON.stringify({ id: appointmentId }),
          }
        });
      }

      router.push({
        pathname: ROUTES.CONVERSATION_FEEDBACK_PAGE as any,
        params: {
          consultant_id: JSON.stringify(userId),
          appointment: JSON.stringify({ id: appointmentId }),
        }
      });

      console.log("hitting end call 2")


    } catch (error) {
      console.error('Error ending call:', error);
      router.back();
    } finally {
      if (userId) {
        await sendCallEndNotificationToUser(Number(appointmentId)); // TODO fix hardcoded
      }
      setLoading(false);
    }
  };


  // Auto-hide controls
  //   useEffect(() => {
  //     if (showControls) {
  //       if (hideControlsTimeout.current) {
  //         clearTimeout(hideControlsTimeout.current);
  //       }
  //       hideControlsTimeout.current = setTimeout(() => {
  //         setShowControls(false);
  //       }, 5000);
  //     }

  //     return () => {
  //       if (hideControlsTimeout.current) {
  //         clearTimeout(hideControlsTimeout.current);
  //       }
  //     };
  //   }, [showControls]);

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
    // if (Platform.OS === 'android') {
    //   try {
    //     // For Android API level 29 and above, we need to handle media projection
    //     const grants = await PermissionsAndroid.requestMultiple([
    //       PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    //       PermissionsAndroid.PERMISSIONS.FOREGROUND_SERVICE,
    //     ]);

    //     return (
    //       grants['android.permission.RECORD_AUDIO'] === 'granted' &&
    //       grants['android.permission.FOREGROUND_SERVICE'] === 'granted'
    //     );
    //   } catch (err) {
    //     console.warn('Screen share permission error:', err);
    //     return false;
    //   }
    // }
    // iOS handles screen recording permissions through the system
    return true;
  };

  const handleJoinChannel = async () => {
    // console.log('handleJoinChannel')
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
    setLoading(true)
    try {
      await leaveChannel();
      await endCall();
      stopAudioService();
    } catch (error) {
      console.error('Error ending call:', error);
    } finally {
      userId && await sendCallEndNotificationToUser(3); // TODO fix hardcoded
      setLoading(false);
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

  const handleToggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        // Start screen sharing
        const hasPermissions = await checkAndRequestScreenSharePermissions();
        if (!hasPermissions) {
          Alert.alert('Permission Required', 'Screen recording permission is required for screen sharing.');
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
                    // const userId = 100;
                    // const response = await callApi.getAgoraToken({
                    //   channelName: channelName as string,
                    //   userId,
                    // });
                    // const { token } = response;
                    // await startScreenShareVirtualUser(token, channelName as string, userId)
                    await startScreenCapture();
                    await startScreenSharing();
                  } catch (error) {
                    console.error('Error starting screen share:', error);
                    Alert.alert('Error', 'Failed to start screen sharing. Please try again.');
                  }
                }
              }
            ]
          );
        } else {
          // iOS
          try {
            await startScreenCapture();
            await startScreenSharing();
          } catch (error) {
            console.error('Error starting screen share:', error);
            Alert.alert('Error', 'Failed to start screen sharing. Please try again.');
          }
        }
      } else {
        // Stop screen sharing
        await stopScreenCapture();
        await stopScreenSharing();
      }
    } catch (error) {
      console.error('Error toggling screen share:', error);
      Alert.alert('Error', 'Failed to toggle screen sharing. Please try again.');
    }
  };

  const handleScreenTap = () => {
    setShowControls(!showControls);
  };

  const handleMinimize = () => {
    setCallScreenActive(false);
    router.back();
  };

  // Function to get the current user's video uid
  const getLocalVideoUid = () => {
    //@ts-ignore
    return isScreenSharing ? uid + 1 : 0; // Use different uid for screen share
  };

  // Function to check if we should show local video
  const shouldShowLocalVideo = () => {
    return !isVideoMuted || isScreenSharing;
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

  console.log('params:', userId, appointmentId, service_type)
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <TouchableOpacity
        style={styles.videoContainer}
        onPress={handleScreenTap}
        activeOpacity={1}
      >
        {/* Remote video - Show remote participant's video */}
        {participants.length > 0 && (
          <RtcSurfaceView
            style={styles.remoteVideo}
            canvas={{
              //@ts-ignore
              uid: participants[0].uid,
            }}
          />
        )}

        {/* Local video - Always show when video is enabled or screen sharing */}
        {shouldShowLocalVideo() && (
          <Animated.View
            {...panResponder.panHandlers}
            style={[
              styles.localVideoContainer,
              {
                transform: pan.getTranslateTransform(),
              },
              isFullScreen && styles.localVideoFullscreen
            ]}>
            <RtcSurfaceView
              style={styles.localVideo}
              canvas={{
                uid: getLocalVideoUid(),
                setupMode: VideoViewSetupMode.VideoViewSetupAdd,
              }}
              zOrderMediaOverlay
            />
            {/* Screen sharing indicator */}
            {isScreenSharing && (
              <View style={styles.screenShareIndicator}>
                <Ionicons name="desktop" size={12} color="#FFFFFF" />
                <Text style={styles.screenShareText}>Screen</Text>
              </View>
            )}
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
            {isScreenSharing && (
              <Text style={styles.screenSharingStatus}>
                📱 Screen Sharing
              </Text>
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
                disabled={isScreenSharing}
              >
                <Ionicons
                  name="camera-reverse"
                  size={24}
                  color={isScreenSharing ? "#9CA3AF" : "#FFFFFF"}
                />
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
                onPress={handleEndCallPress} // Changed to show confirmation
              >
                <Ionicons name="call" size={28} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.controlButton,
                  isVideoMuted && styles.controlButtonMuted
                ]}
                onPress={handleToggleVideo}
                disabled={isScreenSharing}
              >
                <Ionicons
                  name={isVideoMuted ? "videocam-off" : "videocam"}
                  size={24}
                  color={isScreenSharing ? "#9CA3AF" : "#FFFFFF"}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.controlButton,
                  isScreenSharing && styles.controlButtonActive
                ]}
                onPress={handleToggleScreenShare}
              >
                <Ionicons
                  name={isScreenSharing ? "desktop" : "desktop-outline"}
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
            </View>
          </View>
        )}
      </TouchableOpacity>

      {/* End Call Confirmation Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={['40%']}
        enablePanDownToClose
        onClose={() => setShowEndCallConfirmation(false)}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
          />
        )}
      >
        <BottomSheetView style={styles.bottomSheetContent}>
          <View style={styles.bottomSheetHeader}>
            <Ionicons name="call" size={32} color="#EF4444" />
            <Text style={styles.bottomSheetTitle}>End Call?</Text>
            <Text style={styles.bottomSheetDescription}>
              Are you sure you want to end this call? You'll be able to provide feedback about your experience.
            </Text>
          </View>

          <View style={styles.bottomSheetButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelEndCall}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirmEndCall}
            >
              <Text style={styles.confirmButtonText}>End Call & Provide Feedback</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheet>
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
  localVideoContainer: {
    position: 'absolute',
    width: 120,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    zIndex: 100
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
  callInfoOverlay: {
    position: 'absolute',
    top: 30,
    left: 20,
    right: 160,
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
  screenSharingStatus: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
    marginTop: 4,
  },
  controlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
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
    gap: 16,
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
  bottomSheetContent: {
    flex: 1,
    padding: 24,
  },
  bottomSheetHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  bottomSheetTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  bottomSheetDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomSheetButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 16,
  },
  confirmButton: {
    flex: 2,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});