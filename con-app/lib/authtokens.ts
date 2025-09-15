import { useAuth } from '@/context/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAuthTokenMobile = async () => {
  // return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAZW1haWwuY29tIiwiaWQiOjEsInN1YiI6MSwicm9sZSI6IlVzZXIiLCJpYXQiOjE3NTEwNTUxNDR9.zUhZmU3Kwl02TA0SEkwyq6Rx9Wgd_gC6bcD-XHaBMeM'

  try {
    const token = await AsyncStorage.getItem('jwt_token');
    // const token = user.token;
    // console.log("token from auth token", token)
    return token;
  } catch (error) {
    console.error('Error getting token from AsyncStorage:', error);
    return null;
  }
};

export const setAuthTokenMobile = async (token: string) => {
  console.log('save ss', token);
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
