// src/api/axios/axiosConfig.ts

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import Constants from 'expo-constants';
import { storage } from '../../utils/storage/index';
import { Platform } from 'react-native';

export const API_URL = 'https://devanza-dev-backend.azurewebsites.net/api';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
    constructor(
        message: string,
        public statusCode?: number,
        public code?: string,
        public errors?: Record<string, string[]>
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

/**
 * Creates and configures an Axios instance for API requests
 */
export const createApiClient = (config?: AxiosRequestConfig): AxiosInstance => {
    const axiosInstance = axios.create({
        baseURL: API_URL,
        timeout: 15000, // 15 seconds
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        ...config,
    });

    // Add request interceptor
    axiosInstance.interceptors.request.use(
        async (config) => {
            // Get the token from storage
            const token = await storage.getItem('auth_token');

            // If token exists, add it to the headers
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            // Add device info
            config.headers['X-Device-Info'] = `Devanza-Mobile/${Constants.expoConfig?.version || '1.0.0'}`;
            config.headers['X-Platform'] = Platform.OS;

            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Add response interceptor
    axiosInstance.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
            if (!error.response) {
                // Network error
                throw new ApiError(
                    'Network error - please check your internet connection',
                    0,
                    'NETWORK_ERROR'
                );
            }

            // Handle specific status codes
            switch (error.response.status) {
                case 400:
                    throw new ApiError(
                        'Invalid request',
                        400,
                        'BAD_REQUEST',
                        (error.response.data as any)?.errors
                    );

                case 401:
                    // Clear auth data and notify auth store
                    await storage.removeItem('auth_token');
                    throw new ApiError(
                        'Authentication required',
                        401,
                        'UNAUTHORIZED'
                    );

                case 403:
                    throw new ApiError(
                        'Access denied',
                        403,
                        'FORBIDDEN'
                    );

                case 404:
                    throw new ApiError(
                        'Resource not found',
                        404,
                        'NOT_FOUND'
                    );

                case 422:
                    throw new ApiError(
                        'Validation failed',
                        422,
                        'VALIDATION_ERROR',
                        (error.response.data as any)?.errors
                    );

                case 429:
                    throw new ApiError(
                        'Too many requests - please try again later',
                        429,
                        'RATE_LIMIT'
                    );

                case 500:
                    throw new ApiError(
                        'Server error - please try again later',
                        500,
                        'SERVER_ERROR'
                    );

                default:
                    throw new ApiError(
                        'An unexpected error occurred',
                        error.response.status,
                        'UNKNOWN_ERROR'
                    );
            }
        });

    return axiosInstance;
};

// Create default API client instance
export const apiClient = createApiClient();

// Helper function to handle API errors in a consistent way
export const handleApiError = (error: unknown): never => {
    if (error instanceof ApiError) {
        throw error;
    }

    if (axios.isAxiosError(error)) {
        throw new ApiError(
            error.message,
            error.response?.status,
            'AXIOS_ERROR'
        );
    }

    // For unknown errors
    throw new ApiError(
        error instanceof Error ? error.message : 'An unknown error occurred',
        500,
        'UNKNOWN_ERROR'
    );
};

// Helper type for API responses
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: Record<string, string[]>;
}