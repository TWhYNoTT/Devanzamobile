import { Dimensions, I18nManager } from 'react-native';
import * as Localization from 'expo-localization';
import { moderateScale } from "react-native-size-matters";
import { DateTime } from "luxon";
import { memoize } from 'lodash';
import countries from './countries.json';
import Toast from 'react-native-toast-message';
import { FONT_FAMILY } from "../services/config";



// Create the translate function
export const translate = memoize(
    (key: string): string => {
        // Get current locale - you might want to get this from AsyncStorage or app state
        const currentLocale = Localization.locale.split('-')[0];
        const language = currentLocale === 'ar' ? 'ar' : 'en';

        // Get translations for current language
        const translations = translationGetters[language]();

        // Return the translated string or the key if translation not found
        return translations[key] || key;
    },
    (key: string) => key  // Keep the same memoization key
);


// Types
interface ToastConfig {
    message: string;
    type: 'success' | 'error' | 'info';
    position?: 'top' | 'bottom';
    duration?: number;
    textStyle?: object;
    titleStyle?: object;
}

interface PopupConfig {
    type: string;
    title: string;
    textBody: string;
    buttonText: string;
    duration: number;
    callback: () => void;
}

// Device detection
export const iPhoneSize = (): 'small' | 'medium' | 'large' => {
    const windowWidth = Dimensions.get('window').width;
    if (windowWidth === 320) return 'small'; // iPhone SE
    if (windowWidth === 414) return 'large'; // iPhone Plus
    return 'medium'; // iPhone 6/7
};

// Translations
export const translationGetters = {
    ar: () => require("../translations/ar.json"),
    en: () => require("../translations/en.json"),
};


export const setI18nConfig = (language: string): void => {
    const locales = Localization.getLocales();
    const selectedLanguage = language || locales[0]?.languageTag || 'en';
    const isRTL = selectedLanguage.startsWith('ar');

    // Clear translation cache
    if (translate.cache && typeof translate.cache.clear === 'function') {
        translate.cache.clear();
    }

    // Update layout direction
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);
};

// Toast messages
const showToast = ({ message, type, position = 'top', duration = 2000, textStyle = {}, titleStyle = {} }: ToastConfig): void => {
    Toast.show({
        type: type === 'error' ? 'error' : type,
        text1: String(message),
        position,
        visibilityTime: duration,
        topOffset: 50,
        props: {
            textStyle: {
                fontFamily: FONT_FAMILY,
                ...textStyle
            },
            titleStyle
        }
    });
};

export const showDanger = (message: string): void => {
    showToast({
        message: String(message).toUpperCase(),
        type: 'error',
        position: 'top',
        duration: 2000,
        textStyle: { textAlign: 'center' }
    });
};

export const showDangerTop = (message: string): void => {
    showToast({
        message,
        type: 'error',
        duration: 1000,
        titleStyle: { textAlign: 'center', width: '100%' },
        textStyle: {
            textAlign: 'center',
            borderRadius: moderateScale(50)
        }
    });
};

export const showSuccess = (message: string): void => {
    showToast({
        message,
        type: 'success',
        position: 'top',
        duration: 1500
    });
};

export const showSuccessPopup = (message: string, heading: string): void => {
    // Using Toast for popup functionality
    Toast.show({
        type: 'success',
        text1: heading,
        text2: message,
        visibilityTime: 1500,
        onHide: () => Toast.hide()
    });
};

export const showInfo = (message: string): void => {
    showToast({
        message,
        type: 'info',
        position: 'top',
        duration: 1000
    });
};

// Phone number formatting
export const formatePhoneNumber = (phone: string): string => {
    let phoneNumber = phone;
    const prefixes = ['+971', '00971', '0971', '971'];

    for (const prefix of prefixes) {
        phoneNumber = phoneNumber.replace(prefix, '');
    }

    return String(parseInt(phoneNumber.trim()));
};

// Date formatting
export const timeAgo = (date: string | Date, tz = 'UTC'): string | null => {
    if (!date) return null;
    return DateTime.fromISO(date.toString())
        .setZone(tz)
        .toRelative();
};

export const getTimeDate = (date: string | Date, tz = 'UTC'): string | null => {
    if (!date) return null;
    return DateTime.fromISO(date.toString())
        .setZone(tz)
        .toFormat('dd/MM/yyyy \'at\' hh:mma');
};

export const formateDuration = (h: number, m: number): string => {
    const hDisplay = h > 0 ? `${h}${h === 1 ? " h, " : " h, "}` : "";
    const mDisplay = m > 0 ? `${m}${m === 1 ? " min" : " min"}` : "";
    return hDisplay + mDisplay;
};

// Country code utilities
export const getCallingCode = (code: string): string => {
    const country = Object.values(countries).find(
        country => country.code === code
    );
    return country?.dial_code || '+971';
};

export const getCountryCode = (code: string): string => {
    const country = Object.values(countries).find(
        country => country.dial_code === code
    );
    return country?.code || 'AE';
};