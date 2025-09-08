import { Post } from "./api";
import { API_CONSULTANT } from "./endpoints";
/**
 * Sends a call start notification to the user for a given appointment. This is called when a consultant presses
 * the call now button from appointment details screen.
 *
 * This function makes an asynchronous POST request to notify the user that
 * their call is starting. Errors during the request are caught and logged,
 * but not re-thrown.
 *
 * @async
 * @function sendCallStartNotificationToUser
 * @param {number} appointment_id - The unique identifier of the appointment.
 * @returns {Promise<void>} A promise that resolves when the notification is sent or fails silently.
 * @throws {void} Does not throw errors — any network or server errors are caught and logged internally.
 *
 * @example
 * await sendCallStartNotificationToUser(12345);
 */
export const sendCallStartNotificationToUser = async (appointment_id) => {
    try {
        await Post(API_CONSULTANT.send_start_call_notification, {
            appointment_id,
        });
    }
    catch (error) {
        console.log("Notification Send error");
    }
};
/**
 * Sends a call end notification to the user associated with the given appointment. Sent from consultant app
 *
 * This function triggers a backend endpoint to notify the user that their call has ended.
 * Any errors during the HTTP request are caught and logged internally — no exceptions are thrown.
 *
 * @async
 * @function sendCallEndNotificationToUser
 * @param {number} appointment_id - The unique identifier of the appointment for which to send the end-call notification.
 * @returns {Promise<void>} A promise that resolves after the notification is sent or silently fails.
 *
 * @example
 * await sendCallEndNotificationToUser(789);
 *
 * @throws {void} Does not throw — errors are caught and logged to console.
 */
export const sendCallEndNotificationToUser = async (appointment_id) => {
    try {
        await Post(API_CONSULTANT.send_end_call_notification, {
            appointment_id,
        });
    }
    catch (error) {
        console.log("Notification Send error", error);
    }
};
