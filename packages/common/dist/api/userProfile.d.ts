export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BANNED';
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
/**
 * GET current user profile (requires auth token)
 */
export declare const getCurrentUserProfile: () => Promise<UserProfile>;
/**
 * PATCH user details (name, email, phone, etc.)
 */
export declare const updateCurrentUserProfile: (payload: UpdateUserProfileDto) => Promise<UserProfile>;
/**
 * PATCH to change user password
 */
export declare const updateCurrentUserPassword: (payload: UpdatePasswordDto) => Promise<PasswordUpdateSuccess>;
