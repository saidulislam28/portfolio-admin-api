import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'agora_app_id'

export const getAgoraAppID = async () => {
  try {
    const token = await AsyncStorage.getItem(KEY);
    return token;
  } catch (error) {
    console.error('Error getting app id from AsyncStorage:', error);
    return null;
  }
};

export const setAgoraAppID = async (appId: string) => {
  try {
    await AsyncStorage.setItem(KEY, appId);
  } catch (error) {
    console.error('Error setting app id in AsyncStorage:', error);
  }
};

export const removeAgoraAppID = async () => {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch (error) {
    console.error('Error removing token from AsyncStorage:', error);
  }
};