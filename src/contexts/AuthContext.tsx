// src/contexts/AuthContext.tsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { authService } from '../services/auth.services';
import { storage, STORAGE_KEYS } from '../utils/storage/index';
import { ApiError } from '../types/api.types';
import * as AuthTypes from '../types/auth.types';
import { QueryClient, useQueryClient } from '@tanstack/react-query';

interface AuthContextType {
    user: AuthTypes.UserProfile | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isInitialized: boolean;
    signUp: (data: AuthTypes.SignUpRequest) => Promise<AuthTypes.SignUpResponse>;
    signIn: (data: AuthTypes.SignInRequest) => Promise<void>;
    socialAuth: (data: AuthTypes.SocialAuthRequest) => Promise<void>;
    verifyCode: (data: AuthTypes.VerifyCodeRequest) => Promise<boolean>;
    requestPasswordReset: (data: AuthTypes.RequestPasswordResetRequest) => Promise<void>;
    resetPassword: (data: AuthTypes.ResetPasswordRequest) => Promise<boolean>;
    logout: () => Promise<void>;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const queryClient = useQueryClient();
    const [user, setUser] = useState<AuthTypes.UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        initializeAuth();
    }, []);

    const initializeAuth = async () => {
        try {
            setIsLoading(true);
            const [token, storedUserData] = await Promise.all([
                storage.getItem(STORAGE_KEYS.AUTH_TOKEN),
                storage.getItem(STORAGE_KEYS.USER_DATA)
            ]);

            if (token) {
                // First set stored user data to avoid flicker
                if (storedUserData) {
                    setUser(JSON.parse(storedUserData));
                }

                // Then fetch fresh user data
                try {
                    const response = await authService.getCurrentUser();
                    if (response.data) {
                        setUser(response.data);
                        await storage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data));
                    }
                } catch (error) {
                    console.log('Failed to fetch fresh user data, using stored data');
                }
            }
        } catch (error) {
            await handleLogout();
        } finally {
            setIsLoading(false);
            setIsInitialized(true);
        }
    };

    const handleError = (error: unknown) => {
        let message = 'An unexpected error occurred';

        if (error instanceof ApiError) {
            message = error.message;
            if (error.errors) {
                message = Object.entries(error.errors)
                    .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
                    .join('\n');
            }
        } else if (error instanceof Error) {
            message = error.message;
        }

        setError(message);
        Alert.alert('Error', message);
    };

    const clearError = () => {
        setError(null);
    };

    const updateAuthState = async (authResponse: AuthTypes.AuthResponse) => {
        // Store tokens first
        await Promise.all([
            storage.setItem(STORAGE_KEYS.AUTH_TOKEN, authResponse.accessToken),
            storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, authResponse.refreshToken)
        ]);

        // Set temporary user data immediately for navigation
        const tempUser = {
            userId: authResponse.userId,
            email: '',  // Will be filled by getCurrentUser
            fullName: '',
            isVerified: true,
            userType: AuthTypes.ProfileType.Customer,
            createdAt: new Date().toISOString()
        } as AuthTypes.UserProfile;

        // Update state immediately
        setUser(tempUser);
        queryClient.setQueryData(['user'], tempUser);

        // Fetch full user profile in background
        try {
            const userResponse = await authService.getCurrentUser();
            if (userResponse.data) {
                setUser(userResponse.data);
                await storage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userResponse.data));
                queryClient.setQueryData(['user'], userResponse.data);
            }
        } catch (error) {
            console.error('Failed to fetch user profile after login:', error);
            // Keep the temporary user data if profile fetch fails
        }
    };

    const handleLogout = async () => {
        setUser(null);
        await Promise.all([
            storage.removeItem(STORAGE_KEYS.AUTH_TOKEN),
            storage.removeItem(STORAGE_KEYS.REFRESH_TOKEN),
            storage.removeItem(STORAGE_KEYS.USER_DATA)
        ]);
        queryClient.clear();
    };

    const signUp = async (data: AuthTypes.SignUpRequest) => {
        try {
            setIsLoading(true);
            const response = await authService.signUp(data);
            return response;
        } catch (error) {
            handleError(error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const signIn = async (data: AuthTypes.SignInRequest) => {
        try {
            setIsLoading(true);
            const response = await authService.signIn(data);
            if (response.data) {
                await updateAuthState(response.data);
            }
        } catch (error) {
            // Don't change user state on error, just handle the error
            handleError(error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const socialAuth = async (data: AuthTypes.SocialAuthRequest) => {
        try {
            setIsLoading(true);
            const response = await authService.socialAuth(data);
            if (response.data) {
                await updateAuthState(response.data);
            }
        } catch (error) {
            handleError(error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const verifyCode = async (data: AuthTypes.VerifyCodeRequest) => {
        try {
            setIsLoading(true);
            const response = await authService.verifyCode(data);
            return response.data || false;
        } catch (error) {
            handleError(error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const requestPasswordReset = async (data: AuthTypes.RequestPasswordResetRequest) => {
        try {
            setIsLoading(true);
            await authService.requestPasswordReset(data);
        } catch (error) {
            handleError(error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const resetPassword = async (data: AuthTypes.ResetPasswordRequest) => {
        try {
            setIsLoading(true);
            const response = await authService.resetPassword(data);
            return response.data || false;
        } catch (error) {
            handleError(error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            setIsLoading(true);
            await authService.logout();
        } catch (error) {
            handleError(error);
        } finally {
            await handleLogout();
            setIsLoading(false);
        }
    };

    const value = {
        user,
        isAuthenticated: !!user,
        isLoading,
        isInitialized,
        signUp,
        signIn,
        socialAuth,
        verifyCode,
        requestPasswordReset,
        resetPassword,
        logout,
        clearError,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;