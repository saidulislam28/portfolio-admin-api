
/* ------------------------------------------------------------------ */
/*  Enums                                                             */

import { getApiClient } from "./apiClient";


/* ------------------------------------------------------------------ */
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BANNED';

/* ------------------------------------------------------------------ */
/*  User DTOs & Types                                                 */
/* ------------------------------------------------------------------ */

export interface UserProfile {
    id: number;
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    profile_image?: string | null;
    private_notes?: string | null;
    is_approved: boolean;
    address?: string | null;
    description?: string | null;
    status: UserStatus;
    created_at: string;
    updated_at: string;
}

export interface Subscription {
    id: number;
    user_id: number;
    package_id: number;
    start_at: string;
    end_at: string;
    next_billing_date: string | null;
    status: 'ACTIVE' | 'INACTIVE' | 'CANCELLED' | string;
    created_at: string;
    updated_at: string;
    Package: Package;
    // Invoice: Invoice[];
}

export interface Package {
    id: number;
    package_type: string;
    title: string;
    slug: string;
    sub_title: string;
    sort_order: number;
    price: number;
    validity_in_month: number;
    image: string;
    is_active: boolean;
    is_features: boolean;
    created_at: string;
    updated_at: string;
}



/** Payload for PATCH /user-profile/update */
export interface UpdateUserProfileDto {
    name?: string;
    email?: string;
    phone?: string;
    profile_image?: string;
}

/** Payload for PATCH /user-profile/update-password */
export interface UpdatePasswordDto {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

/** Success message response */
export interface PasswordUpdateSuccess {
    message: string;
}

/* ------------------------------------------------------------------ */
/*  User-profile API helpers                                          */
/* ------------------------------------------------------------------ */

/**
 * GET current user profile (requires auth token)
 */
export const getCurrentUserProfile = async (): Promise<UserProfile> => {
    const resp = await getApiClient().get('user-profile/user');
    return resp.data.data as UserProfile;
};

/**
 * PATCH user details (name, email, phone, etc.)
 */
export const updateCurrentUserProfile = async (
    payload: UpdateUserProfileDto
) => {

    const resp = await getApiClient().patch(
        '/user-profile/update',
        payload
    );

    return resp.data.data as UserProfile;
};

/**
 * PATCH to change user password
 */
export const updateCurrentUserPassword = async (
    payload: UpdatePasswordDto,
) => {
    const resp = await getApiClient().patch(
        '/user-profile/update-password',
        payload,
    );
    return resp.data.data as PasswordUpdateSuccess;
};
