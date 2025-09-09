/**
 * Sends a call start notification to the user for a given appointment. This is called when a consultant presses
 * the call now button from appointment details screen.
 *
 * This function makes an asynchronous POST request to notify the user that
 * their call is starting. Errors during the request are caught and logged,
 * but not re-thrown.
 *
 * @async
 * @function sendConsultantStartCallNotification
 * @param {number} appointment_id - The unique identifier of the appointment.
 * @returns {Promise<void>} A promise that resolves when the notification is sent or fails silently.
 * @throws {void} Does not throw errors — any network or server errors are caught and logged internally.
 *
 * @example
 * await sendConsultantStartCallNotification(12345);
 */
export declare const sendCallStartNotificationToUser: (appointment_id: number) => Promise<void>;
/**
 * Sends a call end notification to the user associated with the given appointment. Sent from consultant app
 *
 * This function triggers a backend endpoint to notify the user that their call has ended.
 * Any errors during the HTTP request are caught and logged internally — no exceptions are thrown.
 *
 * @async
 * @function sendConsultantEndCallNotification
 * @param {number} appointment_id - The unique identifier of the appointment for which to send the end-call notification.
 * @returns {Promise<void>} A promise that resolves after the notification is sent or silently fails.
 *
 * @example
 * await sendConsultantEndCallNotification(789);
 *
 * @throws {void} Does not throw — errors are caught and logged to console.
 */
export declare const sendCallEndNotificationToUser: (appointment_id: number) => Promise<void>;
/**
 * Sends a call start notification to the consultant for a given appointment. This is called when a user starts
 * a call from their appointment screen.
 *
 * This function makes an asynchronous POST request to notify the consultant that
 * a call is starting. Errors during the request are caught and logged,
 * but not re-thrown.
 *
 * @async
 * @function sendUserStartCallNotification
 * @param {number} appointment_id - The unique identifier of the appointment.
 * @returns {Promise<void>} A promise that resolves when the notification is sent or fails silently.
 * @throws {void} Does not throw errors — any network or server errors are caught and logged internally.
 *
 * @example
 * await sendUserStartCallNotification(12345);
 */
export declare const sendCallStartNotificationToConsultant: (appointment_id: number) => Promise<void>;
/**
 * Sends a call end notification to the consultant associated with the given appointment. Sent from user app
 *
 * This function triggers a backend endpoint to notify the consultant that the call has ended.
 * Any errors during the HTTP request are caught and logged internally — no exceptions are thrown.
 *
 * @async
 * @function sendUserEndCallNotification
 * @param {number} appointment_id - The unique identifier of the appointment for which to send the end-call notification.
 * @returns {Promise<void>} A promise that resolves after the notification is sent or silently fails.
 *
 * @example
 * await sendUserEndCallNotification(789);
 *
 * @throws {void} Does not throw — errors are caught and logged to console.
 */
export declare const sendCallEndNotificationToConsultant: (appointment_id: number) => Promise<void>;
