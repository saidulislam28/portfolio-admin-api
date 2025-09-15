import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CallInfoOverlayProps {
  participantName: string;
  callDuration: string;
  isScreenSharing: boolean;
}

export const CallInfoOverlay: React.FC<CallInfoOverlayProps> = ({
  participantName,
  callDuration,
  isScreenSharing,
}) => {
  return (
    <View style={styles.callInfoOverlay}>
      <Text style={styles.participantName}>
        {participantName || 'Unknown'}
      </Text>
      <Text style={styles.callDuration}>
        {callDuration}
      </Text>
      {isScreenSharing && (
        <Text style={styles.screenSharingStatus}>📱 Screen Sharing</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
});
