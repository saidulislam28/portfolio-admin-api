import { Audio } from 'expo-av';

let sound: Audio.Sound | null = null;

export async function playRingtone() {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      //   interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      shouldDuckAndroid: true,
    });

    const result = await Audio.Sound.createAsync(
      require('../assets/ringtone.mp3'),
      { isLooping: true }
    );
    sound = result.sound;
    await sound.playAsync();
  } catch (err) {
    console.warn('Could not play ringtone:', err);
  }
}

export async function stopRingtone() {
  if (!sound) return;
  try {
    await sound.stopAsync();
    await sound.unloadAsync();
  } finally {
    sound = null;
  }
}
