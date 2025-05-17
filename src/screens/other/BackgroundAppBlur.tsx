// src/components/BackgroundAppBlur.tsx
import React, { useState, useEffect } from 'react';
import { AppState, View, Platform } from 'react-native';
import { BlurView } from 'expo-blur';

interface BackgroundAppBlurProps { }

export const BackgroundAppBlur: React.FC<BackgroundAppBlurProps> = () => {
    const [appState, setAppState] = useState(AppState.currentState);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', setAppState);

        return () => {
            subscription.remove();
        };
    }, []);

    if (appState === 'active') {
        return null;
    }

    return (
        <BlurView
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
            }}
            intensity={10}
            tint="light"
        />
    );
};

export default BackgroundAppBlur;