import { Post } from "../api";
import { NotificationEventName } from "../utils";

export class NotificationService {
    #endpoint = "notifications/send/calling"

    async startCall(receiver_id: number, receiver_role: string, additionalInfo: any = null) {
        try {
            await Post(this.#endpoint, {
                receiver_role,
                receiver_id,
                event_title: "Start Call",
                event_name: NotificationEventName.start_call,
                additionalInfo
            })
        } catch (error) {
            console.log("Notification Send error");
        }

    }

    async endCall(receiver_id: number, receiver_role: string, additionalInfo: any = null) {
        try {
            await Post(this.#endpoint, {
                receiver_role,
                receiver_id,
                event_title: "End Call",
                event_name: NotificationEventName.end_call,
                additionalInfo
            })
        } catch (error) {
            console.log("Notification End error");
        }
    }
}