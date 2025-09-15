import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CallControlsProps {
  isAudioMuted: boolean;
  isVideoMuted: boolean;
  isSpeakerOn: boolean;
  isScreenSharing: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onToggleSpeaker: () => void;
  onToggleScreenShare: () => void;
  onSwitchCamera: () => void;
  onMinimize: () => void;
  onEndCall: () => void;
}

export const CallControls: React.FC<CallControlsProps> = ({
  isAudioMuted,
  isVideoMuted,
  isSpeakerOn,
  isScreenSharing,
  onToggleAudio,
  onToggleVideo,
  onToggleSpeaker,
  onToggleScreenShare,
  onSwitchCamera,
  onMinimize,
  onEndCall,
}) => {
  return (
    <View style={styles.controlsOverlay}>
      {/* Top controls */}
      <View style={styles.topControls}>
        <TouchableOpacity
          style={styles.topControlButton}
          onPress={onMinimize}
        >
          <Ionicons name="chevron-down" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.topControlButton}
          onPress={onSwitchCamera}
          disabled={isScreenSharing}
        >
          <Ionicons
            name="camera-reverse"
            size={24}
            color={isScreenSharing ? '#9CA3AF' : '#FFFFFF'}
          />
        </TouchableOpacity>
      </View>

      {/* Bottom controls */}
      <View style={styles.bottomControls}>
        <TouchableOpacity
          style={[
            styles.controlButton,
            isAudioMuted && styles.controlButtonMuted,
          ]}
          onPress={onToggleAudio}
        >
          <Ionicons
            name={isAudioMuted ? 'mic-off' : 'mic'}
            size={24}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.endCallButton}
          onPress={onEndCall}
        >
          <Ionicons name="call" size={28} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.controlButton,
            isVideoMuted && styles.controlButtonMuted,
          ]}
          onPress={onToggleVideo}
          disabled={isScreenSharing}
        >
          <Ionicons
            name={isVideoMuted ? 'videocam-off' : 'videocam'}
            size={24}
            color={isScreenSharing ? '#9CA3AF' : '#FFFFFF'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.controlButton,
            isScreenSharing && styles.controlButtonActive,
          ]}
          onPress={onToggleScreenShare}
        >
          <Ionicons
            name={isScreenSharing ? 'desktop' : 'desktop-outline'}
            size={24}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.controlButton,
            isSpeakerOn && styles.controlButtonActive,
          ]}
          onPress={onToggleSpeaker}
        >
          <Ionicons
            name={isSpeakerOn ? 'volume-high' : 'volume-medium'}
            size={24}
            color="#FFFFFF"
          />
        </TouchableOpacity>
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
});