import { getApiClient } from "./apiClient";
// Updated registerUser function with proper types
export const registerUser = async (userData) => {
    const resp = await getApiClient().post('auth/register', userData);
    return resp.data;
};
export const loginUser = async (email, password, phone) => {
    const resp = await getApiClient().post('auth/login', { email, password });
    return resp.data;
};
// Usage example in the registration screen:
/*
const registerData: RegisterUserData = {
  full_name: name,
  email: cleanedEmail,
  password,
  phone: cleanedPhone,
  expected_level: expectedLevel as 'low' | 'medium' | 'high',
};

try {
  const response = await registerUser(registerData);
  if (response.success) {
    await AsyncStorage.setItem('email', response?.data?.email || '');
    router.push('/verify-otp');
  } else {
    const errorMessage = response.message || response.error || 'Registration failed. Please try again.';
    Alert.alert('Registration Error', errorMessage);
  }
} catch (error) {
  // Handle error
}
*/ 
