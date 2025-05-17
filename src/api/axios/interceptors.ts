// src/api/axios/interceptors.ts

import { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { Platform, Alert } from 'react-native';
import Constants from 'expo-constants';
import { storage, STORAGE_KEYS } from '../../utils/storage/index';
import { ApiError } from '../../types/api.types';
import { refreshTokenFn } from '../../services/auth.services';
import { CommonActions } from '@react-navigation/native';

interface RetryConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

// Navigation reference that will be set from App.tsx
let navigationRef: any = null;

export const setNavigationRef = (ref: any) => {
    navigationRef = ref;
};

export const setupInterceptors = (instance: AxiosInstance) => {
    // Request Interceptor
    instance.interceptors.request.use(
        async (config: InternalAxiosRequestConfig) => {
            try {
                // Add authorization header
                const token = await storage.getItem(STORAGE_KEYS.AUTH_TOKEN);
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }

                // Add common headers
                config.headers['X-Client-Version'] = Constants.expoConfig?.version || '1.0.0';
                config.headers['X-Platform'] = Platform.OS;
                config.headers['X-Device-Id'] = await storage.getItem(STORAGE_KEYS.DEVICE_ID);

                // Add request timestamp
                config.headers['X-Request-Time'] = new Date().toISOString();

                // Log request in development
                if (__DEV__) {
                    console.log(`🟦 [API Request] ${config.method?.toUpperCase()} ${config.url}`, {
                        headers: config.headers,
                        data: config.data,
                        params: config.params,
                    });
                }

                return config;
            } catch (error) {
                return Promise.reject(error);
            }
        },
        (error) => {
            if (__DEV__) {
                console.log('🔴 [Request Error]', error);
            }
            return Promise.reject(error);
        }
    );

    // Response Interceptor
    instance.interceptors.response.use(
        (response) => {
            // Log response in development
            if (__DEV__) {
                console.log(`🟩 [API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
                    status: response.status,
                    data: response.data,
                });
            }

            return response;
        },
        async (error: AxiosError) => {
            const originalConfig = error.config as RetryConfig;

            if (__DEV__) {
                console.log('🔴 [Response Error]', {
                    status: error.response?.status,
                    data: error.response?.data,
                    config: originalConfig,
                });
            }

            // Handle token refresh
            if (error.response?.status === 401 && !originalConfig?._retry) {
                originalConfig._retry = true;

                try {
                    const refreshToken = await storage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

                    // Skip refresh attempt if this is already a refresh token request
                    if (originalConfig.url?.includes('/refresh-token')) {
                        throw new Error('Refresh token failed');
                    }

                    if (refreshToken) {
                        // Attempt to refresh the token
                        const response = await refreshTokenFn(refreshToken);

                        if (response.data?.token) {
                            // Store new tokens
                            await storage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
                            if (response.data.refreshToken) {
                                await storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.data.refreshToken);
                            }

                            // Update authorization header
                            if (originalConfig.headers) {
                                originalConfig.headers.Authorization = `Bearer ${response.data.token}`;
                            }

                            // Retry the original request
                            return instance(originalConfig);
                        }
                    }
                } catch (refreshError) {
                    // Handle refresh token failure
                    await handleAuthFailure();
                    return Promise.reject(new ApiError(
                        'Session expired. Please login again.',
                        401,
                        'SESSION_EXPIRED'
                    ));
                }
            }

            // Transform error response
            const errorResponse = error.response?.data as { message?: string; errors?: any };
            const statusCode = error.response?.status;

            // Handle various error scenarios
            switch (statusCode) {
                case 400:
                    throw new ApiError(
                        errorResponse?.message || 'Invalid request',
                        statusCode,
                        'BAD_REQUEST',
                        errorResponse?.errors
                    );

                case 401:
                    await handleAuthFailure();
                    throw new ApiError(
                        'Authentication required',
                        statusCode,
                        'UNAUTHORIZED'
                    );

                case 403:
                    throw new ApiError(
                        errorResponse?.message || 'Access denied',
                        statusCode,
                        'FORBIDDEN'
                    );

                case 404:
                    throw new ApiError(
                        errorResponse?.message || 'Resource not found',
                        statusCode,
                        'NOT_FOUND'
                    );

                case 422:
                    throw new ApiError(
                        errorResponse?.message || 'Validation failed',
                        statusCode,
                        'VALIDATION_ERROR',
                        errorResponse?.errors
                    );

                case 429:
                    throw new ApiError(
                        'Too many requests. Please try again later.',
                        statusCode,
                        'RATE_LIMIT'
                    );

                default:
                    // Handle network errors
                    if (!error.response) {
                        throw new ApiError(
                            'Network error. Please check your connection.',
                            0,
                            'NETWORK_ERROR'
                        );
                    }

                    // Handle unknown errors
                    throw new ApiError(
                        errorResponse?.message || 'An unexpected error occurred',
                        statusCode,
                        'UNKNOWN_ERROR',
                        errorResponse?.errors
                    );
            }
        });
};

// Helper function to handle authentication failures
const handleAuthFailure = async () => {
    // Clear auth data
    await storage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    await storage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    await storage.removeItem(STORAGE_KEYS.USER_DATA);

    // Show alert and navigate to splash
    Alert.alert(
        'Session Expired',
        'Your session has expired. Please login again.',
        [
            {
                text: 'OK',
                onPress: () => {
                    // Navigate to splash screen
                    if (navigationRef && navigationRef.current) {
                        navigationRef.current.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [{ name: 'splash' }],
                            })
                        );
                    }
                }
            }
        ],
        { cancelable: false }
    );
};