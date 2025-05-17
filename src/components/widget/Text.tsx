// src/components/widget/Text.tsx
import React from "react";
import { Text, StyleSheet, TextStyle, TextProps, Platform } from "react-native";
import { theme } from "../../core/theme";

interface TypographyProps extends TextProps {
  h1?: boolean;
  h2?: boolean;
  h3?: boolean;
  title?: boolean;
  body?: boolean;
  caption?: boolean;
  small?: boolean;
  size?: number;
  transform?: TextStyle['textTransform'];
  align?: TextStyle['textAlign'];
  regular?: boolean;
  bold?: boolean;
  semibold?: boolean;
  medium?: boolean;
  weight?: string;
  light?: boolean;
  center?: boolean;
  right?: boolean;
  spacing?: number;
  height?: number;
  color?: string;
  accent?: boolean;
  primary?: boolean;
  secondary?: boolean;
  tertiary?: boolean;
  black?: boolean;
  white?: boolean;
  gray?: boolean;
  gray2?: boolean;
  style?: TextStyle | TextStyle[];
}

const Typography: React.FC<TypographyProps> = ({
  style,
  children,
  weight,
  ...props
}) => {
  const textStyles = [
    styles.text,
    props.h1 && { fontSize: 32, fontWeight: 'bold' },
    props.h2 && { fontSize: 24, fontWeight: 'bold' },
    props.h3 && { fontSize: 18, fontWeight: 'bold' },
    props.title && { fontSize: 20, fontWeight: 'bold' },
    {
      fontFamily: Platform.select({
        android: 'AvenirMedium',
        ios: 'Avenir',
        web: 'Arial, Helvetica, sans-serif', // Web fallback fonts
      }),
      letterSpacing: 0.9,
      ...(Platform.OS === 'android'
        ? { fontFamily: weight === '500' ? 'AvenirMedium' : "AvenirSemiBold" }
        : {})
    },
    props.body && { fontSize: 16 },
    props.caption && { fontSize: 12 },
    props.small && { fontSize: 10 },
    props.transform && { textTransform: props.transform },
    props.align && { textAlign: props.align },
    props.spacing && { letterSpacing: props.spacing },
    weight && { fontWeight: weight },
    props.regular && styles.regular,
    props.bold && styles.bold,
    props.semibold && styles.semibold,
    props.medium && styles.medium,
    props.light && styles.light,
    props.center && styles.center,
    props.right && styles.right,
    props.color && ((styles as any)[props.color] || { color: props.color }),
    props.accent && styles.accent,
    props.primary && styles.primary,
    props.secondary && styles.secondary,
    props.tertiary && styles.tertiary,
    props.black && styles.black,
    props.white && styles.white,
    props.gray && styles.gray,
    props.gray2 && styles.gray2,
    style
  ];

  return (
    <Text style={textStyles} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    ...Platform.select({
      web: {
        // Ensure text renders properly on web
        display: 'inline-block',
      }
    })
  },
  regular: {
    fontFamily: Platform.select({
      android: 'AvenirMedium',
      ios: 'Avenir',
      web: 'Arial, Helvetica, sans-serif',
    }),
  },
  bold: {
    fontFamily: Platform.select({
      android: 'AvenirBold',
      ios: 'Avenir',
      web: 'Arial, Helvetica, sans-serif',
    }),
    fontWeight: Platform.select({
      web: 'bold',
      default: '900',
    }),
  },
  semibold: {
    fontFamily: Platform.select({
      android: "CAIRO-SEMIBOLD",
      ios: "CAIRO-SEMIBOLD",
      web: 'Arial, Helvetica, sans-serif',
    }),
    ...Platform.select({
      web: { fontWeight: '600' }
    })
  },
  medium: {
    fontFamily: Platform.select({
      android: "CAIRO-SEMIBOLD",
      ios: "CAIRO-SEMIBOLD",
      web: 'Arial, Helvetica, sans-serif',
    }),
    ...Platform.select({
      web: { fontWeight: '500' }
    })
  },
  light: {
    fontFamily: Platform.select({
      android: "CAIRO-LIGHT",
      ios: "CAIRO-LIGHT",
      web: 'Arial, Helvetica, sans-serif',
    }),
    ...Platform.select({
      web: { fontWeight: '300' }
    })
  },
  center: { textAlign: "center" },
  right: { textAlign: "right" },
  accent: { color: theme.colors.accent },
  primary: { color: theme.colors.primary },
  secondary: { color: theme.colors.secondary },
  tertiary: { color: theme.colors.tertiary },
  black: { color: theme.colors.black },
  white: { color: theme.colors.white },
  gray: { color: theme.colors.gray },
  gray2: { color: theme.colors.gray2 },
});

export default Typography;