// LoadingOverlay.tsx
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { theme } from '../../../../../../core/theme';
import { styles } from '../styles';

interface LoadingOverlayProps {
    isVisible: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isVisible }) => {
    if (!isVisible) return null;

    return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
    );
};