// src/utils/responsive.ts
import { Dimensions, Platform } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const isTablet = screenWidth >= 768;
export const isDesktop = Platform.OS === 'web' && screenWidth >= 1024;

export const responsive = {
    width: (percentage: number) => (screenWidth * percentage) / 100,
    height: (percentage: number) => (screenHeight * percentage) / 100,
    // Responsive font sizes
    fontSize: (size: number) => {
        if (isDesktop) return size * 1.2;
        if (isTablet) return size * 1.1;
        return size;
    },
};