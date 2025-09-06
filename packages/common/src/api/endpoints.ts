export const API_CONSULTANT = {
  regisetr: "consultant-auth/register",
  verifyOtp: "consultant-auth/verify-otp",
  login: "consultant-auth/login",
  forget: "consultant-auth/forget-password",
  reset: "consultant-auth/reset-password",
  get_live_appointments: "consultant/live/appointments",
  get_appointments: "consultant/appointment/list",
  appointment_details: "user/appointments",
  update_appointment: "consultant/appointment",
  update_note: 'consultant/appointment/note',
  feedback_comments: 'feedback-comments',
  conversation_feedback: 'conversation-feedback',
  mocktest_feedback: 'mocktest-feedback',
  mocktest_comments: 'feedback-comments/mock-test',
};

export const API_COMMON = {
  post_device_tokens: "user/device-tokens",
};

export const API_USER = {
  user_registration: "auth/register",
  verify_otp: "auth/verify-otp",
  login_user: "auth/login",
  forget_password: "auth/forget-password",
  reset_password: "auth/reset-password",
  get_books: "app/book",
  order_books: "orders",
  get_packages: "packages",
  create_order: "orders",
  check_payment: "payment/check-payment",
  get_appointments: "user/appointments",
  app_settings: "app-setting/app-data",
  book_order: 'app/book-order',
  RESEND_OTP: 'auth/resend-otp',
  group_order: 'user/orders/grouped-by-service-type'
};