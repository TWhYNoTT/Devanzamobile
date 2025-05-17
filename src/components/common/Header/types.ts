// src/components/common/Header/types.ts
import { ImageStyle } from 'react-native';
import { NavigationProp } from '@react-navigation/native';

export interface HeaderProps {
    dialog?: boolean;
    color?: string;
    back?: boolean;
    search?: boolean;
    logo?: boolean;
    language?: boolean;
    add?: boolean;
    share?: boolean;
    skpe?: boolean;
    Text?: string;
    iconTint?: ImageStyle['tintColor'];
    backPress: () => void;
    languageUpdate?: () => void;
    addClick?: () => void;
    skpeClick?: () => void;
    shareClick?: () => void;
    navigation: NavigationProp<any>;
}

export interface HeaderState {
    // Add if you need state
}

export interface HeaderReduxProps {
    data: {
        cart: any; // Replace with proper cart type
        userInfo: any; // Replace with proper userInfo type
    };
}