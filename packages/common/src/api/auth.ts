import { getApiClient } from "./apiClient";
import { API_CONSULTANT, API_USER } from "./endpoints";



// Types for registration
export interface RegisterUserData {
  full_name: string;
  email: string;
  password: string;
  phone?: string; // Optional based on the form
  expected_level: 'low' | 'medium' | 'high';
}

export interface RegisterUserResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    email: string;
    id?: string;
    full_name?: string;
    phone?: string;
    expected_level?: string;
    created_at?: string;
    updated_at?: string;
  };
}

export interface User {
  id: number;
  full_name?: string;
  email?: string;
  phone?: string;
  password?: string;
  token?: string | null;
  device_type?: string | null;
  timezone?: string;
  expected_level?: string | null;
  is_active?: boolean;
  created_at?: Date | string;
  updated_at?: Date | string;
  is_verified?: boolean;
  is_test_user?: boolean;
  login_type?: 'EMAIL' | 'GOOGLE' | 'APPLE' | string;
  profile_image?: string;
  role?: 'USER' | 'ADMIN' | string;
  google_id?: string;
  apple_id?: string;
  facebook_id?: string;
}

export interface LoginUserResponse {
  success: boolean;
  data: User
}

export interface LoginConsultantResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  data: {
    id: number;
    full_name?: string;
    email?: string;
    phone?: string;
    profile_image?: string;
    token?: string;
    device_type?: string | null;
    timezone?: string;
    is_active?: boolean;
    is_mocktest?: boolean;
    is_conversation?: boolean;
    is_verified?: boolean;
    is_test_user?: boolean;
    bio?: string;
    experience?: number;
    skills?: string;
    hourly_rate?: number;
    created_at?: string;
  };
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

export interface SocialLoginPayload {
  token: string; //idToken
  provider: 'google' | 'facebook' | string;
  full_name?: string;
  profile_image?: string;
  email?: string;
}

export type SocialLoginResponse = User;

/**
 * Authenticates user via social provider (Google, Apple, etc.)
 * @param payload - Social login data
 * @returns User object with token on success
 */
export const socialLogin = async (
  payload: SocialLoginPayload
): Promise<SocialLoginResponse> => {
  const resp = await getApiClient().post(API_USER.social_login, payload);
  return resp.data;
};

// Updated registerUser function with proper types
export const registerUser = async (
  userData: RegisterUserData
): Promise<RegisterUserResponse> => {
  const resp = await getApiClient().post('auth/register', userData);
  return resp.data;
};

export const loginUser = async (
  email: string,
  password: string,
  phone: string
): Promise<LoginUserResponse> => {
  const resp = await getApiClient().post('auth/login', {email, password});
  return resp.data;
};

export const loginConsultant = async (
  email: string,
  password: string,
): Promise<LoginConsultantResponse> => {
  const resp = await getApiClient().post(API_CONSULTANT.login, {email, password});
  return resp.data;
};


export const verifyOtpUser = async (
  email: string,
  otp: number,
): Promise<LoginConsultantResponse> => {
  const resp = await getApiClient().post(API_USER.verify_otp, {email, otp});
  return resp.data;
};
