// src/utils/platform.ts
import { Platform } from 'react-native';

// Only import Haptics on native platforms
let Haptics: any;
if (Platform.OS !== 'web') {
    Haptics = require('expo-haptics');
}

export const triggerHapticFeedback = async () => {
    if (Platform.OS !== 'web' && Haptics) {
        try {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch (error) {
            // Silently fail when haptics are unavailable
            console.log('Haptic feedback error:', error);
        }
    }
};

export const isWeb = Platform.OS === 'web';