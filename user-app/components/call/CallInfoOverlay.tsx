import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CallInfoOverlayProps {
  participantName: string;
  callDuration: string;
  screenSharingUid: number | null;
}

export const CallInfoOverlay: React.FC<CallInfoOverlayProps> = ({
  participantName,
  callDuration,
  screenSharingUid,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.participantName}>
        {participantName}
      </Text>
      <Text style={styles.callDuration}>
        {callDuration}
      </Text>
      {screenSharingUid && (
        <Text style={styles.screenShareIndicator}>Screen Sharing Active</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
});