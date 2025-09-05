import Constants from "expo-constants";
export const API_BOOK_LIST = 'book'

export const baseUrl = Constants.expoConfig?.extra?.apiBaseUrl

export const API_USER_REGISTRATION = 'auth/register'
export const API_VERIFY_OTP = 'auth/verify-otp'
export const API_LOGIN_USER = 'auth/login'
export const API_FORGET_PASSWORD = 'auth/forget-password'
export const API_RESET_PASSWORD = 'auth/reset-password'
export const API_GET_BOOKS = 'app/book'
export const API_ORDER_BOOKS = 'orders'
export const API_GET_PACKAGES = 'packages'
export const GET_ALL_EXAM_CENTER = 'packages/exam-center'
export const API_CREATE_OREDR = 'orders'
export const API_CHECK_PAYMENT = 'payment/check-payment'
export const API_GET_APPOINTMENTS = 'user/appointments'
export const POST_DEVICE_TOKENS = 'device-tokens'
export const BOOK_ORDER = 'app/book-order'
export const RESEND_OTP = 'auth/resend-otp'
export const APP_SETTINGS_DATA = 'app-setting/app-data'
export const API_UPLOAD_IMAGE = "/attachments/upload-image";
