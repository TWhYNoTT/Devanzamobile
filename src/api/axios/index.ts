// src/api/axios/index.ts

import axios from 'axios';
import { API_URL } from './axiosConfig';
import { setupInterceptors, setNavigationRef } from './interceptors';

export const createAxiosInstance = () => {
    const instance = axios.create({
        baseURL: API_URL,
        timeout: 15000,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    });

    setupInterceptors(instance);

    return instance;
};

export const api = createAxiosInstance();

// Export the navigation ref setter
export { setNavigationRef };

// Re-export useful items
export { API_URL } from './axiosConfig';
export { ApiError } from './axiosConfig';
export type { ApiResponse } from './axiosConfig';