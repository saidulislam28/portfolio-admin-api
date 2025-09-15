export interface User {
  dob: string;
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio: string;
  phoneNumber?: string;
  sex?: string;
  city?: string;
  country?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SendOtpPayload {
  email?: string;
  phoneNumber?: string;
  otpType: OtpType;
}

export type OtpType =
  | 'password-reset'
  | 'registration'
  | 'email-verification'
  | 'phone-verification'
  | 'set-password';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RefreshTokenResponse {
  userData: any; //TODO
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface LoginResult {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    avatar: string | null;
    bio: string | null;
    dob: string | null;
    sex: 'male' | 'female' | string;
  };
}

export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  sex?: 'male' | 'female' | string;
  dob?: string; // Format: YYYY-MM-DD
  phone?: string;
  email?: string;
  // bio: string;
  avatar?: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
  register: (
    userData: RegistrationData,
    otp: string
  ) => Promise<RegistrationResult>;
  signInWithGoogle: any;
  signInWithApple: any;
}

export interface ApiError {
  message: string;
  statusCode: number;
}

export interface RegistrationResult {
  success: boolean;
  error?: string;
}

export type GenderOptions = 'male' | 'female' | '';

export interface RegistrationData {
  firstName: string;
  lastName: string;
  sex: GenderOptions;
  country: string;
  city: string;
  dob: string;
  email: string;
  password: string;
}

export interface OTPResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface SendOTPResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface ResetPasswordRequest {
  email?: string;
  phoneNumber?: string;
  password: string;
  otp: string;
}

export interface ConfirmOtpRequest
  extends Omit<ResetPasswordRequest, 'password'> {}

export interface ResetPasswordResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface PasswordResetOTPResponse extends OTPResponse {}

export interface SocialLoginResponse {
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  userData: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    verified?: boolean;
    avatar?: string;
    bio?: string | null;
    dob?: string | null;
    phoneNumber?: string | null;
    sex?: 'male' | 'female' | null;
    socialLoginProvider?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
  };
}

export interface ForgetPasswordDataState {
  type: 'Email' | 'Phone';
  value: string;
}
