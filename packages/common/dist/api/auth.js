import { getApiClient } from "./apiClient";
import { API_CONSULTANT, API_USER } from "./endpoints";
/**
 * Authenticates user via social provider (Google, Apple, etc.)
 * @param payload - Social login data
 * @returns User object with token on success
 */
export const socialLogin = async (payload) => {
    const resp = await getApiClient().post(API_USER.social_login, payload);
    return resp.data;
};
// Updated registerUser function with proper types
export const registerUser = async (userData) => {
    const resp = await getApiClient().post('auth/register', userData);
    return resp.data;
};
export const loginUser = async (email, password, phone) => {
    const resp = await getApiClient().post('auth/login', { email, password });
    return resp.data;
};
export const loginConsultant = async (email, password) => {
    const resp = await getApiClient().post(API_CONSULTANT.login, { email, password });
    return resp.data;
};
export const verifyOtpUser = async (email, otp) => {
    const resp = await getApiClient().post(API_USER.verify_otp, { email, otp });
    return resp.data;
};
