import { Alert, PermissionsAndroid, Platform } from 'react-native';
import RNCallKeep from 'react-native-callkeep';

export const setupCallKeep = async () => {
  requestPermissions();

  RNCallKeep.setup({
    ios: {
      appName: 'Speaking Mate',
    },
    android: {
      alertTitle: 'Permissions required',
      alertDescription: 'Allow access to manage calls',
      cancelButton: 'Cancel',
      okButton: 'OK',
      // selfManaged: true,
      additionalPermissions: [],
      foregroundService: {
        channelId: 'com.bitpixelbd.speakingmateconsultant.calling',
        channelName: 'Speaking Mate Incoming Call',
        notificationTitle: 'Incoming Call...',
      },
    },
  }).then(acc => console.log({ acc }));

  await RNCallKeep.setAvailable(true);
};

async function requestPermissions() {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_PHONE_NUMBERS,
      PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
      PermissionsAndroid.PERMISSIONS.CALL_PHONE,
    ]);
    console.log(granted);

    const allGranted = Object.values(granted).every(
      value => value === PermissionsAndroid.RESULTS.GRANTED
    );

    if (!allGranted) {
      console.warn('Required permissions not granted');
    }
  }
}

import {
  PERMISSIONS,
  RESULTS,
  check,
  openSettings,
  request,
} from 'react-native-permissions';

export async function ensurePermissions() {
  const phoneStatePermission =
    Platform.OS === 'android' ? PERMISSIONS.ANDROID.READ_PHONE_STATE : null;

  if (!phoneStatePermission) return;

  const result = await check(phoneStatePermission);

  if (result === RESULTS.GRANTED) {
    return true;
  }

  if (result === RESULTS.BLOCKED || result === RESULTS.DENIED) {
    // "never_ask_again" case
    Alert.alert(
      'Permission required',
      'Please enable phone permissions in your settings to use call features.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Open Settings',
          onPress: () => openSettings(),
        },
      ]
    );
    return false;
  }

  const reqResult = await request(phoneStatePermission);
  return reqResult === RESULTS.GRANTED;
}
