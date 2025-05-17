// src/hooks/useAuth.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { ApiError } from '../types/api.types';
import * as AuthTypes from '../types/auth.types';
import { authService } from '../services/auth.services';
import { storage, STORAGE_KEYS } from '../utils/storage/index';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useAuth = () => {
    const queryClient = useQueryClient();
    const [isInitialized, setIsInitialized] = useState(false);

    // Helper functions
    const handleError = useCallback((error: unknown) => {
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

        Alert.alert('Error', message);
    }, []);

    const handleLogout = useCallback(async () => {
        await storage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        await storage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        await storage.removeItem(STORAGE_KEYS.USER_DATA);
        queryClient.setQueryData(['user'], null);
        queryClient.clear();
    }, [queryClient]);

    // State management
    const { data: user, isLoading: isUserLoading } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const userData = await storage.getItem(STORAGE_KEYS.USER_DATA);
            return userData ? JSON.parse(userData) : null;
        },
    });

    // Initialize auth state
    useEffect(() => {
        const initAuth = async () => {
            try {
                const token = await storage.getItem(STORAGE_KEYS.AUTH_TOKEN);
                if (token) {
                    const response = await authService.getCurrentUser();
                    if (response.data) {
                        queryClient.setQueryData(['user'], response.data);
                    }
                }
            } catch (error) {
                await handleLogout();
            } finally {
                setIsInitialized(true);
            }
        };

        initAuth();
    }, [queryClient, handleLogout]);

    // Sign Up Mutation
    const signUpMutation = useMutation({
        mutationFn: async (data: AuthTypes.SignUpRequest) => {
            const response = await authService.signUp(data);
            return response;
        },
        onError: handleError,
    });

    // Sign In Mutation - FIXED to handle new structure
    const signInMutation = useMutation({
        mutationFn: async (data: AuthTypes.SignInRequest) => {
            const response = await authService.signIn(data);
            if (response.data) {
                // Fetch user profile after successful login
                const userResponse = await authService.getCurrentUser();
                if (userResponse.data) {
                    queryClient.setQueryData(['user'], userResponse.data);
                }
            }
            return response.data;
        },
        onError: handleError,
    });

    // Social Auth Mutation
    const socialAuthMutation = useMutation({
        mutationFn: async (data: AuthTypes.SocialAuthRequest) => {
            const response = await authService.socialAuth(data);
            if (response.data) {
                // Fetch user profile after successful login
                const userResponse = await authService.getCurrentUser();
                if (userResponse.data) {
                    queryClient.setQueryData(['user'], userResponse.data);
                }
            }
            return response.data;
        },
        onError: handleError,
    });

    // Verify Code Mutation
    const verifyCodeMutation = useMutation({
        mutationFn: (data: AuthTypes.VerifyCodeRequest) => authService.verifyCode(data),
        onError: handleError,
    });

    // Password Reset Request Mutation
    const requestPasswordResetMutation = useMutation({
        mutationFn: (data: AuthTypes.RequestPasswordResetRequest) =>
            authService.requestPasswordReset(data),
        onError: handleError,
    });

    // Reset Password Mutation
    const resetPasswordMutation = useMutation({
        mutationFn: (data: AuthTypes.ResetPasswordRequest) => authService.resetPassword(data),
        onError: handleError,
    });

    // Logout Mutation
    const logoutMutation = useMutation({
        mutationFn: () => authService.logout(),
        onSuccess: () => handleLogout(),
        onError: async (error) => {
            // Still clear local auth state even if API call fails
            await handleLogout();
            handleError(error);
        },
    });

    // Public methods
    const signUp = useCallback(async (data: AuthTypes.SignUpRequest) => {
        return signUpMutation.mutateAsync(data);
    }, [signUpMutation]);

    const signIn = useCallback(async (data: AuthTypes.SignInRequest) => {
        return signInMutation.mutateAsync(data);
    }, [signInMutation]);

    const socialAuth = useCallback(async (data: AuthTypes.SocialAuthRequest) => {
        return socialAuthMutation.mutateAsync(data);
    }, [socialAuthMutation]);

    const verifyCode = useCallback(async (data: AuthTypes.VerifyCodeRequest) => {
        const response = await verifyCodeMutation.mutateAsync(data);
        return response || false;
    }, [verifyCodeMutation]);

    const requestPasswordReset = useCallback(async (data: AuthTypes.RequestPasswordResetRequest) => {
        return requestPasswordResetMutation.mutateAsync(data);
    }, [requestPasswordResetMutation]);

    const resetPassword = useCallback(async (data: AuthTypes.ResetPasswordRequest) => {
        const response = await resetPasswordMutation.mutateAsync(data);
        return response.data || false;
    }, [resetPasswordMutation]);

    const logout = useCallback(async () => {
        await logoutMutation.mutateAsync();
    }, [logoutMutation]);

    // Computed values
    const authState = useMemo(() => ({
        user,
        isAuthenticated: !!user,
        isLoading: !isInitialized || isUserLoading ||
            signUpMutation.isPending ||
            signInMutation.isPending ||
            socialAuthMutation.isPending ||
            verifyCodeMutation.isPending ||
            requestPasswordResetMutation.isPending ||
            resetPasswordMutation.isPending ||
            logoutMutation.isPending,
        isInitialized,
    }), [
        user,
        isInitialized,
        isUserLoading,
        signUpMutation.isPending,
        signInMutation.isPending,
        socialAuthMutation.isPending,
        verifyCodeMutation.isPending,
        requestPasswordResetMutation.isPending,
        resetPasswordMutation.isPending,
        logoutMutation.isPending,
    ]);

    return {
        ...authState,
        signUp,
        signIn,
        socialAuth,
        verifyCode,
        requestPasswordReset,
        resetPassword,
        logout,
    };
};