import { NativeModules, Platform } from 'react-native';

const { PipModule } = NativeModules;

export const enterPip = async () => {
  if (Platform.OS === 'android') {
    const supported = await PipModule.isPipSupported();
    if (!supported) {
      console.warn('PiP not supported');
      return;
    }

    const granted = await PipModule.isPipPermissionGranted();
    if (!granted) {
      PipModule.openPipSettings();
      return;
    }

    await PipModule.enterPipMode(200, 300); // Width x Height => 3:2
  }
};
