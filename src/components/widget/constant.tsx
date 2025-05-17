// src/components/widget/constant.ts
import { DefaultTheme } from 'react-native-paper';

export interface CustomColors extends Record<string, string> {
    primary: string;
    icon: string;
    secondary: string;
    primarydark: string;
    disabled: string;
    mixed: string;
    black: string;
    primarylight: string;
    gray: string;
    grayBackgroundSlots: string;
    grayBackgroundOtp: string;
    line: string;
    grayText: string;
    blackText: string;
    onSurface: string;
    grayBackground: string;
    grayBackground1: string;
    lightBlack: string;
    white: string;
    green01: string;
    green02: string;
    darkOrange: string;
    lightGray: string;
    lightGrayText: string;
    pink: string;
    gray01: string;
    gray02: string;
    gray03: string;
    gray04: string;
    gray05: string;
    gray06: string;
    gray07: string;
    brown01: string;
    brown02: string;
    green: string;
    accent: string;
    tertiary: string;
    gray2: string;
    red: string;
    yellow: string;
    pending: string;
    approved: string;
    canceled: string;
    completed: string;
}

export const colors: CustomColors = {
    primary: '#6138E0',
    icon: '#EE572B',
    secondary: '#2B2F31',
    primarydark: '#0F4556',
    disabled: "#909FBA",
    mixed: "#B15EAA",
    black: '#283444',
    primarylight: '#DBD1F9',
    gray: '#909FBA',
    grayBackgroundSlots: '#E6E9F5',
    grayBackgroundOtp: '#E2E7F2',
    line: '#DDE2EE',
    grayText: '#909FBA',
    blackText: '#333333',
    onSurface: '#000000',
    grayBackground: '#F7F7F7',
    grayBackground1: '#F0F3F9',
    lightBlack: '#484848',
    white: '#ffffff',
    green01: '#008388',
    green02: '#02656b',
    darkOrange: '#d93900',
    lightGray: '#d8d8d8',
    lightGrayText: '#8698B7',
    pink: '#fc4c54',
    gray01: '#f3f3f3',
    gray02: '#919191',
    gray03: '#b3b3b3',
    gray04: '#484848',
    gray05: '#dadada',
    gray06: '#ebebeb',
    gray07: '#f2f2f2',
    brown01: '#ad8763',
    brown02: '#7d4918',
    green: '#27C650',
    accent: "#222222",
    tertiary: "#FFE358",
    gray2: "#C5CCD6",
    red: "#FF2943",
    yellow: "#FED000",
    pending: '#FD8809',
    approved: '#27C650',
    canceled: '#FF2943',
    completed: '#909FBA',
    ...Object.fromEntries(
        Object.entries(DefaultTheme.colors).filter(([key]) => key !== 'elevation')
    )
};

export interface Sizes {
    base: number;
    font: number;
    radius: number;
    padding: number;
    h1: number;
    h2: number;
    h3: number;
    title: number;
    header: number;
    body: number;
    caption: number;
}

export const sizes: Sizes = {
    base: 16,
    font: 14,
    radius: 6,
    padding: 25,
    h1: 26,
    h2: 20,
    h3: 18,
    title: 18,
    header: 16,
    body: 14,
    caption: 12,
};

export const fonts = {
    h1: { fontSize: sizes.h1 },
    h2: { fontSize: sizes.h2 },
    h3: { fontSize: sizes.h3 },
    header: { fontSize: sizes.header },
    title: { fontSize: sizes.title },
    body: { fontSize: sizes.body },
    caption: { fontSize: sizes.caption }
} as const;