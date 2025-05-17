// src/screens/home/bottoms/auth/types.ts
import { NavigationProp } from '@react-navigation/native';
import { Animated } from 'react-native';

export interface LoginDialogProps {
    navigation: NavigationProp<any>;
    hide: () => void;
    LoginPageParams?: {
        navigate: string;
    };
}

export interface AnimationState {
    top: Animated.Value;
    center: Animated.Value;
    bottom: Animated.Value;
}

export interface LoginState {
    isLoading: boolean;
    checkEmail: boolean;
    email: string;
    password: string;
    HideShow: boolean;
    facebookLoading: boolean;
    googleLoading: boolean;
}

export interface InputRefs {
    email: any;
    password: any;
}

// src/screens/home/bottoms/auth/types.ts
export interface ForgetPasswordState {
    isLoading: boolean;
    resend: boolean;
    otp: string;
    message: string;
    verificationCode: Animated.Value;
    emailLayout: Animated.Value;
    inputPassword: Animated.Value;
    emailSent: boolean;
    phone: string;
    password: string;
    Confirmpassword: string;
    optView: boolean;
    selectCountry: boolean;
    callingCode: string;
    passwordView: boolean;
    user: any;
    flag: string;
    showRed?: boolean;
    HideShow?: boolean;
    cca2?: string;
    sendAgainDisbale?: boolean;
}

export interface CountryPickerValue {
    cca2: string;
    callingCode: string;
}