import { IAppointmentStatus } from "../types";
export const NotificationEventName = {
    end_call: "end_call",
    start_call: "start_call",
    incoming_call: "incoming_call"
};
export const USER_ROLE = {
    consultant: "CONSULTANT",
    user: "USER",
};
export const NotificationChannel = {
    "calls": "calls",
    "call": "call"
};
export const NO_IMAGE_TEXT = "NOT_AVAILABLE"; // the fcm data push we get when someone calls, this is the valeu we will receive if user or consultant 
// image is not available, so that we can show a placeholder
export const ADMIN_CALL_USER_ID = 999999;
export const PACKAGE_SERVICE_TYPE = {
    book_purchase: 'book_purchase',
    ielts_gt: 'ielts_gt',
    ielts_academic: 'ielts_academic',
    spoken: 'spoken',
    speaking_mock_test: 'speaking_mock_test',
    conversation: 'conversation',
    exam_registration: 'exam_registration',
    study_abroad: 'study_abroad'
};
export const APPOINTMENT_STATUS_COLOR = {
    [IAppointmentStatus.CANCELLED]: '#FF6B6B',
    [IAppointmentStatus.COMPLETED]: '#4ECDC4',
    [IAppointmentStatus.CONFIRMED]: '#45B7D1',
    [IAppointmentStatus.PENDING]: '#FFA726',
};
export const SERVICE_TYPE_LABELS = {
    [PACKAGE_SERVICE_TYPE.speaking_mock_test]: 'Mock Test',
    [PACKAGE_SERVICE_TYPE.conversation]: 'Conversation',
};
export const DEFAULT_QUERY_STALE_TIME = 1000 * 60 * 3; // 3 minutes
export const DEFAULT_QUERY_GC_TIME = 1000 * 60 * 30; // 30 min https://tanstack.com/query/latest/docs/framework/react/guides/migrating-to-v5#rename-cachetime-to-gctime
export const CONTACTS = {
    support_mail: 'info.speakingmate@gmail.com',
    call_support: '+1-800-123-4567',
    privacy_policy_url: ''
};
