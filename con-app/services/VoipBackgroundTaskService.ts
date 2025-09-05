import messaging from '@react-native-firebase/messaging';
import RNCallKeep from 'react-native-callkeep';

export default async (remoteMessage: any) => {
  const { callerName, uuid } = remoteMessage.data;

  console.log('📲 Incoming background FCM:', remoteMessage.data);

  RNCallKeep.displayIncomingCall(uuid, callerName, callerName);
  return Promise.resolve();
};
