export const ROLE_USER = 'user';
export const ROLE_VENDOR = 'vendor';
export function trimText(text: string) {
    text.trim();
    return text;
}

export const QUEUE_NAME = 'sm_main_queue';

export const QUEUE_JOBS = {
    EMAIL_SEND: "email_send",
    VIDEO_JOB: "video-job",
    AUDIO_JOB: "audio-job",
    NOTIFICATION: {
        send: "send",
        ASSIGN_APPOINTMENT: "assign_appointment"
    },
    send_payment_invoice: 'send_payment_invoice' 
}

export const RECIPIENT_TYPE = {
    User: "User",
    Consultant: "Consultant"
}

export const NotificationEventName = {
    end_call: "end_call",
    start_call: "start_call",
    incoming_call: "incoming_call",
}