// src/Entrypoint.tsx
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuthContext } from './contexts/AuthContext';
import AppNavigation from './navigation/AppNavigation';
import { AppStateContext } from './contexts/AppStateContext';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { AppState } from './types';
import { useQuery } from '@tanstack/react-query';
import { storage, STORAGE_KEYS } from './utils/storage/index';

const AppEntrypoint = () => {
  const { user, isInitialized, logout } = useAuthContext();

  // Query for app settings
  const { data: appSettings } = useQuery({
    queryKey: ['appSettings'],
    queryFn: async () => {
      const settings = await storage.getItem(STORAGE_KEYS.APP_SETTINGS);
      return settings ? JSON.parse(settings) : {
        language: 'en',
        theme: 'light',
        notifications: true
      };
    }
  });

  const contextValue: AppState = {
    isAuthenticated: !!user,
    userInfo: user ? {
      id: user.userId ? user.userId.toString() : '', // Safe check for userId
      email: user.email || '',
      name: user.fullName || '',
      preferences: {
        language: appSettings?.language || 'en',
        theme: appSettings?.theme || 'light',
        notifications: appSettings?.notifications ?? true,
      },
    } : null,
    language: appSettings?.language || 'en',
    theme: appSettings?.theme || 'light',
    changeLanguage: async (lang: string) => {
      await storage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify({
        ...appSettings,
        language: lang,
      }));
    },
    changeTheme: async (theme: 'light' | 'dark') => {
      await storage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify({
        ...appSettings,
        theme,
      }));
    },
    logout,
  };

  // Only show loading for initial app initialization, not during auth operations
  if (!isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AppStateContext.Provider value={contextValue}>
      <BottomSheetModalProvider>
        <View style={{ flex: 1 }}>
          <AppNavigation />
        </View>
      </BottomSheetModalProvider>
    </AppStateContext.Provider>
  );
};

export default AppEntrypoint;