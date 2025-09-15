import { NativeModules, Platform } from 'react-native';

export const startAudioService = () => {
  if (Platform.OS === 'android') {
    NativeModules.ForegroundServiceModule?.startService();
  }
};

export const stopAudioService = () => {
  if (Platform.OS === 'android') {
    NativeModules.ForegroundServiceModule?.stopService();
  }
};

const { AudioService } = NativeModules;

export const AudioServiceManager = {
  start: () => {
    if (Platform.OS === 'android') {
      AudioService?.startService();
    }
  },
  stop: () => {
    if (Platform.OS === 'android') {
      AudioService?.stopService();
    }
  },
};
