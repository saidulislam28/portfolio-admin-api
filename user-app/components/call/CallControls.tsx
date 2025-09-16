import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ControlButtonProps {
  iconName: string;
  onPress: () => void;
  isActive?: boolean;
  isMuted?: boolean;
  isEndCall?: boolean;
}

const ControlButton: React.FC<ControlButtonProps> = ({
  iconName,
  onPress,
  isActive = false,
  isMuted = false,
  isEndCall = false,
}) => {
  const buttonStyle = [
    styles.controlButton,
    isEndCall && styles.endCallButton,
    isMuted && styles.controlButtonMuted,
    isActive && styles.controlButtonActive,
  ];

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress}>
      <Ionicons name={iconName as any} size={isEndCall ? 28 : 24} color="#FFFFFF" />
    </TouchableOpacity>
  );
};

interface CallControlsProps {
  onMinimize: () => void;
  onSwitchCamera: () => void;
  onToggleAudio: () => void;
  onEndCall: () => void;
  onToggleVideo: () => void;
  onToggleSpeaker: () => void;
  isAudioMuted: boolean;
  isVideoMuted: boolean;
  isSpeakerOn: boolean;
}

export const CallControls: React.FC<CallControlsProps> = ({
  onMinimize,
  onSwitchCamera,
  onToggleAudio,
  onEndCall,
  onToggleVideo,
  onToggleSpeaker,
  isAudioMuted,
  isVideoMuted,
  isSpeakerOn,
}) => {
  return (
    <View style={styles.controlsOverlay}>
      {/* Top controls */}
      <View style={styles.topControls}>
        <TouchableOpacity style={styles.topControlButton} onPress={onMinimize}>
          <Ionicons name="chevron-down" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.topControlButton} onPress={onSwitchCamera}>
          <Ionicons name="camera-reverse" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Bottom controls */}
      <View style={styles.bottomControls}>
        <ControlButton
          iconName={isAudioMuted ? "mic-off" : "mic"}
          onPress={onToggleAudio}
          isMuted={isAudioMuted}
        />

        <ControlButton
          iconName="call"
          onPress={onEndCall}
          isEndCall={true}
        />

        <ControlButton
          iconName={isVideoMuted ? "videocam-off" : "videocam"}
          onPress={onToggleVideo}
          isMuted={isVideoMuted}
        />

        <ControlButton
          iconName={isSpeakerOn ? "volume-high" : "volume-medium"}
          onPress={onToggleSpeaker}
          isActive={isSpeakerOn}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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