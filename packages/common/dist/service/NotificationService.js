var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _NotificationService_endpoint;
import { Post } from "../api";
import { NotificationEventName } from "../utils";
export class NotificationService {
    constructor() {
        _NotificationService_endpoint.set(this, "notifications/send/calling");
    }
    async startCall(receiver_id, receiver_role, additionalInfo = null) {
        try {
            await Post(__classPrivateFieldGet(this, _NotificationService_endpoint, "f"), {
                receiver_role,
                receiver_id,
                event_title: "Start Call",
                event_name: NotificationEventName.start_call,
                additionalInfo
            });
        }
        catch (error) {
            console.log("Notification Send error");
        }
    }
    async endCall(receiver_id, receiver_role, additionalInfo = null) {
        try {
            await Post(__classPrivateFieldGet(this, _NotificationService_endpoint, "f"), {
                receiver_role,
                receiver_id,
                event_title: "End Call",
                event_name: NotificationEventName.end_call,
                additionalInfo
            });
        }
        catch (error) {
            console.log("Notification End error");
        }
    }
}
_NotificationService_endpoint = new WeakMap();
