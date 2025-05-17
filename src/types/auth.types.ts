// src/types/auth.types.ts

import { ProfileType } from './api.types';

export interface SignUpRequest {
    email: string;
    password: string;
    confirmPassword: string;
    phoneNumber: string;
    fullName: string;
    userType: ProfileType;
}

export interface SignUpResponse {
    userId: number;
    verificationToken: string;
}

export interface SignInRequest {
    identifier: string; // email or phone
    password: string;
}

export interface AuthResponse {
    userId: number;
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
}

export interface UserProfile {
    userId: number;
    email: string;
    phoneNumber: string;
    fullName: string;
    profilePictureUrl?: string;
    userType: ProfileType;
    isActive: boolean;
    isVerified: boolean;
    createdAt: string;
    lastLoginAt?: string;
}

export interface SocialAuthRequest {
    provider: string;
    providerId: string;
    email?: string;
    fullName?: string;
    profilePictureUrl?: string;
}

export interface VerifyCodeRequest {
    userId: number;
    code: string;
}

export interface RequestPasswordResetRequest {
    email: string;
}

export interface ResetPasswordRequest {
    token: string;
    newPassword: string;
    confirmNewPassword: string;
}

export interface UserSession {
    sessionId: string;
    deviceInfo: string;
    createdAt: string;
    lastActivityAt: string;
    isCurrentSession: boolean;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: Record<string, string[]>;
}

// Re-export ProfileType for convenience
export { ProfileType };