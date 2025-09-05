import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  SafeAreaView, 
  Platform,
  AppState,
  Dimensions,
  Vibration
} from 'react-native';
import { 
  createAgoraRtcEngine, 
  IRtcEngine, 
  ChannelProfileType, 
  ClientRoleType, 
  RtcSurfaceView,
  VideoSourceType
} from 'react-native-agora';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as Device from 'expo-device';
import { APP_ID, CHANNEL_NAME, TOKEN } from '@/lib/constants';
import { PermissionsAndroid } from 'react-native';
import * as Notifications from 'expo-notifications';
import ExpoPip from 'expo-pip';
import { useNavigation } from '@react-navigation/native';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});


const AgoraVideoCall = ({ onCallEnd, userId, channelName }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [remoteUid, setRemoteUid] = useState(null);
  const [isJoined, setIsJoined] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);
  const [showCallRibbon, setShowCallRibbon] = useState(false);
  const [autoEnterPipEnabled, setAutoEnterPipEnabled] = useState(true);
  const { isInPipMode } = ExpoPip.useIsInPip();
  const agoraEngineRef = useRef<IRtcEngine | null>(null);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();
  const navigation = useNavigation();
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  console.log('consultantApp Channel name:', channelName)

  useEffect(() => {
    initializeAgora();

    return () => {
      // Proper cleanup sequence
      if (agoraEngineRef.current) {
        try {
          agoraEngineRef.current.leaveChannel();
          agoraEngineRef.current.release();
        } catch (e) {
          console.warn('Error during cleanup:', e);
        }
        agoraEngineRef.current = null;
      }
    };
  }, []);

  const initializeAgora = async () => {
    try {
      console.log('initializeAgora')
      // Create Agora engine instance
      agoraEngineRef.current = createAgoraRtcEngine();
      const agoraEngine = agoraEngineRef.current;
      
      // Initialize engine
      await agoraEngine.initialize({
        appId: APP_ID,
      });
      
      // Enable video
      await agoraEngine.enableVideo();
      
      // Set up event listeners
      agoraEngine.registerEventHandler({
        onJoinChannelSuccess: (connection, elapsed) => {
          console.log('JoinChannelSuccess', connection.channelId, elapsed);
          setIsJoined(true);
        },
        onUserJoined: (connection, remoteUid, elapsed) => {
          console.log('UserJoined', remoteUid, elapsed);
          setRemoteUid(remoteUid);
        },
        onUserOffline: (connection, remoteUid, reason) => {
          console.log('UserOffline', remoteUid, reason);
          setRemoteUid(null);
          onCallEnd();
        },
        onError: (err, msg) => {
            console.log('Consultant agora error', err, msg)
        },
        onRtcStats: (connection, stats) => {
            // console.log('Consultant agora stats', stats)
        },
      });

      // Join channel
      await joinChannel();
    } catch (error) {
      console.error('Failed to initialize Agora:', error);
    }
  };

   

  // Initialize notifications and PiP settings
  useEffect(() => {
    registerForPushNotifications();
    
    // Configure PiP parameters
    ExpoPip.setPictureInPictureParams({
      width: Math.round(screenWidth * 0.4),
      height: Math.round(screenHeight * 0.4),
      title: 'Ongoing Video Call',
      subtitle: 'Tap to return to call',
      seamlessResizeEnabled: true,
      autoEnterEnabled: autoEnterPipEnabled,
    });

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });
    
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
      navigation.navigate('VideoCall');
    });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [autoEnterPipEnabled]);

  // Handle app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [isJoined]);

  const registerForPushNotifications = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Notification permissions not granted');
    }
  };

  const handleAppStateChange = async (nextAppState) => {
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      // App came to foreground
      setShowCallRibbon(false);
    } else if (nextAppState === 'background' && isJoined) {
      // App went to background
      setShowCallRibbon(true);
      await showCallNotification();
    }
    setAppState(nextAppState);
  };

  const enterPipMode = async () => {
    try {
      if (await ExpoPip.isAvailable()) {
        await ExpoPip.enterPipMode({
          width: Math.round(screenWidth * 0.4),
          height: Math.round(screenHeight * 0.4),
        });
      }
    } catch (error) {
      console.log('Failed to enter PiP:', error);
    }
  };

  const toggleAutoEnterPip = () => {
    const newValue = !autoEnterPipEnabled;
    setAutoEnterPipEnabled(newValue);
    ExpoPip.setPictureInPictureParams({
      autoEnterEnabled: newValue,
    });
  };

  const showCallNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Ongoing Call',
        body: 'You are in an active video call',
        data: { callActive: true },
        sticky: true,
        sound: true,
        vibrate: [1000, 1000, 1000],
      },
      trigger: null,
    });
  };

  // Initialize notifications
  useEffect(() => {
    registerForPushNotifications();
    
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });
    
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
      // Bring app to foreground when notification is tapped
      navigation.navigate('VideoCall');
    });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  // Handle app state changes for PiP
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [isJoined]);


  // Initialize notifications and PiP
  useEffect(() => {
    registerForPushNotifications();
    
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });
    
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
      navigation.navigate('VideoCall');
      exitPipMode();
    });

    // Check PiP availability
    checkPipSupport();

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  // Handle app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [isJoined]);

  const checkPipSupport = async () => {
    try {
      const isSupported = await PiP.isAvailableAsync();
      console.log('PiP supported:', isSupported);
    } catch (error) {
      console.log('PiP check error:', error);
    }
  };

  

  const exitPipMode = async () => {
    try {
      if (await PiP.isActiveAsync()) {
        await PiP.disableAutoPip();
        setIsInPipMode(false);
        console.log('Exited PiP mode');
      }
    } catch (error) {
      console.log('Failed to exit PiP:', error);
    }
  };

  const togglePipMode = async () => {
    if (isInPipMode) {
      await exitPipMode();
    } else {
      await enterPipMode();
    }
  };


  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        // Start screen sharing using properly structured parameters
        await agoraEngineRef.current?.startScreenCapture({
          // Don't capture audio as requested
          captureAudio: false,
          captureVideo: true,
          videoParams: {
            dimensions: {
              width: screenWidth,
              height: screenHeight
            },
            frameRate: 15,
            bitrate: 2000,
            contentHint: 1 // VideoContentHint.CONTENT_HINT_DETAILS
          }
        });
        
        // Use enableLocalVideo instead of setVideoSource
        await agoraEngineRef.current?.enableLocalVideo(false);
        
        // If available, use the appropriate method to update screen capture parameters
        if (agoraEngineRef.current?.updateScreenCaptureParameters) {
          await agoraEngineRef.current.updateScreenCaptureParameters({
            captureVideo: true,
            videoParams: {
              dimensions: {
                width: screenWidth,
                height: screenHeight
              },
              frameRate: 15,
              bitrate: 2000
            }
          });
        }
      } else {
        // Stop screen sharing
        await agoraEngineRef.current?.stopScreenCapture();
        
        // Enable the camera again
        await agoraEngineRef.current?.enableLocalVideo(true);
      }
      
      setIsScreenSharing(!isScreenSharing);
    } catch (error) {
      console.error('Screen share failed:', error);
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

  const joinChannel = async () => {
    console.log('joinChannel', agoraEngineRef.current)
    try {
      const hasPermissions = await checkAndRequestPermissions();
      if (!hasPermissions) {
        throw new Error('Permissions not granted');
      }

      await agoraEngineRef.current?.setChannelProfile(
        ChannelProfileType.ChannelProfileLiveBroadcasting
      );
      
      await agoraEngineRef.current?.setClientRole(
        ClientRoleType.ClientRoleBroadcaster
      );

      await agoraEngineRef.current?.startPreview();
      
      const tempChannel = 'test-channel'
      const tempToken = '007eJxTYPj4d9n+BdbaTmYbi90a5qutzHxnxbPPNvDxK0aWf39W7z2nwGCWlGZkkJZqnJaalmRilmJkaZBilmyUaGBhkZqcYmJmMXm2X0ZDICODcskUVkYGCATxeRhKUotLdJMzEvPyUnMYGAD0hiQ7'
      
      await agoraEngineRef.current?.joinChannel(
        tempToken,
        tempChannel,
        50,
        {
          clientRoleType: ClientRoleType.ClientRoleBroadcaster,
          channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
        }
      );
    } catch (error) {
      console.error('Failed to join channel:', error);
    }
  };

  const leaveChannel = async () => {
    try {
      await agoraEngineRef.current?.leaveChannel();
      setIsJoined(false);
      setRemoteUid(null);
      onCallEnd();
    } catch (error) {
      console.error('Failed to leave channel:', error);
    }
  };

  const toggleMute = async () => {
    try {
      await agoraEngineRef.current?.muteLocalAudioStream(!isMuted);
      setIsMuted(!isMuted);
    } catch (error) {
      console.error('Failed to toggle mute:', error);
    }
  };

  const toggleVideo = async () => {
    try {
      await agoraEngineRef.current?.muteLocalVideoStream(!isVideoOn);
      setIsVideoOn(!isVideoOn);
    } catch (error) {
      console.error('Failed to toggle video:', error);
    }
  };

  const switchCamera = async () => {
    try {
      await agoraEngineRef.current?.switchCamera();
      setIsFrontCamera(!isFrontCamera);
    } catch (error) {
      console.error('Failed to switch camera:', error);
    }
  };

  return (
    <>
      {/* Call Ribbon (shown when in background or other screens) */}
      {showCallRibbon && (
        <TouchableOpacity 
          style={styles.callRibbon}
          onPress={() => navigation.navigate('VideoCall')}
        >
          <View style={styles.ribbonContent}>
            <Ionicons name="videocam" size={20} color="white" />
            <Text style={styles.ribbonText}>Ongoing Call - Tap to return</Text>
            <TouchableOpacity onPress={leaveChannel}>
              <Ionicons name="call" size={20} color="red" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}

      {/* Main Call UI (hidden when in PiP mode) */}
      {!isInPipMode && (
        <SafeAreaView style={styles.container}>
          <StatusBar style="light" />
          
          {/* Remote Video */}
          {remoteUid !== null ? (
            <RtcSurfaceView
              style={styles.remoteVideo}
              canvas={{ uid: remoteUid }}
            />
          ) : (
            <View style={styles.remoteVideoPlaceholder}>
              <Text style={styles.placeholderText}>Waiting for remote user to join...</Text>
            </View>
          )}
          
          {/* Local Video */}
          {isVideoOn && !isScreenSharing && (
            <RtcSurfaceView
              style={styles.localVideo}
              canvas={{ uid: 0 }}
            />
          )}
          
          {/* Controls */}
          <View style={styles.controls}>
            <TouchableOpacity style={styles.controlButton} onPress={toggleMute}>
              <Ionicons
                name={isMuted ? 'mic-off' : 'mic'}
                size={24}
                color="white"
              />
              <Text style={styles.controlText}>{isMuted ? 'Unmute' : 'Mute'}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.controlButton} onPress={toggleVideo}>
              <Ionicons
                name={isVideoOn ? 'videocam' : 'videocam-off'}
                size={24}
                color="white"
              />
              <Text style={styles.controlText}>{isVideoOn ? 'Video Off' : 'Video On'}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.controlButton} onPress={switchCamera}>
              <Ionicons
                name={'camera-reverse'}
                size={24}
                color="white"
              />
              <Text style={styles.controlText}>Switch</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.controlButton, styles.endCallButton]} onPress={leaveChannel}>
              <Ionicons
                name={'call'}
                size={24}
                color="white"
              />
              <Text style={styles.controlText}>End</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.controlButton, isScreenSharing ? styles.activeShareButton : {}]} 
              onPress={toggleScreenShare}
            >
              <Ionicons
                name={isScreenSharing ? 'close' : 'share'}
                size={24}
                color="white"
              />
              <Text style={styles.controlText}>
                {isScreenSharing ? 'Stop Share' : 'Share'}
              </Text>
            </TouchableOpacity>

            {/* PiP Toggle Button */}
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={enterPipMode}
            >
              <Ionicons
                name="contract"
                size={24}
                color="white"
              />
              <Text style={styles.controlText}>Minimize</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.controlButton}
              onPress={toggleAutoEnterPip}
            >
              <Ionicons
                name={autoEnterPipEnabled ? "checkbox" : "square-outline"}
                size={24}
                color="white"
              />
              <Text style={styles.controlText}>
                Auto PiP: {autoEnterPipEnabled ? "ON" : "OFF"}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      )}

      {/* Android PiP View */}
      {isInPipMode && Platform.OS === 'android' && (
        <View style={styles.pipContainer}>
          <RtcSurfaceView
            style={styles.pipVideo}
            canvas={{ uid: remoteUid || 0 }}
          />
          <TouchableOpacity 
            style={styles.pipCloseButton}
            onPress={togglePipMode}
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  remoteVideo: {
    flex: 1,
  },
  remoteVideoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  placeholderText: {
    color: 'white',
    fontSize: 18,
  },
  localVideo: {
    position: 'absolute',
    width: 100,
    height: 150,
    top: 20,
    right: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  controls: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  controlButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  endCallButton: {
    backgroundColor: 'red',
  },
  controlText: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
  },
  activeShareButton: {
    backgroundColor: 'green',
  },
  pipContainer: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 150,
    height: 200,
    backgroundColor: 'black',
    borderRadius: 10,
    overflow: 'hidden',
    zIndex: 999,
  },
  pipVideo: {
    flex: 1,
  },
  pipCloseButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callRibbon: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#333',
    padding: 10,
    zIndex: 1000,
  },
  ribbonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ribbonText: {
    color: 'white',
    marginLeft: 10,
    flex: 1,
  },
});

export default AgoraVideoCall;