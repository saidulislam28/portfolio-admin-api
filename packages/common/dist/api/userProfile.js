/* ------------------------------------------------------------------ */
/*  Enums                                                             */
import { getApiClient } from "./apiClient";
/* ------------------------------------------------------------------ */
/*  User-profile API helpers                                          */
/* ------------------------------------------------------------------ */
/**
 * GET current user profile (requires auth token)
 */
export const getCurrentUserProfile = async () => {
    const resp = await getApiClient().get('user-profile/user');
    return resp.data.data;
};
/**
 * PATCH user details (name, email, phone, etc.)
 */
export const updateCurrentUserProfile = async (payload) => {
    const resp = await getApiClient().patch('/user-profile/update', payload);
    return resp.data.data;
};
/**
 * PATCH to change user password
 */
export const updateCurrentUserPassword = async (payload) => {
    const resp = await getApiClient().patch('/user-profile/update-password', payload);
    return resp.data.data;
};
