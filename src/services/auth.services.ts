// src/api/services/auth.services.ts

import { api } from '../api/axios';
import { storage, STORAGE_KEYS } from '../utils/storage/index';
import { ApiError, ApiResponse } from '../types/api.types';
import * as AuthTypes from '../types/auth.types';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
export class AuthService {
    private static instance: AuthService;
    private readonly BASE_PATH = '/Auth';

    private constructor() { }

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    /**
 * Sign up a new user
 */
    async signUp(data: AuthTypes.SignUpRequest): Promise<AuthTypes.SignUpResponse> {
        try {
            const response = await api.post<any>(
                `${this.BASE_PATH}/register`,
                {
                    ...data,
                    deviceInfo: this.getDeviceInfo()
                }
            );

            if (response.data) {
                console.log('Auth service signUp response:', response.data);
                return {
                    userId: response.data.userId,
                    verificationToken: response.data.verificationToken || ''
                };
            }

            throw new ApiError('Invalid response from server', 500, 'INVALID_RESPONSE');
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Sign in user with email/phone and password - FIXED to match backend
     */
    async signIn(data: AuthTypes.SignInRequest): Promise<ApiResponse<AuthTypes.AuthResponse>> {
        try {
            const response = await api.post<AuthTypes.AuthResponse>(
                `${this.BASE_PATH}/login`,
                {
                    identifier: data.identifier,
                    password: data.password,
                    userType: AuthTypes.ProfileType.Customer  // Always set to Customer
                }
            );

            if (response.data) {
                await this.handleAuthSuccess(response.data);

                // Return wrapped response for consistency
                return {
                    success: true,
                    data: response.data
                };
            }

            throw new ApiError('Invalid response from server', 500, 'INVALID_RESPONSE');
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Sign in with social provider
     */
    async socialAuth(data: AuthTypes.SocialAuthRequest): Promise<ApiResponse<AuthTypes.AuthResponse>> {
        try {
            const response = await api.post<AuthTypes.AuthResponse>(
                `${this.BASE_PATH}/social-auth`,
                {
                    ...data,
                    userType: AuthTypes.ProfileType.Customer,  // Always set to Customer
                    deviceInfo: this.getDeviceInfo()
                }
            );

            if (response.data) {
                await this.handleAuthSuccess(response.data);

                return {
                    success: true,
                    data: response.data
                };
            }

            throw new ApiError('Invalid response from server', 500, 'INVALID_RESPONSE');
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Verify user account using verification code
     */
    async verifyCode(data: AuthTypes.VerifyCodeRequest): Promise<any> {
        try {
            const response = await api.post<ApiResponse<boolean>>(
                `${this.BASE_PATH}/verify-code`,
                data
            );
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Request password reset
     */
    async requestPasswordReset(data: AuthTypes.RequestPasswordResetRequest): Promise<ApiResponse<void>> {
        try {
            const response = await api.post<ApiResponse<void>>(
                `${this.BASE_PATH}/password-reset/request`,
                data
            );
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Reset password using token/code
     */
    async resetPassword(data: AuthTypes.ResetPasswordRequest): Promise<ApiResponse<boolean>> {
        try {
            const response = await api.post<ApiResponse<boolean>>(
                `${this.BASE_PATH}/password-reset/reset`,
                data
            );
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
       * Get current user's profile
       */
    async getCurrentUser(): Promise<ApiResponse<AuthTypes.UserProfile>> {
        try {
            const response = await api.get<AuthTypes.UserProfile>(`${this.BASE_PATH}/me`);

            // If the response has the user data directly, wrap it
            if (response.data && 'userId' in response.data) {
                return {
                    success: true,
                    data: response.data
                };
            }

            // Otherwise return as is
            return response.data as ApiResponse<AuthTypes.UserProfile>;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Get user's active sessions
     */
    async getSessions(): Promise<ApiResponse<AuthTypes.UserSession[]>> {
        try {
            const response = await api.get<ApiResponse<AuthTypes.UserSession[]>>(
                `${this.BASE_PATH}/sessions`
            );
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Refresh authentication token
     */
    async refreshToken(refreshToken: string): Promise<ApiResponse<{ token: string; refreshToken?: string }>> {
        try {
            const response = await api.post<ApiResponse<{ token: string; refreshToken?: string }>>(
                `${this.BASE_PATH}/refresh-token`,
                {
                    refreshToken,
                    deviceInfo: this.getDeviceInfo()
                }
            );
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Log out user
     */
    async logout(): Promise<void> {
        try {
            await api.post(`${this.BASE_PATH}/logout`, {
                deviceInfo: this.getDeviceInfo()
            });
            await this.clearAuth();
        } catch (error) {
            // Still clear auth data even if API call fails
            await this.clearAuth();
            throw this.handleError(error);
        }
    }

    /**
     * Check if user is authenticated
     */
    async isAuthenticated(): Promise<boolean> {
        const token = await storage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        return !!token;
    }

    /**
     * Get stored user data
     */
    async getStoredUser(): Promise<AuthTypes.UserProfile | null> {
        const userData = await storage.getItem(STORAGE_KEYS.USER_DATA);
        return userData ? JSON.parse(userData) : null;
    }

    // Private helper methods

    /**
       * Handle successful authentication - stores tokens only
       */
    private async handleAuthSuccess(authData: AuthTypes.AuthResponse): Promise<void> {
        await Promise.all([
            storage.setItem(STORAGE_KEYS.AUTH_TOKEN, authData.accessToken),
            storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, authData.refreshToken)
            // Don't store partial user data here
        ]);
    }

    /**
     * Clear authentication data
     */
    private async clearAuth(): Promise<void> {
        await Promise.all([
            storage.removeItem(STORAGE_KEYS.AUTH_TOKEN),
            storage.removeItem(STORAGE_KEYS.REFRESH_TOKEN),
            storage.removeItem(STORAGE_KEYS.USER_DATA)
        ]);
    }

    /**
     * Get device information
     */
    private getDeviceInfo(): string {
        return `Devanza-Mobile/${Constants.expoConfig?.version || '1.0.0'} (${Platform.OS})`;
    }

    /**
     * Handle API errors
     */
    private handleError(error: unknown): never {
        if (error instanceof ApiError) {
            throw error;
        }

        throw new ApiError(
            error instanceof Error ? error.message : 'An unexpected error occurred',
            500,
            'UNKNOWN_ERROR'
        );
    }
}

// Export a singleton instance
export const authService = AuthService.getInstance();

// Export the refresh token function for interceptors
export const refreshTokenFn = (refreshToken: string) =>
    authService.refreshToken(refreshToken);