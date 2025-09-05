import CallKeep, { IOptions } from 'react-native-callkeep';
import { Platform } from 'react-native';

const options: IOptions = {
  ios: {
    appName: 'Your App Name',
    supportsVideo: false,
    maximumCallGroups: 1,
    maximumCallsPerCallGroup: 1,
  },
  android: {
    alertTitle: 'Permissions required',
    alertDescription: 'This application needs to access your phone accounts',
    cancelButton: 'Cancel',
    okButton: 'OK',
    additionalPermissions: [],
    foregroundService: {
      channelId: 'com.your.app.callkeep',
      channelName: 'Foreground service for my app',
      notificationTitle: 'My app is running in background',
      notificationIcon: 'ic_launcher',
    },
  },
};

export const configureCallKeep = (): void => {
  CallKeep.setup(options);
  CallKeep.setAvailable(true);

  // Add event listeners
  CallKeep.addEventListener('answerCall', onAnswerCallAction);
  CallKeep.addEventListener('endCall', onEndCallAction);
  CallKeep.addEventListener('didDisplayIncomingCall', onIncomingCallDisplayed);
};

const onAnswerCallAction = ({ callUUID }: { callUUID: string }): void => {
  useCallStore.getState().answerCall();
};

const onEndCallAction = ({ callUUID }: { callUUID: string }): void => {
  useCallStore.getState().endCall();
  CallKeep.endCall(callUUID);
};

const onIncomingCallDisplayed = (): void => {
  console.log('Incoming call displayed');
};

export const displayIncomingCall = (callerId: string, callerName: string): void => {
  const callUUID = callerId;
  
  CallKeep.displayIncomingCall(
    callUUID,
    callerName,
    callerName,
    'generic',
    true,
    null,
    Platform.OS === 'android' ? {
      timeout: 30000,
      extra: {},
      notificationId: 'callkeep',
      notificationIconName: 'ic_launcher',
    } : null
  );
};

export const endAllCalls = (): void => {
  CallKeep.endAllCalls();
};