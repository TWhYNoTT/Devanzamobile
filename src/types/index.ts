// src/types/index.ts

/**
 * Type Definitions for Devanza Mobile App
 * All TypeScript types, interfaces, and enums
 */

/**
 * App State & User Types
 */
export type Theme = 'light' | 'dark';

export interface UserPreferences {
    language: string;
    theme: Theme;
    notifications: boolean;
}

export interface UserInfo {
    id: string;
    email: string;
    name: string;
    preferences: UserPreferences;
}

export interface AppState {
    isAuthenticated: boolean;
    userInfo: UserInfo | null;
    language: string;
    theme: Theme;
    changeLanguage: (lang: string) => Promise<void>;
    changeTheme: (theme: Theme) => Promise<void>;
    logout: () => Promise<void>;
}

/**
 * Navigation Types
 */
export interface LoginPageParams {
    navigate?: string;
}

export type RootStackParamList = {
    splash: undefined;
    Welcome: undefined;
    Login: undefined;
    Register: undefined;
    ForgetPassword: undefined;
    home: undefined;
    LocationPicker: undefined;
    Search: undefined;
    BranchesSelectionPage: undefined;
    branchDetails: undefined;
    BookingDetails: undefined;
    categories: undefined;
    categoriesDetails: undefined;
    viewAll: undefined;
    OptionsForService: undefined;
    OptionSelectDate: undefined;
    Bookings: undefined;

};

/**
 * Authentication Types
 * All auth-related types except ApiResponse (exported from api.types)
 */
export {
    SignUpRequest,
    SignUpResponse,
    SignInRequest,
    AuthResponse,
    UserProfile,
    SocialAuthRequest,
    VerifyCodeRequest,
    RequestPasswordResetRequest,
    ResetPasswordRequest,
    UserSession,
    ProfileType
} from './auth.types';

/**
 * API Types
 * Including the main ApiResponse type
 */
export * from './api.types';

// Import for type guards
import { ApiError } from './api.types';
import { AuthResponse } from './auth.types';

/**
 * Type Guards
 */
export const isApiError = (error: any): error is ApiError => {
    return error instanceof ApiError || (error && error.name === 'ApiError');
};

export const isAuthResponse = (response: any): response is AuthResponse => {
    return response &&
        typeof response.accessToken === 'string' &&
        typeof response.refreshToken === 'string' &&
        typeof response.userId === 'number';
};

/**
 * Type Aliases
 */
export type ID = number;
export type ISO8601DateTime = string;
export type Currency = string;
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type AsyncFunction<T = void, R = void> = (arg: T) => Promise<R>;