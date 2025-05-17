import { MD3Theme, DefaultTheme } from 'react-native-paper';
import * as themes from '../components/widget/constant';

const theme = {
  ...DefaultTheme,
  colors: {
    ...themes.colors,
    primary: '#6138E0',
    disColor: '#CBD4E4',
    warning: '#FFC107',
    success: '#4CAF50',
    info: '#2196F3',
    error: '#F44336',
    primaryLight: '#DBD1F9',
    Xgray: '#283444',
    Xgray3: '#333333',
    Xblue: '#6138E0',
  },
  fonts: themes.fonts,
  sizes: themes.sizes,
} as const;


export { theme };