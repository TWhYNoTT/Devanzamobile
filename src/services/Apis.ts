// src/services/apis.ts
import { api } from './api';

// Endpoints
export const FORGOT_PASSWORD = '/auth/reset-password-otp';
export const VERIFY = '/auth/verify';

// Types
interface LocationParams {
    lat: number;
    lng: number;
}

interface LoginParams {
    email: string;
    password: string;
}

interface SocialParams {
    socialId: string;
    email: string;
    name: string;
    provider: string;
}

interface RegisterParams {
    email: string;
    password: string;
    name: string;
    phone: string;
}

interface OtpParams {
    type: number;
    phone: string;
}

interface AddressParams {
    id?: number;
    address: string;
    lat: number;
    lng: number;
    type: string;
}

interface BookingParams {
    id?: number;
    page: number;
}

interface ContactParams {
    subject: string;
    message: string;
}

interface ProfileParams {
    name?: string;
    email?: string;
    phone?: string;
}

interface FcmParams {
    token: string;
}

interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data: T;
    code?: number;
}

// API Functions
export const home = (params: LocationParams) => {
    return api.get<ApiResponse>(`/devura/home?lat=${params.lat}&lng=${params.lng}`);
};

export const login = (params: LoginParams) => {
    return api.post<ApiResponse>('/auth/login', params);
};

export const social = (params: SocialParams) => {
    return api.post<ApiResponse>('/auth/registerSocial', params);
};

export const register = (params: RegisterParams) => {
    return api.post<ApiResponse>('/auth/register', params);
};

export const otp = (params: OtpParams) => {
    if (params.type === 1) {
        return api.post<ApiResponse>('/auth/otpSendForgotPassword', params);
    }
    return api.post<ApiResponse>('/auth/otpSend', params);
};

export const Addaddress = (params: AddressParams) => {
    return api.post<ApiResponse>('/address', params);
};

export const Updateaddress = (params: AddressParams) => {
    return api.put<ApiResponse>(`/address/${params.id}`, params);
};

export const Deleteaddress = (id: number) => {
    return api.delete<ApiResponse>(`/address/${id}`);
};

export const cancelBooking = (id: number, params: any) => {
    return api.put<ApiResponse>(`/bookings/${id}`, params);
};

export const address = () => {
    return api.get<ApiResponse>('/address/');
};

export const employes = (params: { id: number }) => {
    return api.get<ApiResponse>(`/employee/app?branch=${params.id}`);
};

export const bookings = (params: BookingParams) => {
    return api.get<ApiResponse>(`/bookings?page=${params.page}&selection=true`);
};

export const contactus = (params: ContactParams) => {
    return api.post<ApiResponse>('/request', params);
};

export const resetPassword = (params: { password: string; token: string }) => {
    return api.post<ApiResponse>('/auth/resetPassword', params);
};

export const fetchProfile = () => {
    return api.get<ApiResponse>('/users/profile');
};

export const updateProfile = (params: ProfileParams) => {
    return api.put<ApiResponse>('/users/profile', params);
};

export const updateFcm = (params: FcmParams) => {
    return api.put<ApiResponse>('/users/fcm', params);
};

// Generic API Handlers with Better Error Handling
export const Post = async <T>(url: string, params: any): Promise<T> => {
    try {
        const response = await api.post<ApiResponse<T>>(url, params);
        if (response.data.code) {
            throw new Error(response.data.message);
        }
        return response.data.data;
    } catch (error: any) {
        if (error.response) {
            throw error.response.data;
        }
        throw { message: 'Please check your internet connection' };
    }
};

export const Put = async <T>(url: string, params: any): Promise<T> => {
    try {
        const response = await api.put<ApiResponse<T>>(url, params);
        if (response.data.code) {
            throw new Error(response.data.message);
        }
        return response.data.data;
    } catch (error: any) {
        if (error.response) {
            throw error.response.data;
        }
        throw { message: 'Please check your internet connection' };
    }
};

export const Get = async <T>(url: string): Promise<T> => {
    try {
        const response = await api.get<ApiResponse<T>>(url);
        if (response.data.code) {
            throw new Error(response.data.message);
        }
        return response.data.data;
    } catch (error: any) {
        if (error.response) {
            throw error.response.data;
        }
        throw { message: 'Please check your internet connection' };
    }
};