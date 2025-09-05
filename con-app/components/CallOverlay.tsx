import { ROUTES } from '@/constants/app.routes';
import { useCallService } from '@/services/AgoraCallService';
import { useCallInfo, useCallStatus, useCallStore } from '@/zustand/callStore';
import { router, usePathname } from 'expo-router';
import React from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RtcSurfaceView, VideoViewSetupMode } from 'react-native-agora';


interface CallOverlayProps {
  backgroundColor?: string;
  textColor?: string;
}

export const CallOverlay: React.FC<CallOverlayProps> = ({
  backgroundColor = '#10B981',
  textColor = '#ffffff',
}) => {
  const path = usePathname();
  const showCallOverlay = useCallStore(state => state.showCallOverlay);
  // const showCallOverlay = true;
  const { callDuration, otherParticipant, } = useCallInfo();
  const { setCallScreenActive, endCall, participants } = useCallStore();
  const {
    leaveChannel,
  } = useCallService();

  const windowDimensions = Dimensions.get('window');
  const [containerLayout, setContainerLayout] = React.useState({ width: 0, height: 0 });
  const [position, setPosition] = React.useState({ x: 20, y: 40 }); // Initial position state
  const pan = React.useRef(new Animated.ValueXY()).current;

  // Initialize pan values to current position
  React.useEffect(() => {
    pan.setValue({ x: position.x, y: position.y });
  }, []);

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (e, gesture) => {
        const { width, height } = containerLayout;
        const screenWidth = windowDimensions.width;
        const screenHeight = windowDimensions.height;

        console.log('gesture', gesture.moveX, gesture.moveY)
        let newX = gesture.moveX;
        let newY = gesture.moveY;

        console.log('new', newX, newY)

        // Boundary checks with 20px padding
        newX = Math.max(20, Math.min(newX, screenWidth - width - 20));
        newY = Math.max(20, Math.min(newY, screenHeight - height - 20));

        console.log('new final', newX, newY)
        // Update position state
        setPosition({ x: newX, y: newY });

        // Reset pan values for next drag
        pan.setValue({ x: 0, y: 0 });
      },
    })
  ).current;

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleReturnToCall = () => {
    setCallScreenActive(true);
    router.push(ROUTES.CALL);
  };

  const handleEndCall = async () => {
    await leaveChannel();
    endCall();
  };

  if (!showCallOverlay || path === "/call") return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor,
          transform: [
            {
              translateX: pan.x.interpolate({
                inputRange: [-windowDimensions.width, windowDimensions.width],
                outputRange: [-windowDimensions.width, windowDimensions.width],
                extrapolate: 'clamp',
              })
            },
            {
              translateY: pan.y.interpolate({
                inputRange: [-windowDimensions.height, windowDimensions.height],
                outputRange: [-windowDimensions.height, windowDimensions.height],
                extrapolate: 'clamp',
              })
            },
          ],
          left: position.x,
          top: position.y,
          borderRadius: 12,
          height: 150,
          width: 100
        },
      ]}
    
    >
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.callInfo}
          activeOpacity={0.8}
        >
          {/* Empty User Video Call */}
          <RtcSurfaceView
            style={styles.remoteVideo}
            canvas={{
              //@ts-ignore
              uid: participants?.length ? participants[0].uid : 0,
              setupMode: VideoViewSetupMode.VideoViewSetupReplace,
            }}
          />
          {/* Draggable Overlay */}
          <View
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "transparent",
              position: "absolute",
              zIndex: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
            onLayout={(event) => {
              const { width, height } = event.nativeEvent.layout;
              setContainerLayout({ width, height });
            }}
            {...panResponder.panHandlers}
          >
            <TouchableOpacity
              onPress={handleReturnToCall}
            >
              <Text style={{
                color: "#fff"
              }}>Back to call</Text>
            </TouchableOpacity>
          </View>
         
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1000,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  content: {
    position: "relative",
    flexDirection: 'column',
    alignItems: 'center',
    height: "100%",
  },
  callInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0
  },
  callDetails: {
    flex: 1,
  },
  callIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  pulsingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  callText: {
    fontSize: 12,
    fontWeight: '500',
  },
  participantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  participantName: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  duration: {
    fontSize: 12,
    fontWeight: '500',
  },
  callIcon: {
    marginLeft: 12,
    marginRight: 8,
  },
  endCallButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.9)',
    borderRadius: 20,
    padding: 6,
    position: 'absolute',
    bottom: 8,
    left: '50%',
    transform: [{ translateX: "-50%" }],
    zIndex: 1
  },
  remoteVideo: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

// Animated version for smoother transitions
export const AnimatedCallOverlay: React.FC<CallOverlayProps> = (props) => {
  const { showCallOverlay } = useCallStatus();
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: showCallOverlay ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [showCallOverlay]);

  if (!showCallOverlay) return null;

  return (
    <Animated.View
      style={[
        {
          opacity: animatedValue,
          transform: [{
            translateY: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [-100, 0],
            })
          }]
        }
      ]}
    >
      <CallOverlay {...props} />
    </Animated.View>
  );
};