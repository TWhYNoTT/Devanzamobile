// src/utils/storage/index.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Define storage keys as constants to avoid typos and enable autocompletion
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'auth_token',
    REFRESH_TOKEN: 'refresh_token',
    USER_DATA: 'user_data',
    APP_SETTINGS: 'app_settings',
    LANGUAGE: 'selected_language',
    THEME: 'selected_theme',
    NOTIFICATIONS: 'notifications_settings',
    ONBOARDING_COMPLETED: 'onboarding_completed',
    DEVICE_ID: 'device_id',
} as const;

// Type for the storage keys
export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

// Interface for storage operations
interface IStorage {
    setItem(key: string, value: string): Promise<void>;
    getItem(key: string): Promise<string | null>;
    removeItem(key: string): Promise<void>;
    clear(): Promise<void>;
}

// Secure storage implementation
class SecureStorage implements IStorage {
    async setItem(key: string, value: string): Promise<void> {
        if (Platform.OS === 'web') {
            // Fall back to localStorage on web with encryption
            const encryptedValue = btoa(value); // Basic encryption for demo
            localStorage.setItem(key, encryptedValue);
            return;
        }
        await SecureStore.setItemAsync(key, value);
    }

    async getItem(key: string): Promise<string | null> {
        if (Platform.OS === 'web') {
            const encryptedValue = localStorage.getItem(key);
            return encryptedValue ? atob(encryptedValue) : null;
        }
        return await SecureStore.getItemAsync(key);
    }

    async removeItem(key: string): Promise<void> {
        if (Platform.OS === 'web') {
            localStorage.removeItem(key);
            return;
        }
        await SecureStore.deleteItemAsync(key);
    }

    async clear(): Promise<void> {
        // Note: SecureStore doesn't have a clear all method
        // We need to clear known secure keys individually
        const secureKeys = [
            STORAGE_KEYS.AUTH_TOKEN,
            STORAGE_KEYS.REFRESH_TOKEN,
            STORAGE_KEYS.USER_DATA,
        ];

        await Promise.all(secureKeys.map(key => this.removeItem(key)));
    }
}

// Regular storage implementation using AsyncStorage
class RegularStorage implements IStorage {
    async setItem(key: string, value: string): Promise<void> {
        await AsyncStorage.setItem(key, value);
    }

    async getItem(key: string): Promise<string | null> {
        return await AsyncStorage.getItem(key);
    }

    async removeItem(key: string): Promise<void> {
        await AsyncStorage.removeItem(key);
    }

    async clear(): Promise<void> {
        await AsyncStorage.clear();
    }
}

// Storage manager that handles both secure and regular storage
class StorageManager {
    private secureStorage: SecureStorage;
    private regularStorage: RegularStorage;
    private secureKeys: Set<string>;

    constructor() {
        this.secureStorage = new SecureStorage();
        this.regularStorage = new RegularStorage();
        this.secureKeys = new Set([
            STORAGE_KEYS.AUTH_TOKEN,
            STORAGE_KEYS.REFRESH_TOKEN,
            STORAGE_KEYS.USER_DATA,
        ]);
    }

    private getStorage(key: string): IStorage {
        return this.secureKeys.has(key) ? this.secureStorage : this.regularStorage;
    }

    async setItem(key: string, value: any): Promise<void> {
        const storage = this.getStorage(key);
        const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
        await storage.setItem(key, stringValue);
    }

    async getItem<T = any>(key: string): Promise<T | null> {
        const storage = this.getStorage(key);
        const value = await storage.getItem(key);
        if (value === null) return null;
        try {
            return JSON.parse(value) as T;
        } catch {
            return value as unknown as T;
        }
    }

    async removeItem(key: string): Promise<void> {
        const storage = this.getStorage(key);
        await storage.removeItem(key);
    }

    async clear(): Promise<void> {
        await Promise.all([
            this.secureStorage.clear(),
            this.regularStorage.clear(),
        ]);
    }

    // Utility methods for common operations
    async isAuthenticated(): Promise<boolean> {
        const token = await this.getItem(STORAGE_KEYS.AUTH_TOKEN);
        return !!token;
    }

    async getAuthToken(): Promise<string | null> {
        return await this.getItem(STORAGE_KEYS.AUTH_TOKEN);
    }

    async getUserData<T = any>(): Promise<T | null> {
        return await this.getItem<T>(STORAGE_KEYS.USER_DATA);
    }

    async clearAuth(): Promise<void> {
        await Promise.all([
            this.removeItem(STORAGE_KEYS.AUTH_TOKEN),
            this.removeItem(STORAGE_KEYS.REFRESH_TOKEN),
            this.removeItem(STORAGE_KEYS.USER_DATA),
        ]);
    }

    // Settings related methods
    async getAppSettings<T = any>(): Promise<T | null> {
        return await this.getItem<T>(STORAGE_KEYS.APP_SETTINGS);
    }

    async setAppSettings(settings: any): Promise<void> {
        await this.setItem(STORAGE_KEYS.APP_SETTINGS, settings);
    }

    async getLanguage(): Promise<string | null> {
        return await this.getItem(STORAGE_KEYS.LANGUAGE);
    }

    async setLanguage(language: string): Promise<void> {
        await this.setItem(STORAGE_KEYS.LANGUAGE, language);
    }
}

// Export a singleton instance
export const storage = new StorageManager();

// Example usage:
/*
await storage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'my-token'); // Stored securely
await storage.setItem(STORAGE_KEYS.LANGUAGE, 'en'); // Stored in regular storage
const token = await storage.getItem(STORAGE_KEYS.AUTH_TOKEN);
const isAuth = await storage.isAuthenticated();
const settings = await storage.getAppSettings();
await storage.clearAuth(); // Clears all auth-related data
*/