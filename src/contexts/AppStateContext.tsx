// src/contexts/AppStateContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { AppState, AppContextType, Theme, UserInfo } from '../types';

// Dummy user for simulated login
const DUMMY_USER: UserInfo = {
    id: '1',
    email: 'user@example.com',
    name: 'Demo User',
    preferences: {
        language: 'en',
        theme: 'light',
        notifications: true,
    },
};

// Initial state
const initialState: AppState = {
    isAuthenticated: false,
    userInfo: null,
    language: 'en',
    theme: 'light',
};

// Create context with default values
export const AppStateContext = createContext<AppContextType>({
    ...initialState,
    login: () => { },
    logout: () => { },
    changeLanguage: () => { },
    changeTheme: () => { },
});

// Custom hook for using the context
export const useAppState = () => {
    const context = useContext(AppStateContext);
    if (!context) {
        throw new Error('useAppState must be used within an AppStateProvider');
    }
    return context;
};

// Props type for the provider
interface AppStateProviderProps {
    children: React.ReactNode;
}

// Provider component
export const AppStateProvider: React.FC<AppStateProviderProps> = ({ children }) => {
    const [state, setState] = useState<AppState>(initialState);

    // Login handler
    const handleLogin = useCallback(() => {
        setTimeout(() => {
            setState(prev => ({
                ...prev,
                isAuthenticated: true,
                userInfo: DUMMY_USER,
            }));
        }, 1000);
    }, []);

    // Logout handler
    const handleLogout = useCallback(() => {
        setTimeout(() => {
            setState(prev => ({
                ...prev,
                isAuthenticated: false,
                userInfo: null,
            }));
        }, 500);
    }, []);

    // Language change handler
    const handleLanguageChange = useCallback((language: string) => {
        setState(prev => ({
            ...prev,
            language,
            userInfo: prev.userInfo
                ? {
                    ...prev.userInfo,
                    preferences: {
                        ...prev.userInfo.preferences,
                        language,
                    },
                }
                : null,
        }));
    }, []);

    // Theme change handler
    const handleThemeChange = useCallback((theme: Theme) => {
        setState(prev => ({
            ...prev,
            theme,
            userInfo: prev.userInfo
                ? {
                    ...prev.userInfo,
                    preferences: {
                        ...prev.userInfo.preferences,
                        theme,
                    },
                }
                : null,
        }));
    }, []);

    // Create the context value object
    const contextValue: AppContextType = {
        ...state,
        login: handleLogin,
        logout: handleLogout,
        changeLanguage: handleLanguageChange,
        changeTheme: handleThemeChange,
    };

    return (
        <AppStateContext.Provider value={contextValue}>
            {children}
        </AppStateContext.Provider>
    );
};

