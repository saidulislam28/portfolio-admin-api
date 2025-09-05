export interface RegisterUserData {
    full_name: string;
    email: string;
    password: string;
    phone?: string;
    expected_level: 'low' | 'medium' | 'high';
}
export interface RegisterUserResponse {
    success: boolean;
    message?: string;
    error?: string;
    data?: {
        email: string;
        id?: string;
        full_name?: string;
        phone?: string;
        expected_level?: string;
        created_at?: string;
        updated_at?: string;
    };
}
export interface User {
    id: number;
    full_name?: string;
    email?: string;
    phone?: string;
    password?: string;
    token?: string | null;
    device_type?: string | null;
    timezone?: string;
    expected_level?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_verified?: boolean;
    is_test_user?: boolean;
    login_type?: 'EMAIL' | 'GOOGLE' | 'APPLE' | string;
    profile_image?: string;
    role?: 'USER' | 'ADMIN' | string;
}
export interface LoginUserResponse {
    success: boolean;
    data: User;
}
export interface ApiResponse<T> {
    data: T;
    status: number;
    statusText: string;
}
export declare const registerUser: (userData: RegisterUserData) => Promise<RegisterUserResponse>;
export declare const loginUser: (email: string, password: string, phone: string) => Promise<LoginUserResponse>;
