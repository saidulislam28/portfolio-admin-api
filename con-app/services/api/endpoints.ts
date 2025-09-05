import Constants from 'expo-constants';

export const API_BOOK_LIST = 'book'
export const baseUrl = Constants.expoConfig?.extra?.apiBaseUrl

export const API_USER_REGISTRATION = 'consultant-auth/register'
export const API_VERIFY_OTP = 'consultant-auth/verify-otp'
export const API_LOGIN_USER = 'consultant-auth/login'
export const API_FORGET_PASSWORD = 'consultant-auth/forget-password'
export const API_RESET_PASSWORD = 'consultant-auth/reset-password'
export const API_GET_LIVE_APPOINTMENTS = 'consultant/live/appointments'
export const API_GET_APPOINTMENTS = 'consultant/appointment/list'
export const API_GET_APPOINTMENT_DETAILS = 'user/appointments'
export const API_UPDATE_APPOINTMENT = 'consultant/appointment'
export const API_UPDATE_APPOINTMENT_NOTE = 'consultant/appointment/note'
export const POST_DEVICE_TOKENS = 'device-tokens'
export const MOCKTEST_FEEDBACK_API = 'mocktest-feedback'
export const CONVERSATION_FEEDBACK_API = 'conversation-feedback'
export const FEEDBACK_COMMENTS = 'feedback-comments'