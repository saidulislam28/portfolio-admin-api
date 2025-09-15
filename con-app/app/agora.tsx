import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AgoraVideoCall from '@/components/AgoraVideoCall';

export default function Agora({}) {
  const [inCall, setInCall] = useState(false);
  const { channelName } = useLocalSearchParams();
  // const channelName = params.channelName || params.channel;

  // Debug log to see what params are being received
  // useEffect(() => {
  //   // console.log('All params:', params);
  //   console.log('Channel name:', channelName);
  // }, [ channelName]);

  useEffect(() => {
    // Auto-start the call when component mounts and channelName is available
    if (channelName) {
      setInCall(true);
    }
  }, [channelName]);

  // Generate a random user ID (you can modify this logic as needed)
  const generateUserId = () => {
    return Math.floor(Math.random() * 1000000) + 1;
  };

  // if (!channelName) {
  //   return (
  //     <View style={styles.container}>
  //       <View style={styles.errorContainer}>
  //         <Text style={styles.errorText}>No channel name provided</Text>
  //         <Text style={styles.errorSubtext}>
  //           This screen should be navigated to with a channel name parameter
  //         </Text>
  //       </View>
  //     </View>
  //   );
  // }

  console.log('chanel name', channelName);
  return (
    <View style={styles.container}>
      {inCall ? (
        <AgoraVideoCall
          onCallEnd={() => setInCall(false)}
          userId={'2'}
          channelName={channelName}
        />
      ) : (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Starting call...</Text>
          <Text style={styles.channelText}>Channel: {channelName}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 20,
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    marginBottom: 10,
  },
  channelText: {
    fontSize: 16,
    color: 'gray',
  },
});
