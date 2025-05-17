// App.tsx
import React, { useRef } from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './src/contexts/AuthContext';
import AppEntrypoint from './src/Entrypoint';
import { setNavigationRef } from './src/api/axios';

if (Platform.OS === 'web') {
    console.warn = () => { };
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            retryDelay: 1000,
            staleTime: 300000, // 5 minutes
            gcTime: 3600000, // 1 hour
        },
    },
});

export default function App() {
    const navigationRef = useRef(null);

    // Set navigation reference for axios
    React.useEffect(() => {
        setNavigationRef(navigationRef);
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <SafeAreaProvider>
                        <NavigationContainer ref={navigationRef}>
                            <AppEntrypoint />
                            <StatusBar style="auto" />
                            <Toast />
                        </NavigationContainer>
                    </SafeAreaProvider>
                </GestureHandlerRootView>
            </AuthProvider>
        </QueryClientProvider>
    );
}