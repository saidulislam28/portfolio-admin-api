import { SERVER_URL } from '~/configs';
export const API_CRUD = 'crud';
export const API_CRUD_FIND_WHERE = 'crud/find-where';

export const getUrlForModel = (model: string, id: any = null) => {
  if (id) {
    return `crud/${id}?model=${model}`;
  }
  return `crud?model=${model}`;
};


export const API_GET_BOOK_LIST = 'mobile-api/book-list';



export const API_FILE_UPLOAD = `${SERVER_URL}/api/v1/attachments/upload-image`;
export const ACCEPT_TEACHER = 'admin/teacher/request/accept';
export const REGISTER_TEACHER = 'admin/teacher/register';
export const LEVEL_UPDATE = 'admin/level';

export const API_CARE_HOME: any = 'care-homes/all?limit=:limit&page=:page';
export const DELETE_CARE_HOMES: any = 'care-homes/multi-delete';
export const MULTI_PUBLISH_CARE_HOMES: any = 'care-homes/multi-publish';
export const MULTI_VERIFIED_CARE_HOMES: any = 'care-homes/multi-verified';
export const API_CREATE_DEVICE: any = 'admin/user-management/add-device';
export const CREATE_VEHICLE = 'vehicles/add-vehicle'
export const UPDATE_VEHICLE = 'vehicles/update-vehicle'

export const API_USER = 'user'
export const API_USER_REGISTER = 'user/register'
export const API_ALL_USER_LIST = 'user/list'
export const BOOKS_API = 'books'
export const PACKAGES_API = 'packages'
export const ONLINE_CLASS_REQUEST_API = 'online-request'
export const SPOKEN_REQUEST = 'spoken-request'
export const EXAM_REGISTRATION_API = 'exam-registrations'
export const API_BOOK_ORDER = 'book-order'
export const API_BOOKINGS = 'bookings'
export const API_CONSULTANTS = 'consultants'
export const SEND_NOTIFICATION_TO_ALL = 'notifications/send-to-all'
export const SEND_NOTIFICATION = 'notifications/send'
export const SEND_ORDER_EMAIL = 'vendor-orders/send-to-vendor'
export const API_ORDER_REPORT = 'admin/reports/orders'
export const API_CONSULTANT_REPORTS = 'admin/reports/consultant-appointments'
export const CONSULTANT_SCHEDULE_WORK_HOURS = (id) => `consultants/${id}/work-hours`
export const CONSULTANT_SCHEDULE_OFF_DAYS = (id) => `/consultants/${id}/off-days`
export const APPOINTMENT_DETAILS = (id) => `appointments/${id}`
export const ASSIGN_CONSULTANT_API = (id) => `appointments/${id}/assign-consultant`
export const COUPON_API_WITH_ID = (id) => `coupons/${id}`
export const COUPON = 'coupons'
export const LIVE_APPOINTMENTS = "live-appointments"
export const AGORA_TOKEN = "/agora/token"

