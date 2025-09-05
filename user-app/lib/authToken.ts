import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAuthTokenMobile = async () => {
  try {
    const token = await AsyncStorage.getItem('jwt_token');
    return token;
  } catch (error) {
    console.error('Error getting token from AsyncStorage:', error);
    return null;
  }
};

export const setAuthTokenMobile = async (token) => {
  try {
    await AsyncStorage.setItem('jwt_token', token);
  } catch (error) {
    console.error('Error setting token in AsyncStorage:', error);
  }
};

export const removeAuthTokenMobile = async () => {
  try {
    await AsyncStorage.removeItem('jwt_token');
  } catch (error) {
    console.error('Error removing token from AsyncStorage:', error);
  }
};