// src/components/react-native-otp/src/types.ts
export interface OTPInputProps {
    value?: string;
    onChange?: (value: string) => void;
    otpLength?: number;
    tintColor?: string;
    offTintColor?: string;
    containerStyle?: Object;
    cellStyle?: Object;
    defaultValue?: string;
    editable?: boolean;
    autoFocusOnLoad?: boolean;
}

export interface OTPInputRef {
    focus: () => void;
    blur: () => void;
    clear: () => void;
    isFocused: () => boolean;
}